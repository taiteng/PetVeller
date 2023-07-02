import React, { useState } from 'react';
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

function Settings() {
    const [username, setUsername] = useState(sessionStorage.uName);
    const [password, setPassword] = useState(sessionStorage.uPass);
    const [email, setEmail] = useState(sessionStorage.uEmail);
    const [editingUsername, setEditingUsername] = useState(false);
    const [editingPassword, setEditingPassword] = useState(false);
    const [editingEmail, setEditingEmail] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [emailError, setEmailError] = useState('');

    const validateForm = () => {
        let formIsValid = true;
        const errors = {};

        if (username.trim() === "") {
            formIsValid = false;
            errors.username = 'Username is required';
            setUsername(sessionStorage.uName)
        }

        if (email.trim() === "") {
            formIsValid = false;
            errors.email = 'Email is required';
            setEmailError('Email is required');
            setEmail(sessionStorage.uEmail)
        }

        if (password.trim() === "") {
            formIsValid = false;
            errors.password = 'Password is required';
            setPassword(sessionStorage.uPass)
        }

        setErrors(errors);
        return formIsValid;
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
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

    const handleEditEmail = () => {
        setEditingEmail(true);
    };

    const handleSaveUsername = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const updatedUsername = e.target.elements.username.value;
            const userDetail = {
                email: sessionStorage.uEmail,
                pass: sessionStorage.uPass,
                newName: updatedUsername,
                name: sessionStorage.uName
            };

            axios.post('http://localhost:3001/updateUsername', { userDetail })
                .then((result) => {
                    console.log(result);
                    if (result.data === "User Name Updated") {
                        setUsername(updatedUsername);
                        sessionStorage.uName = updatedUsername;
                        console.log('User Name Updated');
                    }
                    else {
                        console.log('User Not Found')
                    }
                })
                .catch((err) => console.log(err));
        }

        setEditingUsername(false);
    }
    const handleSavePassword = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const updatedPassword = e.target.elements.password.value;
            const userDetail = {
                email: sessionStorage.uEmail,
                pass: updatedPassword,
                oldPass: sessionStorage.uPass,
                name: sessionStorage.uName
            };

            axios.post('http://localhost:3001/updatePassword', { userDetail })
                .then((result) => {
                    console.log(result);
                    if (result.data === "User Password Updated") {
                        setPassword(updatedPassword);
                        sessionStorage.uPass = updatedPassword;
                        console.log('User Password Updated');
                    }
                    else {
                        console.log('User Not Found')
                    }
                })
                .catch((err) => console.log(err));

        }
        setEditingPassword(false);
    };

    const handleSaveEmail = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const updatedEmail = e.target.elements.email.value;
            const userDetail = {
                email: sessionStorage.uEmail,
                pass: sessionStorage.uPass,
                newEmail: updatedEmail,
                name: sessionStorage.uName
            };
            axios.post('http://localhost:3001/updateEmail', { userDetail })
                .then((result) => {
                    console.log(result);
                    if (result.data === "User Email Updated") {

                        setEmail(updatedEmail);
                        sessionStorage.uEmail = updatedEmail;
                        console.log('User Email Updated');
                        setEmailError('');
                    } else if (result.data === "Email has been taken") {
                        console.log(email)
                        setEmail(sessionStorage.uEmail)
                        console.log(email)
                        setEmailError('Email has been taken. Please use a different email.');

                    }else if(result.data === "Email is the same with your old email"){
                        console.log(email)
                        setEmail(sessionStorage.uEmail)
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
            email: sessionStorage.uEmail,
            pass: sessionStorage.uPass,
            name: sessionStorage.uName
        };

        await axios.post('http://localhost:3001/terminateAccount', { userDetail })
            .then((result) => {
                console.log(result);
                if (result.data === "Account Terminated") {
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
        console.log('User Removed');
    };

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
                  max-width: 500px;
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
                .terminate-button {
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
                .terminate-button:hover {
                  background-color: #1565c0;
                }
              `}
                </style>
                <Header />
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
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        className="field-value"
                                        name="password"
                                    />
                                    
                                    <button type="submit" className="edit-button">
                                        Save
                                    </button>
                                </form>
                                
                            </>
                        ) : (
                            <>
                                <div className="field-value">{password}</div>
                                <button className="edit-button" onClick={handleEditPassword}>
                                    Edit
                                </button>
                                {errors.password && <div className="error-message">{errors.password}</div>}
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
                    <div className="action-buttons">
                        <button
                            className="terminate-button"
                            style={{ backgroundColor: 'red' }}
                            onClick={handleTerminateAccount}
                        >
                            Terminate Account
                        </button>
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
