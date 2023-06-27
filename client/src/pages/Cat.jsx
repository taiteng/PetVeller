import Header from '../components/Header';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import { Col, Container, Row, Spinner } from "react-bootstrap";
import CatCard from '../components/CatCard';

function Cat() {
  const maximumCatsPerPage = 20;
  const APIURL = 'https://api.thecatapi.com/v1/';
  const APIKey = 'live_4fvlmhHlhugFEhoygx7MssvoLDt3xmRUtTElLjS14d8RB2y1UzUQ2PLTmhrUTnSP';

  const query = `${APIURL}breeds?&limit=${maximumCatsPerPage}`;

  const [cats, setCats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestCats = async () => {
    const urlHeaders = {
      "Content-Type": "application/json",
      "x-api-key": APIKey,
    };

    try {
      setIsLoading(true);

      const apiResponse = await fetch(query, { urlHeaders });
      const result = await apiResponse.json();

      // Logging for debugging
      console.log("Cats result", result);

      setCats(result);
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
    <Header/>
    <Container>
      <Row xs={1} md={4} className="justify-content-center g-4">
        {isLoading ? (
          <Spinner animation="grow" />
        ) : cats ? (
          <>
            {Object.values(cats).map((cat) => (
              <Col key={cat.id} className="p-2">
                <CatCard catCards={cat} />
              </Col>
            ))}
          </>
        ) : (
          <h3 className="text-center text-danger fw-bold">
            Impossible to retrieve cats
          </h3>
        )}
      </Row>
    </Container>
    <Footer/>
    </div>
    </>
  )
}

export default Cat
