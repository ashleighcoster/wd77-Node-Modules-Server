require('dotenv').config();
let express = require('express');
let app = express();
const sequelize = require("./db");

let journal = require('./controllers/journalcontroller');
//the journal variable - stores and imports the route object that we created
let user = require('./controllers/usercontroller'); 

sequelize.sync(); 
// sequelize.sync({force: true})

app.use(require('./middleware/headers'));

app.use(express.json()); 
//this accepts json into our server and convert it into an object so we can use it in our controller - this allows us to do the req.body.user.email in the usercontroller.js file 
//!! app.use statements MUST go above any routes - to allow the express.json function to work on them !! --> this tells the application that we want JSON to be used as we process the request 

//NEW CODE START - what it will look like 
//app.use(endpoint, callback function):
//app.use('/test/, function(req,res) { 
    //res.send('This is a test route)  
//})

//Code Analysis: 
//1. GET request is made to localhost:3000/api/test
//2. When route is requested, Express finds the method for the specific route. 
//3. When we go to the endpoint '/test' --> it fires off an express function --> res.send 
//4. res (response) handles packaging up the response object 
//5. The .send() method does the job of sending off the response
//NEW CODE END 

// app.use('/test', function(req, res) {
//     res.send('This is a message from the test endpoint on the server!');
// });

// app.use('/ashleigh', function(req, res) {
//     res.send("My name is Ashleigh, and I'm 39 years old.");
// });

app.use('/user', user); 

// app.use(require('./middleware/validate-session'));
//anything above this will not require a token for access, while any code below this will require a token to access, thus becoming protected  (i.e. 'user' route is not protected while 'journal' route is protected)
//this option is best when you have a controller or multiple controllers where ALL of the routes need to restricted, so we will not use this line of code for this here but instead add code directly to the journalcontroller.js file/route 

app.use('/journal', journal);
//1st parameter = '/journal' = creating the base url - really looks like this http://localhost:3000/journal 
//2nd parameter = pass in the 'journal' variable that was created --> this means that all routes created in the journalcontroller.js file will be sub-routes 


app.listen(3000, function() {
    console.log('App is listening on port 3000');
});

