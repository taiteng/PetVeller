import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import axios from 'axios';
import { Spinner } from "react-bootstrap";

const CatCard = ({ catCards }) => {
    if ((catCards?.wikipedia_url === null) || (catCards?.reference_image_id === null)) {
        return null;
    }
    const {
        reference_image_id,
        name,
        description,
        life_span,
        origin,
        temperament,
        wikipedia_url
    } = catCards;
    
    if (
        !reference_image_id ||
        !name ||
        !description ||
        !life_span ||
        !origin ||
        !temperament ||
        !wikipedia_url
    ) {
        return null;
    }
    else{
        const [catName, setCatName] = useState('');
        const [userEmail, setUserEmail] = useState('');
        const [isCatFav, setIsCatFav] = useState(false);
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            const fetchIsCatFavourited = async () => {
                try {
                    const result = await axios.post('http://localhost:3001/isCatFav', { userEmail, catName });
                    if (result.data === 'Cat Exists') {
                        console.log('Existed');
                        setIsCatFav('true');
                    } else {
                        console.log('No Fav');
                    }
                  } catch (error) {
                    console.error(error.message);
                  }

                  setIsLoading(false);
            };

            fetchIsCatFavourited();
            fetchCatImg();
            setUserEmail(sessionStorage.uEmail);
            setCatName(catCards?.name);
        }, []);
    
        const [catImgURL, setCatImgURL] = useState('');
        const [catImgWidth, setCatImgWidth] = useState('');
        const [catImgHeight, setCatImgHeight] = useState('');

        const catImgID = catCards?.reference_image_id;
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
    
        const fetchCatImg = async () => {
            try {
              const response = await fetch(`https://api.thecatapi.com/v1/images/${catImgID}`);
              const data = await response.json();
              setCatImgURL(data.url);
              setCatImgWidth(data.width);
              setCatImgHeight(data.height);
            } catch (error) {
              console.log('Error fetching cat image:', error);
            }
        };
    
        const handleAddToDatabase = (e) => {
            e.preventDefault();
            if(userEmail){
                axios.post('http://localhost:3001/addCatToFav', { userEmail, imgURL, imgWidth, imgHeight, imgReferenceID, name, description, lifeSpan, origin, temperament, wikipediaURL })
                .then((result) => {
                    console.log(result);
                    if(result.data === 'Cat Exists'){
                        console.log('Existed');
                        setIsCatFav('true');
                    }
                    else{
                        console.log('Saved')
                        setIsCatFav('true');
                    }
                })
                .catch((err) => console.log(err));
            }
            else{
                console.log('User not logged in.')
            }
        }
    
        return (
            <>
            {isLoading ? 
            (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
            <Card sx={{ maxWidth: 350, height: '100%', display: "flex", flexDirection: "column", }} style={{ background: 'linear-gradient(to bottom right, #FBE8E8, #FCC2C2)', borderRadius: 25 }}>
                <CardActionArea>
                    <CardMedia
                        sx={{ height: 200 }}
                        image={catImgURL}
                        title={`Cat photo, breed ${catCards?.name}`}
                        component='div'
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {catCards?.name}
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                            {catCards?.description}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Life Span: {catCards?.life_span} <br/>
                            Origin: {catCards?.origin} <br/>
                            Temperament: {catCards?.temperament}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions disableSpacing sx={{ mt: "auto" }} className='flex justify-between'>
                    <form onSubmit={handleAddToDatabase}>
                        {!userEmail || !isCatFav && <Button type='submit' size="small">Add to Favourite</Button>}
                    </form>
                    <a href={`${catCards?.wikipedia_url}`}>
                        <Button size="small">Learn More</Button>
                    </a>
                </CardActions>
            </Card>
            )}
            </>
        );
    }
};

export default CatCard;