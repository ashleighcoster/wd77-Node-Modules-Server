// let express = require('express');
// let router = express.Router();
// let sequelize = require('../db'); 
// let User = sequelize.import('../models/user.js'); 

const user = require('../models/user');

//OR YOU COULD: 

//refactor code to make it smaller using chaining events, such as .Router() = same as setting the first two variables 
const router = require('express').Router(); 

//chaining sequelize and user together 
const User = require('../db').import('../models/user.js'); 

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 

//!!! USER SIGNUP MODULES !!!
//Create a new endpoint: /create
//The endpoint is going to be a post request
//Have an object that matches the model of UserTable (email/password)
//Let sequelize create a new record in the database (create)
router.post('/create', function(req, res) {
     
    // let userModel = {
    //     email: req.body.user.email, //object we created in Postman - drilling into it like we would a fetch request - req.body = comes from the function 'req' part then look at object for the user.email portion 
    //     password: req.body.user.password,
    //     //Module 9.2.3 (see below)
    // };
    // User.create(userModel) 
    //or you can write it cleaner like this:

    User.create({
        email:req.body.user.email, 
        password: bcrypt.hashSync(req.body.user.password, 13)
    })
    .then(function createSuccess(user) {
        let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
        res.json({
            user: user,
            message: 'User successfully created', 
            sessionToken: token, 
        });
        // res.json(responseObject); took out the responseObject as the above methode with res.json made more sense to me and was shown in a later module
        //Module 9.2.5 (see below)
    })
    .catch(function(err) {
        res.status(500).json({error: err}); 
        //Module 9.2.6 (see below)
    });
});                                                    

//!!! USER LOGIN MODULES !!!
//Module 9.3.3 - Create a new endpoint: /login
//The endpoint is going to be a POST request
//Build a query statement (hard code in a user's email that exists in your database)
//use findOne
//Let Sequelize return a success
//If we find one return user info and if user doesn't exist return 'user does not exist' 
router.post('/login', function(req, res) {

    User.findOne({
        where: {
            email: req.body.user.email
        }
    })
    .then(function loginSuccess(user){
        if (user) {
            bcrypt.compare(req.body.user.password, user.password, function (err, matches) {
            if (matches) {
                let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24})

                res.status(200).json({
                user: user, 
                message: "User successfully logged in!",
                sessionToken: token, 
                })

            } else {
                res.status(502).send({error: "Login Failed"})
            }
        })

        } else {
            res.status(500).send({error: 'User not found'})
        }        
    })
    .catch((err) => 
        res.status(500).json({error: err}));
});                                             



module.exports = router; 


//!! NOTES from Module 9.2.3 - Sending Data to the Database!! 
// Summary of the flow
// In this module, the following flow is happening:
//1. We make a POST request with Postman.
//2. The router sends that request to the usercontroller
//3. Our usercontroller POST method allows access to the user model.
//4. We then use the Sequelize create() method to create the object to be sent to the DB.
//5. The object is sent and Postgres stores it.
//6. The controller sends a response to Postman.

//!! NOTES from Module 9.2.5 - JSON Response !!
//Summary of the flow 
//1. Make a Postman request with Postman 
//2. app.use(express.json()) breaks the request into JSON
//3. The router sends the request to the usercontroller 
//4. the controller with the /create endpoint is called 
//5. the req.body.user object is captured
//6. We then use the sequelize create() method to create the object to be sent to the DB 
//7. The object is sent and Postgres stores it 
//8. After data is stored, we fire the .then() method, which returns a Promise 
//9. We call a method that takes in a parameter called 'user' - it holds the data for the response 
//10. The method sends the data back as JSON this time, and the response goes to Postman 

//!! NOTES from Module 9.2.6 - Error Handling !! 
//Summary of Flow - continued from last module 
//11. We are adding the .catch() function to handle when server throws an error 