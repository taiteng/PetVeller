import { useEffect, useState } from 'react';
import { Card, ListGroup } from "react-bootstrap";
import axios from 'axios';

const AdminCatCard = ({ adminCatCards }) => {

    useEffect(() => {
        fetchCatImg();
    }, []);

    const [catImg, setCatImg] = useState('');
    const catImgID = adminCatCards?.reference_image_id;

    const fetchCatImg = async () => {
        try {
          const response = await fetch(`https://api.thecatapi.com/v1/images/${catImgID}`);
          const data = await response.json();
          setCatImg(data.url);
        } catch (error) {
          console.log('Error fetching cat image:', error);
        }
    };

    const imgURL = catImg;
    const imgWidth = adminCatCards?.width;
    const imgHeight = adminCatCards?.height;
    const imgReferenceID = adminCatCards?.reference_image_id;
    const name = adminCatCards?.name;
    const description = adminCatCards?.description;
    const lifeSpan = adminCatCards?.life_span;
    const origin = adminCatCards?.origin;
    const temperament = adminCatCards?.temperament;
    const wikipediaURL = adminCatCards?.wikipedia_url;

    const handleAddToDatabase = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/addCatDetail', { imgURL, imgWidth, imgHeight, imgReferenceID, name, description, lifeSpan, origin, temperament, wikipediaURL })
        .then((result) => {
          console.log(result);
          if(result.data === 'Cat Exists'){
            res.json('Existed')
          }
          else{
            res.json('Saved')
          }
        })
        .catch((err) => console.log(err));
    }

    return (
        <Card style={{ height: '650px', width: '100%', overflow: 'auto' }}>
          <Card.Body>
            <Card.Title>{adminCatCards?.name}</Card.Title>
            <p>{adminCatCards?.description}</p>

            <br></br>
            <Card.Header>Information</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                Life Span: {adminCatCards?.life_span}
              </ListGroup.Item>
    
              <ListGroup.Item>
                Origin: {adminCatCards?.origin}
              </ListGroup.Item>
    
              <ListGroup.Item>
                Temperament: {adminCatCards?.temperament}
              </ListGroup.Item>
            </ListGroup>

            <Card.Img
                src={catImg}
                alt={`Cat photo, breed ${adminCatCards?.name}`}
                width={adminCatCards?.width}
                height={200}
                className="rounded"
            />

            <p className="text-center mt-2">
                <a
                className="text-muted"
                href={`${adminCatCards?.wikipedia_url}`}
                >
                Wikipedia
                </a>
            </p>
          </Card.Body>
          <Card.Footer>
            <div className='flex justify-between'>
                <form onSubmit={handleAddToDatabase}>
                    <button type="submit" className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add</button>
                </form>
            </div>
          </Card.Footer>
        </Card>
    );
};

export default AdminCatCard;