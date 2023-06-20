import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';

function Dogfacts() {
  // const [dogFacts, setDogFacts] = useState([]);

  // useEffect(() => {
  //   fetchDogFacts();
  // }, []);

  // const fetchDogFacts = async () => {
  //   try {
  //     const response = await axios.get('https://dog.ceo/api/breeds/list/all');
  //     const breeds = Object.keys(response.data.message);
  //     const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];

  //     const factResponse = await axios.get(
  //       `https://dog-api.kinduff.com/api/facts?number=5&breed=${randomBreed}`
  //     );

  //     setDogFacts(factResponse.data.facts);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // return (
  //   <div>
  //     <Header />
  //     <h1>Dog Facts</h1>
  //     {dogFacts.length > 0 ? (
  //       <ul>
  //         {dogFacts.map((fact, index) => (
  //           <li key={index}>{fact}</li>
  //         ))}
  //       </ul>
  //     ) : (
  //       <p>Loading dog facts...</p>
  //     )}
  //   </div>
  // );
}

export default Dogfacts;
