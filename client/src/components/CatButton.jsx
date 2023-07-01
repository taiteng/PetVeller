import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';

const CatButton = ({ userEmail, catName, handleAddToDatabase }) => {

    const [isCatFav, setIsCatFav] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchIsCatFavourited();
    }, []);

    const fetchIsCatFavourited = async () => {
        if (userEmail) {
            setIsLoading(true);
        
            try {
                const result = await new Promise((resolve, reject) => {
                    axios
                      .post('http://localhost:3001/isCatFav', {
                        userEmail,
                        catName,
                      })
                      .then(resolve)
                      .catch(reject);
                  });
              if (result.data === 'Cat Exists') {
                setIsCatFav(true);
              } else {
                setIsCatFav(false);
              }
            } catch (err) {
              console.log(err);
            } finally {
              setIsLoading(false);
            }
        }
    };

  return (
    <form onSubmit={handleAddToDatabase}>
        {(!userEmail || isLoading) ? (
            <Button disabled size="small">
            Loading...
            </Button>
        ) : isCatFav ? (
            <Button disabled size="small">
            Added to Favourite
            </Button>
        ) : (
            <Button type="submit" size="small">
            Add to Favourite
            </Button>
        )}
    </form>
  )
}

export default CatButton
