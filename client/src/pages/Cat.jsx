import Header from '../components/Header';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import { Col, Container, Row, Spinner } from "react-bootstrap";
import CatCard from '../components/CatCard';
import FavCatCard from '../components/CatFavourite';
import BackToTop from '../components/BackToTop';
import axios from 'axios'

function Cat() {
  const userEmail = sessionStorage.uEmail;
  const maximumCatsPerPage = 20;
  const catPage = 0;
  const APIURL = 'https://api.thecatapi.com/v1/';
  const APIKey = 'live_4fvlmhHlhugFEhoygx7MssvoLDt3xmRUtTElLjS14d8RB2y1UzUQ2PLTmhrUTnSP';

  const query1 = `${APIURL}breeds`;
  const query2 = `${APIURL}breeds?&limit=${maximumCatsPerPage}&page=${catPage}`;

  const [favCats, setFavCats] = useState(null);
  const [cats, setCats] = useState(null);
  const [allCats, setAllCats] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [filteredCats, setFilteredCats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchName(searchValue);

    if (searchValue.trim() !== '') {
      const filteredCats = cats.filter((cat) =>
        cat.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredCats(filteredCats);
    } else {
      setFilteredCats(null);
    }
  };

  const requestFavourites = async () => {
    try {
      setIsLoading(true);

      axios.post('http://localhost:3001/getCatFav', { userEmail })
      .then(result => {
          console.log(result.data);

          setFavCats(result.data);
          console.log(favCats);
      })
      .catch(err => console.log(err))
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const requestCats = async () => {
    const urlHeaders = {
      "Content-Type": "application/json",
      "x-api-key": APIKey,
    };

    try {
      setIsLoading(true);

      const apiResponse = await fetch(query1, { urlHeaders });
      const catResult = await apiResponse.json();

      // Filter out null data from the response
      const filteredResult = catResult.filter((cat) => cat !== null );

      console.log("Cats result", filteredResult);

      setCats(filteredResult);
      setAllCats(filteredResult);
      setFilteredCats(filteredResult);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    requestCats();
    requestFavourites();
  }, []);

  return (
    <>
    <div style={{ background: 'linear-gradient(to bottom right, #A6BCE8, #FFC0C0)' }}>
      <style>
        {`
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
        .cat-card {
          background: linear-gradient(to bottom right, #FBE8E8, #FCC2C2);
          border-radius: 20px;
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
        `}
      </style>
      <Header/>
      <BackToTop/>
      <div className='container mx-auto mt-5 mb-5'>
        <div className="welcome-container">
          <h1 className="welcome-heading">Favourite Cats</h1>
        </div>
      </div>
      <Container>
        <Row className="justify-content-center g-4">
          {isLoading ? (
            <Spinner animation="grow" />
          ) : userEmail === '' || userEmail === null ? (
            <p>User Not Found.</p>
          ) : favCats !== null ? (
            <>
              {favCats.map((fcat) => (
                <Col key={fcat._id} className="p-2">
                  <FavCatCard favCatCards={fcat} />
                </Col>
              ))}
            </>
          ) : (
            <p>No Cats Found.</p>
          )}
        </Row>
      </Container>
      <div className='container mx-auto mt-5 mb-5'>
        <div className="welcome-container">
          <h1 className="welcome-heading">Cat Breeds</h1>
          <div className="search-container">
            <input
              className="search-input"
              type="text"
              placeholder="&#128269; Search Cat Name"
              value={searchName}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>
      <Container>
        <Row md={4} className="justify-content-center g-4">
          {isLoading ? (
            <Spinner animation="grow" />
          ) : filteredCats !== null ? (
            <>
              {filteredCats.map((cat) => (
                <Col key={cat.id} className="p-2">
                  <CatCard catCards={cat} />
                </Col>
              ))}
            </>
          ) : allCats !== null ? (
            <>
              {allCats.map((cat) => (
                <Col key={cat.id} className="p-2">
                  <CatCard catCards={cat} />
                </Col>
              ))}
            </>
          ) : (
            <p>No Cats Found.</p>
          )}
        </Row>
      </Container>
      <Footer/>
    </div>
    </>
  )
}

export default Cat;