import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { Button, Container } from 'react-bootstrap';
import "../components/css/CatFactStyle.css";
import Footer from '../components/Footer';


function Catfacts() {
  const [data, setData] = useState([]);
    const url= `https://catfact.ninja/fact`;
    const fetchInfo = () => { 
      return fetch(url) 
              .then((res) => res.json()) 
              .then((d) => setData(d)) ;
      }
      
      useEffect(() => {
        fetchInfo();
      }, []);
    
  return (
    <div style={{ background: 'linear-gradient(to bottom right, #A6BCE8, #FFC0C0)' }}>
    <Header />
    <br></br>
    {data.length > 0 ? (
                <div
                  className="bg-blue-100 border border-blue-500 rounded p-4 my-4"
                  style={{ background: 'linear-gradient(to bottom right, #FBE8E8, #FCC2C2)' }}
                >
                  <p className="text-lg">{data.fact}</p>
                </div>
             
            ) : (
              <p className="text-lg">Loading cat facts...</p>
            )}
    <center>
    <button className='button'>Generate a new one</button>
    </center>
    <Footer />
  </div>
  )
}

export default Catfacts