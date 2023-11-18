const express = require('express')
const { body, validationResult } = require('express-validator');
const cors = require('cors')
const mongoose = require('mongoose');
const userModel = require('./models/users')
const catModel = require('./models/cat')
const newsModel = require('./models/news')
const catFactsModel = require('./models/catfact')
const contactModel = require('./models/contact')
const dogModel = require('./models/dog')
const logModel = require('./models/logging')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express()
app.use(express.json())
app.use(cors())

const db = 'mongodb+srv://Whitesugar:1zNhtYOKTXYMTVS7@clusterdemo.qjs12rn.mongodb.net/PetVeller';

mongoose.connect(db).then(() => {
    console.log('Connected to database');
}).catch((e) => {
    console.log(e);
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email: email });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const token = jwt.sign({ user }, process.env.JWT_SECRET);
        res.json({ token });
      } else {
        res.json('The Password Is Incorrect');
      }
    } else {
      res.json('User Not Found');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json('Internal Server Error');
  }
});

// Define the route for user registration
app.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if the email is already registered
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ error: 'User Exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success message
    res.json('User Registered');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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

app.post(
  '/contact',
  [
    body('firstName').trim().notEmpty().escape(),
    body('surname').trim().notEmpty().escape(),
    body('email').trim().notEmpty().isEmail().escape(),
    body('phone').trim().notEmpty().escape(),
    body('message').trim().notEmpty().escape(),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
  }
);

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
  dogModel.findOne({ userEmail: userEmail, name: name })
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
  const { userEmail, id } = req.body.dogData;
  dogModel.deleteOne({userEmail: userEmail, id: id })
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

  try {
    const user = await userModel.findOne({ email, name });

    if (!user) {
      return res.status(404).json('User Not Found');
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { email, name },
      { name: newName },
      { new: true }
    );

    if (updatedUser) {
      const token = jwt.sign({ user: updatedUser }, process.env.JWT_SECRET);
      return res.status(200).json({ message: 'User Name Updated', token });
    } else {
      return res.status(500).json('Internal Server Error');
    }
  } catch (error) {
    console.error('Error updating username:', error);
    return res.status(500).json('Internal Server Error');
  }
});


app.post('/updatePassword', async (req, res) => {
  const { email, pass, oldPass, name } = req.body.userDetail;

  try {
    const user = await userModel.findOne({ email: email, name: name });

    if (!user) {
      res.status(409).json('User Not Found');
    } else {
      const passwordMatch = bcrypt.compareSync(oldPass, user.password);
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{7,})/;

      console.log('oldPass:', oldPass);
      console.log('user.password:', user.password);
      console.log('passwordMatch:', passwordMatch);

      if(!passwordMatch){
        res.json({message: 'User Current password is unmatched'});

      }else if(!passwordRegex.test(pass)){
        res.json({message: 'User New Password is weak'});

      }else{
        // Hash the new password before updating
        const hashedPassword = await bcrypt.hash(pass, 10);

        const updatedUser = await userModel.findOneAndUpdate(
          { email: email, name: name },
          { password: hashedPassword },
          { new: true }
        );

        if (updatedUser) {
          
          const token = jwt.sign({ user: updatedUser }, process.env.JWT_SECRET);
          res.status(200).json({message: 'User Password Updated', token});
        } else {
          res.status(404).json('User Not Found');
        }
      }
    }
  } catch (error) {
    console.log('Error updating password:', error);
    res.status(500).json('Internal Server Error');
  }
});

app.post('/updateEmail', async (req, res) => {
  try {
    const { email, newEmail, name } = req.body.userDetail;

    const user = await userModel.findOne({ email: email, name: name });

    if (!user) {
      return res.status(409).json('User Not Found');
    }

    const existingUser = await userModel.findOne({ email: newEmail });

    if (existingUser) {
      if (email === newEmail) {
        return res.json({message: 'Email is the same with your old email'});
      } else {
        return res.json({message: 'Email has been taken'});
      }
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { email: email, name: name },
      { email: newEmail },
      { new: true }
    );

    if (updatedUser) {
      const token = jwt.sign({ user: updatedUser }, process.env.JWT_SECRET);
      return res.status(200).json({message: 'User Email Updated', token});
    } else {
      return res.status(500).json('Internal Server Error');
    }
  } catch (error) {
    console.error('Error updating email:', error);
    return res.status(500).json('Internal Server Error');
  }
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

app.post('/save-log', async (req, res) => {
  try {
    const { logContent } = req.body;

    const newLog = new logModel({
      logContent,
    });

    const savedLog = await newLog.save();

    res.status(201).json(savedLog);
  } catch (error) {
    console.error('Error saving log:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.get('/log', async (req, res) => {
  try {
    const logs = await logModel.find();
    res.json(logs);
  } catch (error) {
    console.log('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
})

app.post('/changeRole', async (req, res) => {
  const { email, newRole } = req.body.userDetail;
  userModel.findOne({ email: email })
  .then(user => {
      if(user){
        userModel.findOneAndUpdate({ email: email }, { role: newRole }, { new: true })
          .then(user => {
            if (user && user.role === 'premiumUser') {
              const token = jwt.sign({ user }, process.env.JWT_SECRET);
              res.json({ token });
            } else {
              res.status(404).json('User Not Found Or An Error Occurred.');
            }
          })
          .catch(error => {
            console.log('Error updating role:', error);
            res.status(500).json('Internal Server Error');
          });
      }
      else{
        res.json('Error Occurred')
      }
  })
})

app.get('/userDetails', (req, res) => {
  userModel.find()
    .then(userDetails => {
      res.json(userDetails);
    })
    .catch(error => {
      console.log('Error retrieving user:', error);
      res.status(500).json('Server error');
    });
});

app.post('/deleteUserDetails/:id', (req, res) => {
  const { id } = req.params;

  userModel
    .deleteOne({ _id: id })
    .then(() => {
      res.json('User deleted');
    })
    .catch((error) => {
      console.log('Error deleting user:', error);
      res.status(500).json('Server error');
    });
});

app.get('/get-user-count', async (req, res) => {
  try {
    const userCount = await userModel.countDocuments();
    res.json({ count: userCount });
  } catch (error) {
    console.error('Error fetching user count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/get-catFacts-count', async (req, res) => {
  try {
    const catFactsCount = await catFactsModel.countDocuments();
    res.json({ count: catFactsCount });
  } catch (error) {
    console.error('Error fetching cat facts count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/get-contact-count', async (req, res) => {
  try {
    const contactCount = await contactModel.countDocuments();
    res.json({ count: contactCount });
  } catch (error) {
    console.error('Error fetching feedback count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Define the route for fetching user details by ID
app.get('/userDetails/:_id', async (req, res) => {
  try {
    const _id = req.params._id;

    // Fetch user details from the database based on userId
    const user = await userModel.findById(_id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send the user details in the response
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Define the route for updating user details by ID
app.post('/userDetails/:_id', async (req, res) => {
  try {
    const _id = req.params._id;
    const updateValues = req.body;

    // Update user details in the database based on userId
    const updatedUser = await userModel.findByIdAndUpdate(_id, updateValues, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send the updated user details in the response
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Define the route for user registration
app.post('/addadmin', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if the email is already registered
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ error: 'User Exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success message
    res.json('User Registered');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3001, () => {
  console.log('Server is running')
})
