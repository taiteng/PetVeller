import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminHeader from '../components/AdminHeader';

function AdminContact() {
    const handleEmailClick = (email) => {
        const mailtoLink = `mailto:${email}`;
        window.location.href = mailtoLink;
      };
  const [contacts, setContacts] = useState([]);

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

  return (
    <div>
      <AdminHeader />
        <center>
      <div className="contact-list">
        {contacts.map((contact) => (
          <div className="card" key={contact._id} >
            <h2>{contact.firstName} {contact.surname}</h2>
            <p
                onClick={() => handleEmailClick(contact.email)}
                style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
              >
                Email: {contact.email}
              </p>
            
            <p>Phone: {contact.phone}</p>
            <p>Message: {contact.message}</p>
          </div>
          
          
        ))}
      </div>
      </center>
    </div>
  );
}

export default AdminContact;
