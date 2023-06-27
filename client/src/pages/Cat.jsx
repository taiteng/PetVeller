import Header from '../components/Header';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import { Col, Container, Row, Spinner } from "react-bootstrap";
import CatCard from '../components/CatCard';
import BackToTop from '../components/BackToTop';

function Cat() {
  const maximumCatsPerPage = 20;
  const APIURL = 'https://api.thecatapi.com/v1/';
  const APIKey = 'live_4fvlmhHlhugFEhoygx7MssvoLDt3xmRUtTElLjS14d8RB2y1UzUQ2PLTmhrUTnSP';

  const query = `${APIURL}breeds`;
  const query2 = `${APIURL}breeds?&limit=${maximumCatsPerPage}`;

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

  const requestCats = async () => {
    const urlHeaders = {
      "Content-Type": "application/json",
      "x-api-key": APIKey,
    };

    try {
      setIsLoading(true);

      const apiResponse = await fetch(query, { urlHeaders });
      const result = await apiResponse.json();

      // Filter out null data from the response
      const filteredResult = result.filter((cat) => cat !== null );

      // Logging for debugging
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
        `}
      </style>
      <Header/>
      <BackToTop />
      <div className='container mx-auto mt-5 mb-5'>
        <div className="welcome-container">
          <h1 className="welcome-heading">Cat Breeds</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search Cat Name"
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
          ): (
            <p>No cats found.</p>
          )}
        </Row>
      </Container>
      <Footer/>
    </div>
    </>
  )
}

export default Cat;