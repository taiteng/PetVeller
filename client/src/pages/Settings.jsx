import React, { useState} from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Header from '../components/Header';
import BackToTop from '../components/BackToTop';
import Footer from '../components/Footer';
import Button from '@mui/material/Button';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import he from 'he';
import SecurityBanner from '../components/SecurityBanner';

function Settings() {
    const token = sessionStorage.getItem('token');

    let userRole = '';
    let userName = '';
    let userEmail = '';
    let userPassword = '';
    
    if (token) {
      const decodedToken = jwtDecode(token);
      const { user: decodedUser } = decodedToken;
    
      if (decodedUser) {
        userRole = decodedUser.role ?? '';
        userName = encodeHTML(decodedUser.name) ?? '';
        userEmail = encodeHTML(decodedUser.email) ?? '';
        userPassword = decodedUser.password ?? '';
      }
    }

    const [userrole, setUserRole] = useState(sessionStorage.uRole);
    const [username, setUsername] = useState(userName);
    const [oldUsername, setOldUsername] = useState(userName);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [email, setEmail] = useState(userEmail);
    const [editingUsername, setEditingUsername] = useState(false);
    const [editingPassword, setEditingPassword] = useState(false);
    const [editingEmail, setEditingEmail] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [emailError, setEmailError] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [currentPasswordError, setCurrentPasswordError] = useState('');
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{7,})/;

    const validateForm = () => {
        let formIsValid = true;
        const errors = {};

        if (username.trim() === "") {
            formIsValid = false;
            errors.username = 'Username is required';
            setUsername(userName)
        }

        if (email.trim() === "") {
            formIsValid = false;
            errors.email = 'Email is required';
            setEmailError('Email is required');
            setEmail(userEmail)
        }

        if (currentPassword != "" && newPassword != "" && !passwordRegex.test(newPassword)) {
            formIsValid = false;
            errors.newPassword = "New Password must have at least 7 characters, including one uppercase letter, one lowercase letter, and one special character.";
            setNewPassword("")
            setCurrentPassword("")
            setCurrentPasswordError("")
        }

        setErrors(errors);
        return formIsValid;
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleCurrentPasswordChange = (e) => {
        setCurrentPassword(e.target.value);
    };

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleEditUsername = () => {
        setEditingUsername(true);
    };

    const handleEditPassword = () => {
        setEditingPassword(true);
    };

    const handleCancelEditPassword = () => {
        setCurrentPasswordError("")
        setNewPasswordError("")
        setEditingPassword(false);
    };

    const handleEditEmail = () => {
        setEditingEmail(true);
    };

    const handleSaveUsername = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const updatedUsername = e.target.elements.username.value;
            const userDetail = {
                email: userEmail,
                newName: updatedUsername,
                name: userName,
            };

            await axios.post('http://localhost:3001/updateUsername', { userDetail })
                .then(async (result) => {
                    console.log(result);
                    if (result.data.message === "User Name Updated") {

                        //setOldUsername(user.name)
                        //Delete the old token
                        sessionStorage.token = "";

                        //Assign the new token with new information
                        sessionStorage.token = result.data.token;
                        const decodedToken = jwtDecode(result.data.token);
                        const { user } = decodedToken;

                        console.log('User Name Updated');

                        let message = `${user.name} (${user.email}) update the username from ${userName} to ${user.name}.`;
                        const response = await axios.post('http://localhost:3001/save-log', { logContent: message });
                        console.log('Log message saved to the database:', response.data);
                        setUsername(encodeHTML(user.name))
                    }
                    else {
                        console.log('User Not Found')
                    }
                })
                .catch((err) => console.log(err));
        }

        setEditingUsername(false);
    }

    const handleSavePassword = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const currentPassword = e.target.elements.currentPassword.value;
            const newPassword = e.target.elements.newPassword.value;

            const userDetail = {
                email: userEmail,
                pass: newPassword,
                oldPass: currentPassword,
                name: userName
            };

            await axios.post('http://localhost:3001/updatePassword', { userDetail })
                .then((result) => {
                    console.log(result);
                    if (result.data.message === "User Password Updated") {

                        //Empty the old token
                        sessionStorage.token = "";

                        sessionStorage.token = result.data.token;

                        setNewPassword("")
                        setCurrentPassword("")
                        setCurrentPasswordError('');
                        setNewPasswordError('');
                        console.log('User Password Updated');
                    }
                    else if (result.data.message === "User Current password is unmatched") {
                        setCurrentPasswordError('Your current password is unmatched');
                        console.log('Unmatched Current Password')
                        setCurrentPassword("")
                        setNewPassword("")
                    }
                    else if (result.data.message === "User New Password is weak") {
                        setNewPasswordError('Your new password is weak');
                        console.log('Weak New Password')
                        setCurrentPassword("")
                        setNewPassword("")
                    }
                    else {
                        console.log('User Not Found')
                    }
                })
                .catch((err) => console.log(err));

        }
        setEditingPassword(false);
    };

    const handleSaveEmail = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const updatedEmail = e.target.elements.email.value;
            const userDetail = {
                email: userEmail,
                newEmail: updatedEmail,
                name: userName
            };

            await axios.post('http://localhost:3001/updateEmail', { userDetail })
                .then(async (result) => {
                    console.log(result);
                    if (result.data.message === "User Email Updated") {

                        //Delete the old token
                        sessionStorage.token = "";

                        //Assign the new token with new information
                        sessionStorage.token = result.data.token;
                        const decodedToken = jwtDecode(result.data.token);
                        const { user } = decodedToken;

                        setEmailError('');
                        let message = `${user.name} (${user.email}) update the email from ${userEmail} to ${user.email}.`;
                        const response = await axios.post('http://localhost:3001/save-log', { logContent: message });
                        console.log('Log message saved to the database:', response.data);
                        
                    } else if (result.data.message === "Email has been taken") {
                        setEmail(encodeHTML(userEmail))
                        setEmailError('Email has been taken. Please use a different email.');

                    } else if (result.data.message === "Email is the same with your old email") {
                        setEmail(encodeHTML(userEmail))
                        setEmailError('Email is the same with your old email. Please use a different email.');
                    }
                    else {
                        console.log('User Not Found')
                    }
                })
                .catch((err) => console.log(err));

        }
        setEditingEmail(false);
    };

    const handleTerminateAccount = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleConfirmTerminate = async () => {
        const userDetail = {
            email: userEmail,
            pass: userPassword,
            name: userName
        };

        await axios.post('http://localhost:3001/terminateAccount', { userDetail })
            .then(async (result) => {
                console.log(result);
                if (result.data === "Account Terminated") {
                    let message = `${userName} (${userEmail}) account has been terminated.`;
                    const response = await axios.post('http://localhost:3001/save-log', { logContent: message });
                    console.log('Log message saved to the database:', response.data);
                    handleLogout()
                    console.log('Account Terminated and Navigate to home');
                }
                else {
                    console.log('User Not Found')
                }
            })
            .catch((err) => console.log(err));

        setModalOpen(false);
    };

    const handleLogout = () => {
        removeUserSession();
        setUsername(undefined);
        setEmail(undefined);
        navigate('/');
    };

    const removeUserSession = () => {
        sessionStorage.uEmail = '';
        sessionStorage.uName = '';
        sessionStorage.uPass = '';
        sessionStorage.uRole = '';
        sessionStorage.token = '';
        console.log('User Removed');
    };

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };


    const [isPopupOpen, setPopupOpen] = useState(false);

    const openPopup = () => {
        setPopupOpen(true);
    };

    const closePopup = () => {
        setPopupOpen(false);
    };

    const handlePayment = () => {
        if (userRole != 'premiumUser') {
            navigate('/payment');
        }
        else {
            openPopup();
            console.log('User is already a premium user.');
        }
    }

    function encodeHTML(str) {
        return he.encode(str); 
    }

    if (!token) {
        return (
          <div style={{
            background: '#FFCCCC',
            padding: '20px',
            margin: '20px',
            borderRadius: '5px',
            textAlign: 'center',
            color: '#FF0000',
            fontWeight: 'bold',
          }}>
            Access denied
            <br />
            <a href='/' style={{ color: 'blue', textDecoration: 'underline' }}>Back to Home Page</a>
          </div>
        );
      }

    return (
        <>
            <div style={{ background: 'linear-gradient(to bottom right, #A6BCE8, #FFC0C0)' }}>
                <style>
                    {`
                .welcome-container {
                  background: linear-gradient(to bottom right, #FBE8E8, #FCC2C2);
                  text-align: center;
                  padding: 40px;
                  border-radius: 10px;
                }
    
                .welcome-heading {
                  font-size: 36px;
                  font-weight: bold;
                  margin-bottom: 20px;
                  background-image: linear-gradient(to right, violet, indigo, blue, green, yellow, orange, red);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-size: 200% auto; /* Adjust the background size as per your preference */
                  animation: rainbow-effect 10s linear infinite;
                }
                
                .error-message {
                  color: red;
                  font-size: 12px;
                  margin-top: 5px;
                }
                
                .user-profile {
                  background: linear-gradient(to bottom right, #FBE8E8, #FCC2C2);
                  padding: 20px;
                  border-radius: 20px;
                  margin: 20px 0;
                  max-width: 900px;
                  margin: 20px auto;
                  padding-top: 30px;
                  padding-bottom: 30px;
                }
                
                .profile-title {
                  font-size: 24px;
                  font-weight: bold;
                  margin-bottom: 10px;
                }
                
                .profile-field {
                    display: flex;
                    align-items: flex-start; /* Adjust alignment as per your preference */
                    margin-bottom: 20px;
                  }
                
                .field-label {
                  font-weight: bold;
                  width: 120px;
                  color: #333333;
                }
                
                .field-value {
                  flex-grow: 1;
                  padding: 8px;
                  border-radius: 4px;
                  border: 1px solid #cccccc;
                  background-color: #f5f5f5;
                }
                
                .action-buttons {
                  display: flex;
                  justify-content: flex-end;
                  margin-top: 20px;
                }
                
                .edit-button,
                .cancel-button,
                .terminate-button,
                .upgrade-button {
                  background-color: #1976d2;
                  color: #ffffff;
                  border: none;
                  border-radius: 4px;
                  padding: 8px 16px;
                  cursor: pointer;
                  transition: background-color 0.3s ease;
                  margin-left: 10px;
                }
                
                .edit-button:hover,
                .cancel-button,
                .terminate-button:hover,
                .upgrade-button:hover, {
                  background-color: #1565c0;
                }
              `}
                </style>
                <Header />
                <SecurityBanner />
                <div className="user-profile">
                    <div className="profile-title">My Profile</div>
                    <div className="profile-field">
                        <div className="field-label">Username:</div>
                        {editingUsername ? (
                            <>
                                <form onSubmit={handleSaveUsername}>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={handleUsernameChange}
                                        className="field-value"
                                        name="username"
                                    />

                                    <button type="submit" className="edit-button">
                                        Save
                                    </button>
                                </form>

                            </>
                        ) : (
                            <>
                                <div className="field-value">{username}</div>
                                <button className="edit-button" onClick={handleEditUsername}>
                                    Edit
                                </button>
                                {errors.username && <div className="error-message">{errors.username}</div>}
                            </>
                        )}
                    </div>
                    <div className="profile-field">
                        <div className="field-label">Password:</div>
                        {editingPassword ? (
                            <>
                                <form onSubmit={handleSavePassword}>
                                    <div>Current Password</div>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={handleCurrentPasswordChange}
                                        className="field-value"
                                        name="currentPassword"
                                        required
                                    />
                                    <div>New Password</div>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={handleNewPasswordChange}
                                        className="field-value"
                                        name="newPassword"
                                        required
                                    />
                                    <button type="button" className="cancel-button" style={{ backgroundColor: 'red' }} onClick={handleCancelEditPassword}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="edit-button">
                                        Save
                                    </button>
                                </form>

                            </>
                        ) : (
                            <>
                                <div className="field-value"></div>
                                <button className="edit-button" onClick={handleEditPassword}>
                                    Change Password
                                </button>
                                <div>
                                    {newPasswordError && <div className="error-message">{newPasswordError}</div>}
                                    {currentPasswordError && <div className="error-message">{currentPasswordError}</div>}
                                </div>
                                <div>
                                    {errors.currentPassword && <div className="error-message" >{errors.currentPassword}</div>}
                                    {errors.newPassword && <div className="error-message" >{errors.newPassword}</div>}
                                </div>
                            </>
                        )}
                    </div>
                    <div className="profile-field">
                        <div className="field-label">Email:</div>
                        {editingEmail ? (
                            <>
                                <form onSubmit={handleSaveEmail}>
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={handleEmailChange}
                                        className="field-value"
                                        name="email"
                                    />
                                    <button type="submit" className="edit-button">
                                        Save
                                    </button>
                                </form>
                                {errors.email && <div className="error-message">{errors.email}</div>}
                            </>
                        ) : (
                            <>
                                <div className="field-value">{email}</div>
                                <div>
                                    <button className="edit-button" onClick={handleEditEmail}>
                                        Edit
                                    </button>
                                </div>
                                {emailError && <div className="error-message">{emailError}</div>}
                            </>
                        )}
                    </div>
                    <div className="profile-field">
                        <div className="field-label">Role:</div>
                        <form>
                            <input
                                readOnly
                                type="text"
                                value={userRole}
                                className="field-value"
                                name="role"
                            />
                        </form>
                    </div>
                    <Modal
                        isOpen={isPopupOpen}
                        onRequestClose={closePopup}
                        style={customStyles}
                        contentLabel="Upgrade Account Error"
                    >
                        <div>
                            <h2>User is already a premium user.</h2>
                            <div className="action-buttons">
                                <button className="upgrade-button" style={{ backgroundColor: 'blue' }} onClick={closePopup}>Close Modal</button>
                            </div>
                        </div>
                    </Modal>
                    <div className="action-buttons" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <button
                                            className="upgrade-button"
                                            style={{ backgroundColor: 'blue' }}
                                            onClick={handlePayment}>
                                            Upgrade Account
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="terminate-button"
                                            style={{ backgroundColor: 'red' }}
                                            onClick={handleTerminateAccount}>
                                            Terminate Account
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <BackToTop />
                <Footer />
                <Dialog open={isModalOpen} onClose={handleCloseModal}>
                    <DialogTitle>Terminate Account</DialogTitle>
                    <DialogContent>
                        <p>Are you sure you want to terminate your account? This action cannot be undone.</p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmTerminate} color="primary" variant="contained">
                            Terminate
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
};


export default Settings;
