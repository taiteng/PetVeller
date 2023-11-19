import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import he from 'he';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import SecurityBanner from '../components/SecurityBanner';

import '../components/css/ContactUsStyle.css';

function ContactUs() {
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContent, setDialogContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      firstName,
      surname,
      email,
      phone,
      message,
    };



    if (validateForm(formData)) {
      const sanitizedFormData = {
        firstName: encodeHTML(formData.firstName),
        surname: encodeHTML(formData.surname),
        email: encodeHTML(formData.email),
        phone: encodeHTML(formData.phone),
        message: encodeHTML(formData.message),
      };

      axios
        .post('http://localhost:3001/contact', sanitizedFormData)
        .then((response) => {
          console.log('Contact form data saved:', response.data);
          // Reset form fields
          setFirstName('');
          setSurname('');
          setEmail('');
          setPhone('');
          setMessage('');
          setErrors({});
          setOpenDialog(true);
          setDialogTitle('Success');
          setDialogContent('Contact form data saved successfully.');
        })
        .catch((error) => {
          console.log('Error saving contact form data:', error);
          setOpenDialog(true);
          setDialogTitle('Error');
          setDialogContent('Failed to save contact form data.');
        });
    }
  };

  function encodeHTML(str) {
    return he.encode(str); 
  }

  const validateForm = (formData) => {
    let errors = {};
    let isValid = true;

    if (!formData.firstName.trim()) {
      errors.firstName = 'First Name is required';
      isValid = false;
    }

    if (!formData.surname.trim()) {
      errors.surname = 'Surname is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone is required';
      isValid = false;
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogTitle('');
    setDialogContent('');
  };

  return (
    <div style={{ background: 'linear-gradient(to bottom right, #A6BCE8, #FFC0C0)' }}>
      <Header />
      <SecurityBanner/>
      <br></br>
      <div className='body'>
        <div className='card'>
          <h2>Contact Us</h2>
          <form onSubmit={handleSubmit}>
            <div className='row'>
              <div className='col'>
                <div className='form-group'>
                  <label>First Name</label>
                  <input type='text' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  {errors.firstName && <span className='error'>{errors.firstName}</span>}
                </div>
              </div>
              <div className='col'>
                <div className='form-group'>
                  <label>Surname</label>
                  <input type='text' value={surname} onChange={(e) => setSurname(e.target.value)} />
                  {errors.surname && <span className='error'>{errors.surname}</span>}
                </div>
              </div>
              <div className='col'>
                <div className='form-group'>
                  <label>Email</label>
                  <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} />
                  {errors.email && <span className='error'>{errors.email}</span>}
                </div>
              </div>
              <div className='col'>
                <div className='form-group'>
                  <label>Phone</label>
                  <input type='text' value={phone} onChange={(e) => setPhone(e.target.value)} />
                  {errors.phone && <span className='error'>{errors.phone}</span>}
                </div>
              </div>
              <div className='col'>
                <div className='form-group'>
                  <label>Message</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                  {errors.message && <span className='error'>{errors.message}</span>}
                </div>
              </div>
              <div className='col'>
                <input type='submit' value='Submit' />
              </div>
            </div>
          </form>
        </div>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <Footer />

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='primary'>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ContactUs;
