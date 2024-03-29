import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{7,})/;

  const validateForm = () => {
    let formIsValid = true;
    const errors = {};

    if (!name) {
      formIsValid = false;
      errors.name = 'Name is required';
    }

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

    if (password != "" && !passwordRegex.test(password)) {
      formIsValid = false;
      errors.password = "Password must have at least 7 characters, including one uppercase letter, one lowercase letter, and one special character.";
    }

    setErrors(errors);
    return formIsValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

      
    if (validateForm()) {
      const defaultRole = 'freeUser';
      axios.post('http://localhost:3001/register', { name:name, email:email, password:password, role:defaultRole })
        .then(async (result) => {
          console.log(result);
          if(result.data === 'User Exists'){
            navigate('/register')
          }
          else{
            let message = `${name} (${email}) registered successfully.`;
            const response = await axios.post('http://localhost:3001/save-log', { logContent: message });
            console.log('Log message saved to the database:', response.data);
            navigate('/login');
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <>
    <div style={{ background: 'linear-gradient(to bottom right, #A6BCE8, #FFC0C0)' }}>
      <Header/>
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="bg-white p-3 rounded w-25">
          <h2 className="text-uppercase text-center mb-5">Register</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-content">
              <div className="d-flex flex-row align-items-center mb-4">
                <i className="fas fa-user fa-lg me-3"></i>
                <div className="form-outline flex-fill mb-0">
                  <input type="text" id="name" name="name" placeholder="Your Name" className="form-control form-control-lg"
                    onChange={(e) => setName(e.target.value)} />
                </div>
              </div>
              {errors.name && (
                <div className="text-danger mb-2">{errors.name}</div>
              )}

              <div className="d-flex flex-row align-items-center mb-4">
                <i className="fas fa-envelope fa-lg me-3"></i>
                <div className="form-outline flex-fill mb-0">
                  <input type="email" id="email" name="email" placeholder="Your Email" className="form-control form-control-lg"
                    onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              {errors.email && (
                <div className="text-danger mb-2">{errors.email}</div>
              )}

              <div className="d-flex flex-row align-items-center mb-4">
                <i className="fas fa-key fa-lg me-3"></i>
                <div className="form-outline flex-fill mb-0">
                  <input type="password" id="password" name="password" placeholder="Password" className="form-control form-control-lg"
                    onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>
              {errors.password && (
                <div className="text-danger mb-2">{errors.password}</div>
              )}

              <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                <button type="submit" className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Register
                </button>
              </div>

              <p className="text-center text-muted mt-5 mb-0">
                Already have an account?{' '}
                <a href="/login" className="fw-bold text-body">
                  Login here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
      <Footer/>
    </div>
    </>
  );
}

export default Signup;