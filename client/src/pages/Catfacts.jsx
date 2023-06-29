import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import '../components/css/CatFactStyle.css';
import Footer from '../components/Footer';

function Catfacts() {
  const [data, setData] = useState([]);
  const [image, setImage] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

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
    const key = 'live_1mcv1m75repApocbaSeLQ0By2z6IF4jvnSLjxDKC2te9S6oNunefBcoSW1upu2nT';
    const imageUrl = `https://api.thecatapi.com/v1/images/search?limit=${data.length}&api_key=${key}`;

    return fetch(imageUrl)
      .then((res) => res.json())
      .then((d) => setImage(d));
  };

  useEffect(() => {
    fetchCatFacts();
  }, []);

  useEffect(() => {
    fetchImage();
  }, [data]);

  const handleHover = (index) => {
    setHoveredIndex(index);
  };

  const handleHoverOut = () => {
    setHoveredIndex(null);
  };

  return (
    <div style={{ background: 'linear-gradient(to bottom right, #A6BCE8, #FFC0C0)' }}>
      <Header />
      <br></br>
      <div id="img-wrapper">
        {image.length > 0 ? (
          image.map((imageData, index) => (
            <div key={index} className="imageBox" onMouseEnter={() => handleHover(index)} onMouseLeave={handleHoverOut}>
              <img
                id="image"
                className={hoveredIndex === index ? 'blur' : ''}
                src={imageData.url}
                alt={`Cat Image ${index}`}
              />
              {hoveredIndex === index && (
                <div className="factBox">
                  <p className="text-lg">{data[index].fact}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-lg">Loading image...</p>
        )}
      </div>


      <br></br>
      <br></br>
      <br></br>
      <Footer />
    </div>
  );
}

export default Catfacts;
