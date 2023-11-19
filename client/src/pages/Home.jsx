import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import dogImage from "../assets/dog.jpg";
import catImage from "../assets/cat.jpg";
import BackToTop from "../components/BackToTop";
import Footer from "../components/Footer";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { jwtDecode } from "jwt-decode";

// Initialize FontAwesome library
library.add(faHeart);

function Home() {
  const [news, setNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [displayedNewsCount, setDisplayedNewsCount] = useState(8);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("uEmail");
    if (storedEmail) {
      setUserEmail(storedEmail);
    }

    // Check if there are favorite articles in local storage
    const storedArticles = localStorage.getItem("favoriteArticles");
    if (storedArticles) {
      setNews(JSON.parse(storedArticles));
    } else {
      fetchAnimalNews();
    }
  }, []);

  const handleSort = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
  };

  const fetchAnimalNews = async () => {
    try {
      const response = await fetch(
        "https://newsapi.org/v2/everything?q=animal&apiKey=b5d91466301044ceb91fef30afb719d2"
      );
      const data = await response.json();
      setNews(data.articles);
    } catch (error) {
      console.log("Error fetching animal news:", error);
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

  const sortedNews = filteredNews.sort((a, b) => {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();

    if (titleA < titleB) {
      return sortOrder === "asc" ? -1 : 1;
    }
    if (titleA > titleB) {
      return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  });

  const displayedNews = sortedNews.slice(0, displayedNewsCount);

  const handleFavorite = async (article, userEmail) => {
    if (!userEmail) {
      // User email is missing, cannot favorite
      setConfirmationMessage("Please Sign-In Account First");
      setShowConfirmation(true);
      return;
    }

    const { title, description, url } = article;

    try {
      const response = await axios.post(
        "http://localhost:3001/toggleFavorite",
        {
          article: { title, description, url },
          userEmail: userEmail,
        }
      );

      if (response.data === "Removed from favorites") {
        let message = `${userName} (${userEmail}) Removed the news from favorites.`;
        const response = await axios.post("http://localhost:3001/save-log", {
          logContent: message,
        });
        console.log("Log message saved to the database:", response.data);
        setConfirmationMessage("Removed from favorites");
      } else if (response.data === "Added to favorites") {
        let message = `${userName} (${userEmail}) Added the news to favorites.`;
        const response = await axios.post("http://localhost:3001/save-log", {
          logContent: message,
        });
        console.log("Log message saved to the database:", response.data);
        setConfirmationMessage("Added to favorites");
      } else {
        setConfirmationMessage("Unknown response");
      }
      setShowConfirmation(true);

      // Update the news state to reflect the favorite status
      const updatedNews = news.map((item) =>
        item.title === title ? { ...item, favorite: !item.favorite } : item
      );
      setNews(updatedNews);

      // Store the updated favorite status in local storage
      localStorage.setItem("favoriteArticles", JSON.stringify(updatedNews));
    } catch (error) {
      setConfirmationMessage("Error toggling favorite");
      setShowConfirmation(true);
      if (error.response) {
        console.log("Server responded with:", error.response.data);
      } else if (error.request) {
        console.log("No response received:", error.request);
      } else {
        console.log("Error setting up the request:", error.message);
      }
      console.log("Error toggling favorite:", error);
    }
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <div
      style={{
        background: "linear-gradient(to bottom right, #A6BCE8, #FFC0C0)",
      }}
    >
      <Header />
      <BackToTop />
      <style>
        {`

          .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999;
          }

          .modal-content {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            text-align: center;
            max-width: 400px; /* Adjust the width as per your preference */
            margin: 0 auto; /* Center the modal horizontally */
          }

          .modal-message {
            font-size: 18px;
            margin-bottom: 20px;
          }

          .modal-button {
            padding: 10px 20px;
            font-size: 16px;
            background-color: #f3f3f3;
            color: black;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }

          .modal-button:hover {
            background-color: #283593;
            color: white;
          }


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
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          grid-gap: 20px;
        }

        .news-card {
          position: relative;
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
          position: absolute;
          bottom: 10px;
          right: 10px;
          padding: 10px;
          font-size: 20px;
          background-color: transparent;
          border: none;
          color: gray;
          cursor: pointer;
        }
        
        .favorite-button.favorite-red {
          color: red;
        }

        .sort-button {
          padding: 10px 20px;
          font-size: 16px;
          background-color: #f3f3f3;
          color: black;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-left: 10px;
        }
        
        .sort-button:hover {
          background-color: #283593;
          color: white;
        }
        
        

        
        `}
      </style>
      {showConfirmation && (
        <div className="modal">
          <div className="modal-content">
            <p className="modal-message">{confirmationMessage}</p>
            <button className="modal-button" onClick={closeConfirmation}>
              Close
            </button>
          </div>
        </div>
      )}
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
                Learn all about our furry canine friends. Discover various dog
                breeds, their characteristics, and interesting facts.
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
                Dive into the world of cats! Explore different cat breeds, their
                behaviors, and fascinating trivia about our feline companions.
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
          <br></br>
          <button onClick={handleSort} className="sort-button">
            Sort {sortOrder === "asc" ? "A-Z" : "Z-A"}
          </button>
        </div>
        <div className="container mx-auto mt-8">
          <div className="news-container">
            {displayedNews.map((article, index) => (
              <div className="news-card" key={index}>
                <a href={article.url} className="news-link">
                  <h3 className="news-title">{article.title}</h3>
                </a>
                <img
                  src={article.urlToImage}
                  alt="News"
                  className="news-image"
                />
                <p className="news-description">{article.description}</p>
                <button
                  onClick={() => handleFavorite(article, userEmail)}
                  className={`favorite-button ${
                    article.favorite ? "favorite-red" : ""
                  }`}
                >
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
