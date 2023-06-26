import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { Button, Container } from 'react-bootstrap';
import "../components/css/ContactUsStyle.css";
import Footer from '../components/Footer';


function ContactUs() {
  
  return (

    <div  style={{ background: 'linear-gradient(to bottom right, #A6BCE8, #FFC0C0)' }}>
      <Header />
      <br></br>
      <div className='body'>
        <div className="card">
  <h2>Contact Us</h2>
  <div class="row">
    <div class="col">
      <div class="form-group">
        <label>First Name</label>
        <input type="text"/>
      </div>
    </div>

    <div class="col">
      <div class="form-group">
        <label>Surname</label>
        <input type="text"/>
      </div>
    </div>

    <div class="col">
      <div class="form-group">
        <label>Email</label>
        <input type="text"/>
      </div>
    </div>

    <div class="col">
      <div class="form-group">
        <label>Phone</label>
        <input type="text"/>
      </div>
    </div>

    <div class="col">
      <div class="form-group">
        <label>Message</label>
        <textarea></textarea>
      </div>
    </div>

    <div class="col">
      <input type="submit" value="Submit"/>
    </div>
  </div>
</div></div>
<br></br>
<br></br>
<br></br>
      <Footer />
    </div>
  )
}

export default ContactUs