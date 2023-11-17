import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function Role() {

  const {_id} = useParams();
  const [values, setValues] = useState({
    _id: _id,
    name: '',
    email:'',
    role: ''
  })

  useEffect(() => {
    axios.get(`http://localhost:3001/userDetails/`+_id)
    .then(res => {
      setValues({...values, name:res.data.name, email: res.data.email, role: res.data.role})
    })
    .catch(err => console.log(err))
  }, [])

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`http://localhost:3001/userDetails/` + _id, values)
      .then(async (res) => {
        // Add the log message creation and axios post request here
        let message = `${values.name} (${values.email}) role has been changed to ${values.role} by admin.`;
        const response = await axios.post('http://localhost:3001/save-log', { logContent: message });
        console.log('Log message saved to the database:', response.data);
  
        navigate('/manageuser');
      })
      .catch(err => console.log(err));
  };


  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center" style={{ background: 'linear-gradient(to bottom right, #A6BCE8, #FFC0C0)' }}>
      <div className="w-50 border bg-secondary text-white p-5">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='name'>Name:</label>
            <input type="text" name="name" className="form-control" placeholder='Enter Name' value={values.name} onChange={e => setValues({...values, name: e.target.value})} required></input>
          </div>
          <div>
            <label htmlFor='email'>Name:</label>
            <input type="email" name="email" className="form-control" placeholder='Enter Email' value={values.email} onChange={e => setValues({...values, email: e.target.value})} required></input>
          </div>
          <div>
            <label htmlFor='role'>Role:</label>
            <input type="text" name="role" className="form-control" placeholder='Enter Role' value={values.role} onChange={e => setValues({...values, role: e.target.value})} required></input>
          </div>
          <br></br>
          <button className='btn btn-info'>Update</button>
        </form>
      </div>
    </div>
  )
}

export default Role;