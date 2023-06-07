const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const userModel = require('./models/users')

const app = express()
app.use(express.json())
app.use(cors())

const db = 'mongodb+srv://Whitesugar:1zNhtYOKTXYMTVS7@clusterdemo.qjs12rn.mongodb.net/Users';

mongoose.connect(db);

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    userModel.findOne({email: email})
    .then(user => {
        if(user){
            if(user.password === password){
                if(user.name === 'admin'){
                    res.json('Admin')
                }
                else{
                    res.json('Login Success')
                }
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
    userModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

app.listen(3001, () => {
    console.log('Server is running')
})