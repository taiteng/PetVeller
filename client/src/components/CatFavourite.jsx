import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const FavCatCard = ({ favCatCards, requestFavourites, requestCats }) => {

    const catName = favCatCards.name;

    const handleDeleteFromDatabase = (e) => {
        e.preventDefault();

        const decodedToken = jwtDecode(sessionStorage.getItem('token'));
        const { user } = decodedToken;
        let userEmail = '';
        let userName = '';

        if(user){
            userEmail = user.email;
            userName = user.name;
        }

        if(userEmail){
            axios.post('http://localhost:3001/dltCatFav', { userEmail, catName })
            .then(async (result) => {
                console.log(result);
                let message = `${userName} (${userEmail}) deleted ${catName} from Cat Favourites.`;
                const response = await axios.post('http://localhost:3001/save-log', { logContent: message });
                console.log('Log message saved to the database:', response.data);
                requestFavourites();
                requestCats();
            })
            .catch((err) => console.log(err));
        }
        else{
            console.log('User not logged in.')
        }
    }

    return (
        <Card sx={{ maxWidth: 350, height: '100%', display: "flex", flexDirection: "column", }} 
    style={{ background: 'linear-gradient(to bottom right, #FBE8E8, #FCC2C2)', borderRadius: 25 }}>
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