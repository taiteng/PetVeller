import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { Button, Container } from 'react-bootstrap';
import "../components/css/CatFactStyle.css";
import Footer from '../components/Footer';


function Catfacts() {
  const [data, setData] = useState([]);
  const [image, setImage] = useState([]);

    const url= `https://catfact.ninja/facts?limit=6`;
    const imageUrl= `https://api.thecatapi.com/v1/images/search?limit=6&api_key=live_1mcv1m75repApocbaSeLQ0By2z6IF4jvnSLjxDKC2te9S6oNunefBcoSW1upu2nT`;
   
    const refresh=()=>{
      window.location.reload(true);
    }

    const fetchInfo = () => { 
      return fetch(url) 
              .then((res) => res.json()) 
              .then((d) => setData(d.data)) ;
      }

      const fetchImage = () => { 
        return fetch(imageUrl) 
                .then((res) => res.json()) 
                .then((d) => setImage(d)) ;
        }
      
      useEffect(() => {
        fetchInfo();
        fetchImage();
      }, []);

    
  return (
    
    <div style={{ background: 'linear-gradient(to bottom right, #A6BCE8, #FFC0C0)' }}>
    <Header />
    <br></br>
    <div id="img-wrapper">
    {image.length > 0 ? (
      
                image.map((images, index) => (
                  <div
                    key={index}
                   
                  >
                    <div className='imageBox'>
                    <img id='image' src={images.url}/>
                </div>
                  </div>
                ))
                
            ) : (
              <p className="text-lg">Loading image...</p>
            )}
            </div>
    
            {/* <div id="img-wrapper">
                <div className='imageBox'>
                    <img src="https://cdn2.thecatapi.com/images/1q7.jpg"/>
                </div>
                <div className='imageBox'>
                    <img src="https://cdn2.thecatapi.com/images/1q7.jpg"/>
                </div>
                <div className='imageBox'>
                    <img src="https://cdn2.thecatapi.com/images/1q7.jpg"/>
                </div>
                <div className='imageBox'>
                    <img src="https://cdn2.thecatapi.com/images/1q7.jpg"/>
                </div>
                <div className='imageBox'>
                    <img src="https://cdn2.thecatapi.com/images/1q7.jpg"/>
                </div>
                <div className='imageBox'>
                    <img src="https://cdn2.thecatapi.com/images/1q7.jpg"/>
                </div>
            </div> */}
    {data.length > 0 ? (
                data.map((facts, index) => (
                  <div
                    key={index}
                    className="bg-blue-100 border border-blue-500 rounded p-4 my-4"
                    style={{ background: 'linear-gradient(to bottom right, #FBE8E8, #FCC2C2)' }}
                  >
                    <p className="text-lg">{facts.fact}</p>
                  </div>
                ))
             
            ) : (
              <p className="text-lg">Loading cat facts...</p>
            )}
    <center>
    <button className='button' onClick={refresh}>Generate a new one</button>
    </center>
    <br></br>
    <br></br>
    <br></br>
    <Footer />
  </div>
  )
}

export default Catfacts