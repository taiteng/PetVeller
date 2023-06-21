import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';

function Dogfacts() {
  const [dogFacts, setDogFacts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDogFacts();
  }, []);

  const fetchDogFacts = async () => {
    try {
      const response = await axios.get('https://api.thedogapi.com/v1/breeds');
      const breeds = response.data;
      const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];

      const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const apiUrl = `https://dog-facts-api.herokuapp.com/api/v1/resources/dogs?number=5&breed=${encodeURIComponent(
        randomBreed.name
      )}`;

      const factResponse = await axios.get(corsProxyUrl + apiUrl);

      setDogFacts(factResponse.data);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch dog facts. Please try again later.');
    }
  };

  return (
    <div>
      <Header />
      <h1>Dog Facts</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {dogFacts.length > 0 ? (
            dogFacts.map((fact, index) => <li key={index}>{fact.fact}</li>)
          ) : (
            <p>Loading dog facts...</p>
          )}
        </ul>
      )}
    </div>
  );
}

export default Dogfacts;
