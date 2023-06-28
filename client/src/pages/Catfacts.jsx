import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { Button, Container } from 'react-bootstrap';
import "../components/css/CatFactStyle.css";
import Footer from '../components/Footer';

function Catfacts() {
  const [data, setData] = useState([]);
  const [image, setImage] = useState([]);
  const [hover, setHover] = useState(false);

  const HoverData = "Click or pinch to Zoom Image";
  const imageUrl = `https://api.thecatapi.com/v1/images/search?limit=6&api_key=live_1mcv1m75repApocbaSeLQ0By2z6IF4jvnSLjxDKC2te9S6oNunefBcoSW1upu2nT`;

  const onHover = (e) => {
    e.preventDefault();
    setHover(true); // turn true
    console.log("hovered");
  };

  const onHoverOver = (e) => {
    e.preventDefault(); // turn false
    setHover(false);
  };


  const fetchCatFacts = () => {
    axios
      .get('http://localhost:3001/catFacts')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log('Error retrieving cat facts:', error);
      });
  };

  const fetchImage = () => {
    return fetch(imageUrl)
      .then((res) => res.json())
      .then((d) => setImage(d));
  };

  useEffect(() => {
    fetchCatFacts();
    fetchImage();
  }, []);

  return (
    <div style={{ background: 'linear-gradient(to bottom right, #A6BCE8, #FFC0C0)' }}>
      <Header />
      <br></br>
      <div id="img-wrapper">
        {image.length > 0 ? (
          image.map((images, index) => (
            <div key={index}>
              <div className='imageBox'>
                {hover && <p className={hover}>{HoverData}</p>}
                <img id='image' onMouseEnter={(e) => onHover(e)} onMouseLeave={(e) => onHoverOver(e)} src={images.url} />
              </div>
            </div>
          ))
        ) : (
          <p className="text-lg">Loading image...</p>
        )}
      </div>

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
      </center>

      <br></br>
      <br></br>
      <br></br>
      <Footer />
    </div>
  )
}

export default Catfacts;
