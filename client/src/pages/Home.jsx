import { useState, useEffect } from 'react';
import Header from '../components/Header';
import dogImage from '../assets/dog.jpg';
import catImage from '../assets/cat.jpg';
import BackToTop from '../components/BackToTop';

function Home() {
  const [news, setNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAnimalNews();
  }, []);

  const fetchAnimalNews = async () => {
    try {
      const response = await fetch(
        'https://newsapi.org/v2/everything?q=animal&apiKey=b5d91466301044ceb91fef30afb719d2'
      );
      const data = await response.json();
      setNews(data.articles);
    } catch (error) {
      console.log('Error fetching animal news:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredNews = news.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div>
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
          background-color: #f3f3f3;
          text-align: center;
          padding: 40px;
          border-radius: 10px; /* Add rounded corners */
        }

        .welcome-heading {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .news-container {
          margin-top: 40px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          grid-gap: 20px;
        }

        .news-card {
          padding: 20px;
          background-color: #f3f3f3;
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
        `}
      </style>
      <div className="container mx-auto mt-8">
        <div className="welcome-container">
          <h1 className="welcome-heading">Welcome to Dog and Cat World!</h1>
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
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="news-container">
          {filteredNews.map((article, index) => (
            <div className="news-card" key={index}>
              <a href={article.url} className="news-link">
                <h3 className="news-title">{article.title}</h3>
              </a>
              <img src={article.urlToImage} alt="News" className="news-image" />
              <p className="news-description">{article.description}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Home;
