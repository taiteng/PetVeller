import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const containerStyle = {
  background: 'linear-gradient(to bottom right, #A6BCE8, #FFC0C0)',
  minHeight: '100vh',
};

const contentStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '40px',
};

const headingStyle = {
  fontSize: '28px',
  fontWeight: 'bold',
  marginBottom: '20px',
  background: 'linear-gradient(to bottom right, #FBE8E8, #FCC2C2)',
  padding: '10px 20px',
  borderRadius: '10px', // Add borderRadius property for curved corners
};

const favoritesContainerStyle = {
  background: 'linear-gradient(to bottom right, #FBE8E8, #FCC2C2)',
  padding: '20px',
  borderRadius: '10px', // Add borderRadius property for curved corners
};

const favoriteItemStyle = {
    // Add your desired styles for the favorite item
    background: 'linear-gradient(to bottom right, #A6BCE8, #FFC0C0)', // Example gradient colors
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px', // Add marginBottom for line break
  };




function FavoritePage() {
  const [data, setData] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    fetchFavouriteData();
  }, []);

  const fetchFavouriteData = async () => {
    try {
      setDataLoading(true);
      const userEmail = sessionStorage.getItem('uEmail');
      if (userEmail) {
        const favouriteRes = await axios.post(
          'http://localhost:3001/favouriteNews',
          { userEmail }
        );
        const favouriteData = favouriteRes.data;
        setData(favouriteData);
        setDataLoading(false);
      }
    } catch (error) {
      console.log(error);
      setDataLoading(false);
    }
  };

  const renderFavorites = () => {
    if (dataLoading) {
      return <p>Loading...</p>;
    } else {
      return (
        <div style={favoritesContainerStyle}>
          {data.map((item) => (
            <div key={item._id} style={favoriteItemStyle}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <h2 style={{ fontWeight: 'bold' }}>{item.title}</h2>
                <p>{item.description}</p>
              </a>
              <br />
            </div>
          ))}
        </div>
      );
    }
  };
  

  

  return (
    <div style={containerStyle}>
      <Header />
      <div style={contentStyle}>
        <h1 style={headingStyle}>Your Favorite Articles</h1>
        {renderFavorites()}
      </div>
      <Footer />
    </div>
  );
}

export default FavoritePage;
