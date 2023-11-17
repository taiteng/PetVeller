import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminHeader from '../components/AdminHeader';
import {jwtDecode} from 'jwt-decode';

function AdminContact() {
  const [contacts, setContacts] = useState([]);
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
          message = `An anonymous is trying to access the adminContact page at ${currentTime}. Access denied.`;
        } else {
          message = `${userName} (${userEmail}) is trying to access the adminContact page at ${currentTime}. Access denied.`;
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
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/contact');
      setContacts(response.data);
    } catch (error) {
      console.log('Error fetching contacts:', error);
    }
  };

  const handleEmailClick = (email) => {
    const mailtoLink = `mailto:${email}`;
    window.location.href = mailtoLink;
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

  const renderContactList = () => {
    return contacts.map((contact) => (
      <div className="card" key={contact._id}>
        <h2>{contact.firstName} {contact.surname}</h2>
        <p
          onClick={() => handleEmailClick(contact.email)}
          style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
        >
          Email: {contact.email}
        </p>

        <p>Phone: {contact.phone}</p>
        <p>Message: <span dangerouslySetInnerHTML={{ __html: contact.message }} /></p>
      </div>
    ));
  };

  return (
    <div style={{ background: 'linear-gradient(to bottom right, #A6BCE8, #FFC0C0)' }}> 
      <AdminHeader />
      <br />
      <center>
        <div className="contact-list">
        {renderContactList()}
        <br />
        </div>
      </center>
    </div>
  );
}

export default AdminContact;
