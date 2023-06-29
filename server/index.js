const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');
const userModel = require('./models/users')
const catModel = require('./models/cat')
const newsModel = require('./models/news')
const catFactsModel = require('./models/catfact')

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

app.post('/getCatFav', (req, res) => {
  const { userEmail } = req.body;
  catModel.find({ userEmail: userEmail })
  .then(cat => {
      if(cat){
          res.json(cat);
      }
      else{
          res.json('Cat Not Found')
      }
  })
})

app.post('/dltCatFav', (req, res) => {
  const { userEmail, catName } = req.body;
  catModel.find({ userEmail: userEmail })
  .then(cat => {
      if(cat){
          if (cat.name === catName) {
            // 
            res.json(cat)
          } else {

          }
      }
      else{
          res.json('Cat Not Found')
      }
  })
})

app.post('/isCatFav', (req, res) => {
  const { userEmail, name } = req.body;
  catModel.find({ userEmail: userEmail })
  .then(cat => {
      if(cat){
          if (cat.name === name) {
              res.json('Cat Exists')
          } else {
              res.json('Cat Not Found')
          }
      }
      else{
          res.json('User Not Found')
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
  
    newsModel.findOne({ userEmail: userEmail, title: article.title })
      .then(favorite => {
        if (favorite) {
          // Article already in favorites for the user, remove it
          newsModel.deleteOne({ userEmail: userEmail, title: article.title })
            .then(() => {
              res.json('Removed from favorites');
            })
            .catch(error => {
              console.log('Error removing favorite:', error);
              res.status(500).json('Server error');
            });
        } else {
          // Article not in favorites for the user, add it
          const newFavorite = new newsModel({
            userEmail: userEmail,
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

app.post('/saveCatFactsToDatabase', (req, res) => {
    const { facts } = req.body;
  
    const savePromises = facts.map((fact) => {
      return catFactsModel.findOne({ fact })
        .then((catFact) => {
          if (catFact) {
            return Promise.resolve('Fact Exists');
          } else {
            const newCatFact = new catFactsModel({ fact });
            return newCatFact.save().then(() => 'Saved Fact');
          }
        })
        .catch((error) => {
          console.log('Error saving cat fact:', error);
          return Promise.resolve('Error saving fact');
        });
    });
  
    Promise.all(savePromises)
      .then((results) => {
        res.json(results);
      })
      .catch((error) => {
        console.log('Error saving cat facts:', error);
        res.status(500).json('Server error');
      });
});

app.get('/catFacts', (req, res) => {
  catFactsModel.find()
    .then(catFacts => {
      res.json(catFacts);
    })
    .catch(error => {
      console.log('Error retrieving cat facts:', error);
      res.status(500).json('Server error');
    });
});
  
app.delete('/deleteCatFacts', (req, res) => {
  const { id } = req.params;
  
  catFactsModel.deleteOne({ _id: id })
    .then(() => {
      res.json('Fact deleted');
    })
    .catch(error => {
      console.log('Error deleting cat fact:', error);
      res.status(500).json('Server error');
    });
});
  
app.listen(3001, () => {
    console.log('Server is running')
})