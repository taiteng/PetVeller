import { useState, useRef } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header';
import Footer from '../components/Footer';
import {jwtDecode} from 'jwt-decode';



function Login() {

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [errors, setErrors] = useState({})
    const [showConfirmation, setShowConfirmation] = useState(false)
    const navigate = useNavigate()

    const validateForm = () => {
        let formIsValid = true;
        const errors = {};
    
        if (!email) {
          formIsValid = false;
          errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
          formIsValid = false;
          errors.email = 'Email is invalid';
        }
    
        if (!password) {
          formIsValid = false;
          errors.password = 'Password is required';
        }
    
        setErrors(errors);
        return formIsValid;
      };

    const handleSubmit = (e) => {
        e.preventDefault();

        if(validateForm()){
            axios.post('http://localhost:3001/login', {email, password})
            .then(async result => {
                const decodedToken = jwtDecode(result.data.token);
                const { user } = decodedToken;
                if(user.email === 'admin@gmail.com'){
                    sessionStorage.uRole = 'admin';
                    navigate('/admin');
                }
                else if(result.data === 'The Password Is Incorrect'){
                    setShowConfirmation(true);
                }
                else if(result.data === 'User Not Found'){
                    setShowConfirmation(true);
                }
                else{
                    sessionStorage.uRole = user.role;
                    sessionStorage.uEmail = user.email;
                    sessionStorage.uName = user.name;
                    sessionStorage.uPass = user.password;
                    let message = `${user.name} (${user.email}) logged in.`;
                    const response = await axios.post('http://localhost:3001/save-log', { logContent: message });
                    console.log('Log message saved to the database:', response.data);
                    navigate('/');
                }
            })
            .catch(err => console.log(err))
        }
    }
    

    return(
        <>
        <div style={{ background: 'linear-gradient(to bottom right, #A6BCE8, #FFC0C0)' }}>
            <Header/>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="bg-white p-3 rounded w-25">
                    <h2 className="text-uppercase text-center mb-5">Login</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="form-content">

                            <div className="d-flex flex-row align-items-center mb-4">
                                <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                                <div className="form-outline flex-fill mb-0">
                                    <input type="email" id="email" name="email" placeholder="Your Email" className="form-control form-control-lg" 
                                    onChange={(e) => setEmail(e.target.value)}/>
                                </div>
                            </div>
                            {errors.email && (
                                <div className="text-danger mb-2">{errors.email}</div>
                            )}

                            <div className="d-flex flex-row align-items-center mb-4">
                                <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                                <div className="form-outline flex-fill mb-0">
                                    <input type="password" id="password" name="password" placeholder="Password" className="form-control form-control-lg" 
                                    onChange={(e) => setPassword(e.target.value)}/>
                                </div>
                            </div>
                            {errors.password && (
                                <div className="text-danger mb-2">{errors.password}</div>
                            )}

                            <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                <button type="submit" className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login</button>
                            </div>

                            <p className="text-center text-muted mt-5 mb-0">Don't Have An Account Yet? <a href="/register"
                            className="fw-bold text-body"><u>Register here</u></a></p>

                        </div>
                    </form>
                </div>
            </div>
            {showConfirmation && (
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow'>
                <p>Incorrect Email or Password</p>
                <div className='flex justify-end mt-4'>
                <button
                    className='px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400'
                    onClick={() => setShowConfirmation(false)}
                >
                    OK
                </button>
                </div>
            </div>
            )}
            <Footer/>
        </div>
        </>
    );
}

export default Login;