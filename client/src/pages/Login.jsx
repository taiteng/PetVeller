import { useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3001/login', {email, password})
        .then(result => {
            console.log(result);
            if(result.data === 'User Logged In Successfully'){
                navigate('/');
            }
            else if(result.data === 'Admin Logged In'){
                navigate('/admin');
            }
        })
        .catch(err => console.log(err))
    }
    

    return(
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
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

                        <div className="d-flex flex-row align-items-center mb-4">
                            <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                            <div className="form-outline flex-fill mb-0">
                                <input type="password" id="password" name="password" placeholder="Password" className="form-control form-control-lg" 
                                onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                        </div>

                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                            <button type="submit" className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login</button>
                        </div>

                        <p className="text-center text-muted mt-5 mb-0">Don't Have An Account Yet? <a href="/register"
                        className="fw-bold text-body"><u>Register here</u></a></p>

                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;