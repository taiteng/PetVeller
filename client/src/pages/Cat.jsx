import Header from '../components/Header';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import { Col, Container, Row, Spinner } from "react-bootstrap";
import CatCard from '../components/CatCard';
import FavCatCard from '../components/CatFavourite';
import BackToTop from '../components/BackToTop';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import SecurityBanner from '../components/SecurityBanner';

function Cat() {
  const maximumCatsPerPage = 20;
  const catPage = 0;
  const APIURL = 'https://api.thecatapi.com/v1/';
  const APIKey = 'live_4fvlmhHlhugFEhoygx7MssvoLDt3xmRUtTElLjS14d8RB2y1UzUQ2PLTmhrUTnSP';

  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userPassword, setPassword] = useState(null);
  const [userEmail, setEmail] = useState(null);
  const [token, setToken] = useState(null);
  const [favCats, setFavCats] = useState(null);
  const [cats, setCats] = useState(null);
  const [allCats, setAllCats] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [filteredCats, setFilteredCats] = useState(null);
  const [isCatLoading, setIsCatLoading] = useState(false);
  const [isFavLoading, setIsFavLoading] = useState(true);

  const urlHeaders = {
    "Content-Type": "application/json",
    "x-api-key": APIKey,
  };

  const query1 = `${APIURL}breeds`;
  const query2 = `${APIURL}breeds?&limit=${maximumCatsPerPage}&page=${catPage}`;

  const handleSearch = async (event) => {
    event.preventDefault();
    const searchValue = event.target.value;
    const query3 = `${APIURL}breeds/search?q=${searchValue}`;

    if (searchValue.trim() !== '' || searchValue !== '') {
      setSearchName(searchValue);
      
      try {
        setIsCatLoading(true);
  
        const apiRes = await fetch(query3, { urlHeaders });
        const searchCatResult = await apiRes.json();
  
        const filteredSearchResult = searchCatResult.filter((cat) => cat !== null );
        const filteredCats = filteredSearchResult.filter((cat) =>
          cat.name.toLowerCase().includes(searchName.toLowerCase())
        );

        console.log("Searched Cats result", filteredCats);

        setFilteredCats(filteredCats);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsCatLoading(false);
      }
    } else {
      setFilteredCats(null);
      setSearchName('');
    }
  };

  const requestFavourites = async () => {
    try {
      setIsFavLoading(true);

      axios.post('http://localhost:3001/getCatFav', { userEmail })
      .then(result => {
          console.log(result.data);
          setFavCats(result.data);
      })
      .catch(err => console.log(err))
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsFavLoading(false);
    }
  }

  const requestCats = async () => {
    try {
      setIsCatLoading(true);

      const apiResponse = await fetch(query1, { urlHeaders });
      const catResult = await apiResponse.json();

      const filteredResult = catResult.filter((cat) => cat !== null );
      console.log("Cats result", filteredResult);

      setCats(filteredResult);
      setAllCats(filteredResult);
      // setFilteredCats(filteredResult);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsCatLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');

    if(storedToken){
      const decodedToken = jwtDecode(storedToken);
      const { user } = decodedToken;

      if (user) {
        setUserRole(user.role);
        setUserName(user.name);
        setEmail(user.email);
        setPassword(user.password);
      }
      else{
        console.log('An error occurred')
      }
    }

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
      <SecurityBanner/>
      <BackToTop/>
      <div className='container mx-auto mt-5 mb-5'>
        <div className="welcome-container">
          <h1 className="welcome-heading">Favourite Cats</h1>
          <div>
          <button type="button" onClick={requestFavourites}>
            Refresh
          </button>
          </div>
        </div>
      </div>
      <Container>
        <Row className="justify-content-center g-4">
          {isFavLoading ? (
            <Spinner animation="grow" />
          ) : userEmail === '' || userEmail === null || userEmail === undefined ? (
            <p>User Not Found.</p>
          ) : userRole != 'premiumUser' ? (
            <p>User Is Not Premium.</p>
          ) : favCats !== null ? (
            <>
              {favCats.map((fcat) => (
                <Col key={fcat._id} sm={6} md={4} lg={3} className="p-2">
                  <FavCatCard favCatCards={fcat} requestFavourites={requestFavourites} requestCats={requestCats} />
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
        <Row className="justify-content-center g-4">
          {isCatLoading ? (
            <Spinner animation="grow" />
          ) : filteredCats !== null ? (
            <>
              {filteredCats.map((cat) => (
                <Col key={cat.id} sm={6} md={4} lg={3} className="p-2">
                  <CatCard catCards={cat} requestFavourites={requestFavourites}  requestCats={requestCats} />
                </Col>
              ))}
            </>
          ) : allCats !== null ? (
            <>
              {allCats.map((cat) => (
                <Col key={cat.id} sm={6} md={4} lg={3} className="p-2">
                  <CatCard catCards={cat} requestFavourites={requestFavourites}  requestCats={requestCats} />
                </Col>
              ))}
            </>
          ) : noResultsFound ? (
            <p>No Results Found.</p>
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