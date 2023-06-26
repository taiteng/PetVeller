import { useEffect, useState } from 'react';
import { Card, ListGroup } from "react-bootstrap";
import axios from 'axios';
import { IoHeartOutline } from 'react-icons/io5';
import { IoHeart } from 'react-icons/io5';

const CatCard = ({ catCards }) => {
    useEffect(() => {
        fetchCatImg();
        setUserEmail(sessionStorage.uEmail);
    }, []);

    const [catImgURL, setCatImgURL] = useState('');
    const [catImgWidth, setCatImgWidth] = useState('');
    const [catImgHeight, setCatImgHeight] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const catImgID = catCards?.reference_image_id;

    const fetchCatImg = async () => {
        try {
          const response = await fetch(`https://api.thecatapi.com/v1/images/${catImgID}`);
          const data = await response.json();
          setCatImgURL(data.url);
          setCatImgWidth(data.width);
          setCatImgHeight(data.height);

          if(sessionStorage.uEmail === ''){

          }
          else{
            
          }

        } catch (error) {
          console.log('Error fetching cat image:', error);
        }
    };

    const imgURL = catImgURL;
    const imgWidth = catImgWidth;
    const imgHeight = catImgHeight;
    const imgReferenceID = catCards?.reference_image_id;
    const name = catCards?.name;
    const description = catCards?.description;
    const lifeSpan = catCards?.life_span;
    const origin = catCards?.origin;
    const temperament = catCards?.temperament;
    const wikipediaURL = catCards?.wikipedia_url;

    const handleAddToDatabase = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/addCatToFav', { userEmail, imgURL, imgWidth, imgHeight, imgReferenceID, name, description, lifeSpan, origin, temperament, wikipediaURL })
        .then((result) => {
          console.log(result);
          if(result.data === 'Cat Exists'){
            console.log('Existed')
          }
          else{
            console.log('Saved')
          }
        })
        .catch((err) => console.log(err));
    }

    return (
        <Card style={{ height: '650px', width: '100%', overflow: 'auto' }}>
            <Card.Body>
                <Card.Title>{catCards?.name}</Card.Title>
                <p>{catCards?.description}</p>

                <br></br>
                <Card.Header>Information</Card.Header>
                <ListGroup variant="flush">
                <ListGroup.Item>
                    Life Span: {catCards?.life_span}
                </ListGroup.Item>
        
                <ListGroup.Item>
                    Origin: {catCards?.origin}
                </ListGroup.Item>
        
                <ListGroup.Item>
                    Temperament: {catCards?.temperament}
                </ListGroup.Item>
                </ListGroup>

                <Card.Img
                    src={catImgURL}
                    alt={`Cat photo, breed ${catCards?.name}`}
                    width={catCards?.width}
                    height={200}
                    className="rounded"
                />

                <p className="text-center mt-2">
                    <a
                    className="text-muted"
                    href={`${catCards?.wikipedia_url}`}
                    >
                    Wikipedia
                    </a>
                </p>
            </Card.Body>
            <Card.Footer>
                <div className='flex justify-between'>
                    <form onSubmit={handleAddToDatabase}>
                        <button type="submit" className="btn bg-red-100 hover:bg-red-300 text-red rounded">
                            <IoHeartOutline className='text-[23px]' />
                        </button>
                    </form>
                </div>
            </Card.Footer>
        </Card>
    );
};

export default CatCard;