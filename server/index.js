const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');
const userModel = require('./models/users')
const catModel = require('./models/cat')
const newsModel = require('./models/news')
const catFactsModel = require('./models/catfact')
const contactModel = require('./models/contact')
const dogModel = require('./models/dog')
const logModel = require('./models/logging')

const app = express()
app.use(express.json())
app.use(cors())

const db = 'mongodb+srv://Whitesugar:1zNhtYOKTXYMTVS7@clusterdemo.qjs12rn.mongodb.net/PetVeller';

mongoose.connect(db).then(() => {
    console.log('Connected to database');
}).catch((e) => {
    console.log(e);
});

app.post('/log', (req, res) => {
    const { logContent } = req.body;

    const newLog = new logModel({ logContent });

    newLog.save().then((savedLog) => {
      console.log('Log Saved:', savedLog.logContent);
      console.log("Created At:", savedLog.createdAt);
      console.log("Updated At:", savedLog.updatedAt);
      res.status(200).json(savedLog);
    }).catch((error) => {
      console.log('Error saving log:', error);
      res.status(500).json({ error: 'Failed to save log' });
    });
})

app.get('/contact', async (req, res) => {
  try {
    const logs = await logModel.find();
    res.json(logs);
  } catch (error) {
    console.log('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
})

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
    const { name, email, password, role } = req.body;
    userModel.findOne({ email: email })
    .then(user => {
        if(user){
            res.json('User Exists')
        }
        else{
            const newUser = new userModel({ name, email, password, role });
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
  catModel.findOne({ userEmail: userEmail, name: catName })
  .then(cat => {
      if(cat){
        catModel.deleteOne({ _id: cat._id })
        .then(() => {
          res.json('Deleted Successfully');
        })
        .catch(error => {
          res.json('Error occurred while deleting');
        });
      }
      else{
          res.json('Cat Not Found')
      }
  })
})

app.post('/isCatFav', (req, res) => {
  const { userEmail, catName } = req.body;
  catModel.findOne({ userEmail: userEmail, name: catName })
  .then(cat => {
      if(cat){
        res.json('Cat Exists');
      }
      else{
          res.json('User Not Found')
      }
  })
})

app.post('/addCatToFav', (req, res) => {
    const { userEmail, imgURL, imgWidth, imgHeight, imgReferenceID, name, description, lifeSpan, origin, temperament, wikipediaURL } = req.body;
    catModel.findOne({ userEmail: userEmail, name: name })
    .then(cat => {
        if(cat){
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

app.post('/deleteCatFacts/:id', (req, res) => {
    const { id } = req.params;
  
    catFactsModel
      .deleteOne({ _id: id })
      .then(() => {
        res.json('Fact deleted');
      })
      .catch((error) => {
        console.log('Error deleting cat fact:', error);
        res.status(500).json('Server error');
      });
});

app.post('/contact', (req, res) => {
  const { firstName, surname, email, phone, message } = req.body;

  const contactData = {
    firstName,
    surname,
    email,
    phone,
    message,
  };

  const contact = new contactModel(contactData);

  contact.save()
    .then((savedContact) => {
      console.log('Contact form data saved:', savedContact);
      res.status(200).json(savedContact);
    })
    .catch((error) => {
      console.log('Error saving contact form data:', error);
      res.status(500).json({ error: 'Failed to save contact form data' });
    });
});

app.get('/contact',async (req, res) => {
  try {
    const contacts = await contactModel.find();
    res.json(contacts);
  } catch (error) {
    console.log('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

app.post('/addFavouriteDog', (req, res) => {
  const { userEmail, id, name, bred_for, life_span, temperament, origin, imageURL } = req.body.dogData;
  dogModel.findOne({ name: name })
  .then(dog => {
      if(dog){
        console.log("user email" + userEmail)
        dogModel.deleteOne({ id: id, userEmail: userEmail })
        .then(() => {
          console.log('Dog unfavorited');
          res.json('Dog Unfavourited')
        })
        .catch(err => {
          console.error(err);
        });
      }
      else{
        console.log("user email" + userEmail)
        newDog = new dogModel({
          userEmail: userEmail,
          id: id,
          name: name,
          bred_for: bred_for,
          life_span: life_span,
          temperament: temperament,
          origin: origin,
          imageURL: imageURL,
      });

      newDog.save().then(success => {
        console.log("user email" + userEmail)
          console.log('Success' + success);
          res.json('Dog Favourited');
      }).catch(error => {
          console.log('Error' + error);
      });
    }
  })
})

app.post('/favouriteDogs', (req, res) => {
  const { userEmail } = req.body;
  dogModel.find({ userEmail: userEmail })
  .then(dog => {
      if(dog){
          res.json(dog);
      }
      else{
          res.json('Dog Not Found')
      }
  })
})

app.post('/deleteFavouriteDogs', (req, res) => {
  const { id } = req.body.dogData;
  dogModel.deleteOne({ id: id })
  .then(dog => {
      if(dog){
          res.json("Dog Unfavourited")
      }
      else{
          res.json('Dog Not Found')
      }
  })
})

app.post('/favouriteNews', async (req, res) => {
  try {
    const { userEmail } = req.body;
    const favouriteData = await newsModel.find({ userEmail });
    res.json(favouriteData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/updateUsername', async (req, res) => {
  const { email, newName, name } = req.body.userDetail;
  userModel.findOne({ email: email, name: name })
    .then(user => {
      if (!user) {
        res.status(409).json('Username already exists');
      } else {
        userModel.findOneAndUpdate({ email: email, name: name }, { name: newName }, { new: true })
          .then(updatedUser => {
            if (updatedUser) {
              res.status(200).json("User Name Updated");
            } else {
              res.status(404).json('User Not Found');
            }
          })
          .catch(error => {
            console.log('Error updating username:', error);
            res.status(500).json('Internal Server Error');
          });
      }
    })
    .catch(error => {
      console.log('Error finding user:', error);
      res.status(500).json('Internal Server Error');
    });
});

app.post('/updatePassword', async (req, res) => {
  const { email, pass, name } = req.body.userDetail;
  userModel.findOne({ email: email, name: name })
    .then(user => {
      if (!user) {
        res.status(409).json('User Not Found');
      } else {
        userModel.findOneAndUpdate({ email: email, name: name }, { password: pass }, { new: true })
          .then(updatedUser => {
            if (updatedUser) {
              res.status(200).json("User Passowrd Updated");
            } else {
              res.status(404).json('User Not Found');
            }
          })
          .catch(error => {
            console.log('Error updating password:', error);
            res.status(500).json('Internal Server Error');
          });
      }
    })
    .catch(error => {
      console.log('Error finding user:', error);
      res.status(500).json('Internal Server Error');
    });
});

app.post('/updateEmail', async (req, res) => {
  const { email, newEmail, name } = req.body.userDetail;
  userModel.findOne({ email: email, name: name })
    .then(user => {
      if (!user) {
        res.status(409).json('User Not Found');
      }else {
        userModel.findOne({ email: newEmail })
          .then(existingUser => {
            if (existingUser) {
              if(email == newEmail){
                res.json('Email is the same with your old email');
              }else{
                res.json('Email has been taken');
              }
              
            } else {
              userModel.findOneAndUpdate({ email: email, name: name }, { email: newEmail }, { new: true })
                .then(updatedUser => {
                  if (updatedUser) {
                    res.status(200).json("User Email Updated");
                  } else {
                    res.status(500).json('Internal Server Error');
                  }
                })
                .catch(error => {
                  console.log('Error updating email:', error);
                  res.status(500).json('Internal Server Error');
                });
            }
          })
          .catch(error => {
            console.log('Error finding user:', error);
            res.status(500).json('Internal Server Error');
          });
      }
    })
    .catch(error => {
      console.log('Error finding user:', error);
      res.status(500).json('Internal Server Error');
    });
});

app.post('/terminateAccount', (req, res) => {
  const { email, name, pass } = req.body.userDetail;
  userModel.findOne({email: email , name: name, password: pass})
  .then(user => {
      if(user){
        userModel.deleteOne({ email: email, name:name })
        .then(() => {
          res.json('Account Terminated');
        })
        .catch(error => {
          res.json('Error occurred while terminating');
        });
      }
      else{
          res.json('User Not Found')
      }
  })
})

app.listen(3001, () => {
  console.log('Server is running')
})
