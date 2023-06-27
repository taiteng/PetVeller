import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import Footer from '../components/Footer';

function Dogfacts() {
  const [dogFacts, setDogFacts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDogFacts();
  }, []);

  const fetchDogFacts = async () => {
    try {
      const factResponse = await axios.get(
        `https://cat-fact.herokuapp.com/facts/random?animal_type=dog&amount=4`
      );

      setDogFacts(factResponse.data);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch dog facts. Please try again later.');
    }
  };

  const generateNewFacts = () => {
    fetchDogFacts();
  };

  return (
    <div style={{ background: 'linear-gradient(to bottom right, #A6BCE8, #FFC0C0)' }}>
      <Header />
      <br></br>
      <style>
        {`
        .welcome-heading {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 20px;
          background-image: linear-gradient(to right, violet, indigo, blue, green, yellow, orange, red);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% auto; /* Adjust the background size as per your preference */
          animation: rainbow-effect 10s linear infinite;
        }
        
        @keyframes rainbow-effect {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        `}
      </style>
      <div className="welcome-container">
      <h1 className="text-center text-4xl font-bold mt-8 mb-4 welcome-heading ">Dog Facts</h1>
      </div>
      <br></br>
      <div className="container mx-auto">
        {error ? (
          <p className="text-red-500 text-lg">{error}</p>
        ) : (
          <div>
            {dogFacts.length > 0 ? (
              dogFacts.map((fact, index) => (
                <div
                  key={index}
                  className="bg-blue-100 border border-blue-500 rounded p-4 my-4"
                  style={{ background: 'linear-gradient(to bottom right, #FBE8E8, #FCC2C2)' }}
                >
                  <p className="text-lg">{fact.text}</p>
                </div>
              ))
            ) : (
              <p className="text-lg">Loading dog facts...</p>
            )}
            <br></br>
            <div className="flex justify-center mt-4">
              <button onClick={generateNewFacts} className="generate-facts-button bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Generate New Facts
              </button>
            </div>
            <br></br>
            <br></br>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Dogfacts;
