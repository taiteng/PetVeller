import { useEffect, useState } from 'react';
import AdminHeader from '../components/AdminHeader';
import NumberPicker from 'react-widgets/NumberPicker';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';

function ManageUser() {
  const [value, setValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState('');
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  
  const [logMessage, setLogMessage] = useState('');
    
  const token= sessionStorage.token;
  const decodedToken = jwtDecode(token);
  const { user } = decodedToken;
  const userRole = user.role;
  const userName =user.name;
  const userEmail = user.email;
  const currentTime = new Date().toLocaleString();
  
  useEffect(() => {
    async function sendLogMessage() {
      if (userRole !== 'admin') {
        let message = '';
        if (userRole === '') {
          message = `An anonymous is trying to access the admin page at ${currentTime}. Access denied.`;
        } else {
          message = `${userName} (${userEmail}) is trying to access the admin page at ${currentTime}. Access denied.`;
        }

        setLogMessage(message);

        try {
          const response = await axios.post('http://localhost:3001/save-log', { logContent: message });
          console.log('Log message saved to the database:', response.data);
        } catch (error) {
          console.error('Error saving log message to the database:', error);
        }
      }
    }

    sendLogMessage();
  }, []);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = () => {
    axios
      .get('http://localhost:3001/userDetails')
      .then((response) => {
        setUserDetails(response.data);
      })
      .catch((error) => {
        console.log('Error retrieving user details:', error);
      });
  };

  const handleDeleteUser = (id) => {
    axios
      .post(`http://localhost:3001/deleteuserdetails/${id}`)
      .then((response) => {
        console.log('User deleted:', response.data);
        fetchUserDetails();
      })
      .catch((error) => {
        console.log('Error deleting user:', error);
      });
  };

  const handleRole = (userId) => {
    setSelectedUserId(userId);
    navigate('/role');
  };
   
    if (userRole !== 'admin') {
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
    <div style={{ background: 'linear-gradient(to bottom right, #A6BCE8, #FFC0C0)' }}>
      <AdminHeader />
      {err && <h2>{err}</h2>}

      <br />
      <br />
      <center>
        <h1 style={{ fontSize: 30 }}>
          <strong>User Table</strong>
        </h1>
        <br />
        {userDetails.length > 0 ? (
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {userDetails.map((user) => (
                <tr key={user._id}>
                  <td className="border px-4 py-2">{user._id}</td>
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.role}</td>
                  <td className="border px-4 py-2">
                    <Link
                        className="bg-orange-500 text-white px-3 py-1 rounded" to={`/role/${user._id}`}
                        // onClick={() => handleRole(user._id)}
                        >
                        Manage Role
                    </Link>
                    <span style={{ marginRight: '10px' }}></span>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No user found.</p>
        )}
       
        <br />
        <br />
      </center>
    </div>
  );
}

export default ManageUser;
