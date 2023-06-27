import { useState, useEffect } from 'react';
import Header from '../components/Header';
import dogImage from '../assets/dog.jpg';
import catImage from '../assets/cat.jpg';
import BackToTop from '../components/BackToTop';
import Footer from '../components/Footer';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';


// Initialize FontAwesome library
library.add(faHeart);

function Home() {
  const [news, setNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [displayedNewsCount, setDisplayedNewsCount] = useState(8);


  useEffect(() => {
    setUserEmail(sessionStorage.uEmail);
    fetchAnimalNews();
  }, []);

  const fetchAnimalNews = async () => {
    try {
      const response = await fetch(
        'https://newsapi.org/v2/everything?q=animal&apiKey=b5d91466301044ceb91fef30afb719d2'
      );
      const data = await response.json();
      setNews(data.articles);

      if(sessionStorage.uEmail === ''){

      }
      else{
        
      }


    } catch (error) {
      console.log('Error fetching animal news:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleShowMore = () => {
    setDisplayedNewsCount(displayedNewsCount + 8);
  };

  const filteredNews = news.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedNews = filteredNews.slice(0, displayedNewsCount);


  const handleFavorite = async (article, userEmail) => {
    const { id, title, description, url } = article;
  
    try {
      const response = await axios.post('http://localhost:3001/addFavorite', {
        article: { id, title, description, url },
        userEmail: userEmail,
      });
  
      console.log(response.data);
      if (response.data === 'Article already in favorites') {
        console.log('Article already in favorites');
      } else {
        console.log('Saved to favorites');
      }
      // Handle success or show feedback to the user
    } catch (error) {
      if (error.response && error.response.data === 'Article already in favorites') {
        console.log('Article already in favorites');
      } else {
        console.log('Error adding to favorites:', error);
        // Handle other errors or show feedback to the user
      }
    }
  };
  
  
  
  


  return (
    <div style={{ background: 'linear-gradient(to bottom right, #A6BCE8, #FFC0C0)' }}>
      <Header />
      <BackToTop />
      <style>
        {`
        .image-container {
          position: relative;
          overflow: hidden;
        }
        
        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .image-container:hover .image-overlay {
          opacity: 1;
        }
        
        .image-text {
          color: white;
          font-size: 18px;
          font-weight: bold;
          text-align: center;
          pointer-events: none;
        }

        .image {
          height: 300px; /* Adjust the height as per your requirements */
        }

        .welcome-container {
          background: linear-gradient(to bottom right, #FBE8E8, #FCC2C2);
          text-align: center;
          padding: 40px;
          border-radius: 10px;
        }

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

        .news-container {
          margin-top: 40px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          grid-gap: 20px;
        }

        .news-card {
          padding: 20px;
          background: linear-gradient(to bottom right, #FBE8E8, #FCC2C2);
          border-radius: 10px;
        }

        .news-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .news-description {
          font-size: 16px;
          margin-bottom: 10px;
        }
        .button-container {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
        
        .show-more-button {
          padding: 10px 20px;
          font-size: 16px;
          background-color: #f3f3f3;
          color: black;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        
        .show-more-button:hover {
          background-color: #283593;
        }
        .center-button {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
        .search-container {
          position: relative;
        }
        
        .search-input {
          padding: 10px 35px 10px 15px;
          border: 1px solid #ccc;
          border-radius: 5px;
          outline: none;
          width: 300px;
          font-size: 16px;
          
          background-position: 10px center;
          background-repeat: no-repeat;
          background-size: 20px;
        }
        .favorite-button {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 24px;
          color: #ff0000;
          transition: color 0.3s ease;
        }
        
        .favorite-button:hover {
          color: #ff5f5f;
        }
        
        `}
      </style>
      <div className="container mx-auto mt-8">
        <div className="welcome-container">
          <h1 className="welcome-heading">~ Welcome to Dog and Cat World ~ </h1>
        </div>
        <br></br>
        <br></br>
        <div className="flex justify-around">
          <div className="max-w-sm rounded overflow-hidden shadow-lg">
            <a href="/dog" className="image-container">
              <img src={dogImage} alt="Dog" className="w-full image" />
              <div className="image-overlay">
                <div className="image-text">Learn More</div>
              </div>
            </a>
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">Dogs</div>
              <p className="text-gray-700 text-base">
                Learn all about our furry canine friends. Discover various dog breeds, their characteristics, and interesting facts.
              </p>
            </div>
          </div>
          <div className="max-w-sm rounded overflow-hidden shadow-lg">
            <a href="/cat" className="image-container">
              <img src={catImage} alt="Cat" className="w-full image" />
              <div className="image-overlay">
                <div className="image-text">Learn More</div>
              </div>
            </a>
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">Cats</div>
              <p className="text-gray-700 text-base">
                Dive into the world of cats! Explore different cat breeds, their behaviors, and fascinating trivia about our feline companions.
              </p>
            </div>
          </div>
        </div>
        <br></br>
        <br></br>
        <div className="welcome-container">
          <h1 className="welcome-heading">Animal News</h1>
          <div className="search-container">
            <input
              className="search-input"
              type="text"
              placeholder="&#128269; Search news..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="container mx-auto mt-8">

          
        <div className="news-container">
        {displayedNews.map((article, index) => (
          <div className="news-card" key={index}>
            <a href={article.url} className="news-link">
              <h3 className="news-title">{article.title}</h3>
            </a>
            <img src={article.urlToImage} alt="News" className="news-image" />
            <p className="news-description">{article.description}</p>
            <button onClick={() => handleFavorite(article)} className="favorite-button">
              <FontAwesomeIcon icon={faHeart} />
            </button>
          </div>
        ))}
      </div>

        
        
        <div className="center-button">
        {filteredNews.length > displayedNewsCount && (
          <button onClick={handleShowMore} className="show-more-button">
            Show More
          </button>
        )}
        </div>
        <br></br>
      </div>
      <br></br>

      </div>
      <Footer />
    </div>
  );
}

export default Home;
