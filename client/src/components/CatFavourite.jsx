import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import axios from 'axios';

const FavCatCard = ({ favCatCards, requestFavourites }) => {

    const userEmail = sessionStorage.uEmail;
    const catName = favCatCards.name;

    const handleDeleteFromDatabase = (e) => {
        e.preventDefault();
        if(userEmail){
            axios.post('http://localhost:3001/dltCatFav', { userEmail, catName })
            .then((result) => {
                console.log(result);
                requestFavourites();
            })
            .catch((err) => console.log(err));
        }
        else{
            console.log('User not logged in.')
        }
    }

    return (
        <Card sx={{ maxWidth: 350, height: '100%', display: "flex", flexDirection: "column", }} style={{ background: 'linear-gradient(to bottom right, #FBE8E8, #FCC2C2)', borderRadius: 25 }}>
            <CardActionArea>
                <CardMedia
                    sx={{ height: 200 }}
                    image={favCatCards.imgURL}
                    title={`Cat photo, breed ${favCatCards.name}`}
                    component='div'
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {favCatCards.name}
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                        {favCatCards.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Life Span: {favCatCards.life_span} <br/>
                        Origin: {favCatCards.origin} <br/>
                        Temperament: {favCatCards.temperament}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions disableSpacing sx={{ mt: "auto" }} className='flex justify-between'>
                <form onSubmit={handleDeleteFromDatabase}>
                    <Button type='submit' size="small">Delete</Button>
                </form>
                <a href={`${favCatCards.wikipediaURL}`}>
                    <Button size="small">Learn More</Button>
                </a>
            </CardActions>
        </Card>
    );
};

export default FavCatCard;