import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminHeader from '../components/AdminHeader';
import {jwtDecode} from 'jwt-decode';

function Admin() {
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
    <div>
      <AdminHeader />
    </div>
  );
}

export default Admin;
