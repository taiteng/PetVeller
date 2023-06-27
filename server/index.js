const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');
const userModel = require('./models/users')
const catModel = require('./models/cat')
const newsModel = require('./models/news')

const app = express()
app.use(express.json())
app.use(cors())

const db = 'mongodb+srv://Whitesugar:1zNhtYOKTXYMTVS7@clusterdemo.qjs12rn.mongodb.net/PetVeller';

mongoose.connect(db).then(() => {
    console.log('Connected to database');
}).catch((e) => {
    console.log(e);
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    userModel.findOne({ email: email })
    .then(user => {
        if(user){
            if(user.password === password){
                res.json(user);
            }
            else{
                res.json('The Password Is Incorrect')
            }
        }
        else{
            res.json('User Not Found')
        }
    })
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    userModel.findOne({ email: email })
    .then(user => {
        if(user){
            res.json('User Exists')
        }
        else{
            const newUser = new userModel({ name, email, password });
            const saveUser = newUser.save();
            res.json(saveUser);
        }
    })
})

app.post('/addCatToFav', (req, res) => {
    const { userEmail, imgURL, imgWidth, imgHeight, imgReferenceID, name, description, lifeSpan, origin, temperament, wikipediaURL } = req.body;
    catModel.findOne({ name: name })
    .then(cat => {
        if(cat){
            if(cat.userEmail === userEmail){
                res.json('Cat Exists');
            }
            else{
                newCat = new catModel({
                    userEmail: userEmail,
                    imgURL: imgURL,
                    imgWidth: imgWidth,
                    imgHeight: imgHeight,
                    imgReferenceID: imgReferenceID,
                    name: name,
                    description: description,
                    lifeSpan: lifeSpan,
                    origin: origin,
                    temperament: temperament,
                    wikipediaURL: wikipediaURL,
                });
            
                newCat.save().then(success => {
                    console.log('Success' + success);
                    res.json('Saved Cat');
                }).catch(error => {
                    console.log('Error' + error);
                });
            }
        }
        else{
            newCat = new catModel({
                userEmail: userEmail,
                imgURL: imgURL,
                imgWidth: imgWidth,
                imgHeight: imgHeight,
                imgReferenceID: imgReferenceID,
                name: name,
                description: description,
                lifeSpan: lifeSpan,
                origin: origin,
                temperament: temperament,
                wikipediaURL: wikipediaURL,
            });
        
            newCat.save().then(success => {
                console.log('Success' + success);
                res.json('Saved Cat');
            }).catch(error => {
                console.log('Error' + error);
            });
        }
    })
})



app.post('/toggleFavorite', (req, res) => {
    const { article, userEmail } = req.body;
  
    newsModel.findOne({ articleId: article.id, userEmail: userEmail })
      .then(favorite => {
        if (favorite) {
          // Article already in favorites, remove it
          newsModel.deleteOne({ articleId: article.id, userEmail: userEmail })
            .then(() => {
              res.json('Removed from favorites');
            })
            .catch(error => {
              console.log('Error removing favorite:', error);
              res.status(500).json('Server error');
            });
        } else {
          // Article not in favorites, add it
          const newFavorite = new newsModel({
            userEmail: userEmail,
            articleId: article.id,
            title: article.title,
            description: article.description,
            url: article.url
          });
  
          newFavorite.save()
            .then(savedFavorite => {
              res.json('Added to favorites');
            })
            .catch(error => {
              console.log('Error saving favorite:', error);
              res.status(500).json('Server error');
            });
        }
      })
      .catch(error => {
        console.log('Error checking favorite:', error);
        res.status(500).json('Server error');
      });
  });
  
  

app.listen(3001, () => {
    console.log('Server is running')
})