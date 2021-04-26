//GET
//POST
//PUT
//DELETE 
//standard controllers we are going to make and how to set them up:

let express = require('express'); 
//we are importing the Express framework here and storing it inside this variable - this becomes our gateway to using Express methods 

let router = express.Router();
//using the express variable to access the router() method, which will return a router object 
//can access express properties and methods by calling express + .... (such as the router variable above)

let validateSession = require('../middleware/validate-session'); 
const { route } = require('./usercontroller');
const Journal = require('../db').import('../models/journal');
//we are importing the validate-session middleware and assigning it to a variable called 'validateSession'
//this option is best when you have a controller where a specific number of routes need to be restricted - perfect for us in this code! 

//two arguments: 1.'/practice' = path 2. function(req, res) = callback function (i.e. 'handler function')
//3. added a third argument - 'validateSession' which will check to see if the incoming request has a token for this specific route 
router.get('/practice', validateSession,function(req, res) {
    res.send('This is a practice route!'); 
    //send() = express method that can be called on the res or response object
});

//!!! MODULE 12.3.3 !!! 
router.post('/create', validateSession, (req, res) => {
    const journalEntry = {
        title: req.body.journal.title, 
        date: req.body.journal.date, 
        entry: req.body.journal.entry, 
        owner: req.user.id
    }
    Journal.create(journalEntry)
    .then(journal => res.status(200).json(journal))
    .catch(err => res.status(500).json({error: err}))
});

//!!! MODULE 12.3.4 !!!
router.get('/', (req, res) => {
    Journal.findAll()
    .then(journals => res.status(200).json(journals))
    .catch(err => res.status(500).json({error: err}))
}); 

router.get('/mine', validateSession, (req, res) => {
    let userid = req.user.id
    Journal.findAll( {
        where: {owner: userid}
    })
    .then(journals => res.status(200).json(journals))
    .catch(err => res.status(500).json({error: err}))
}); 

router.get('/:title', function(req, res) {
    let title = req.params.title; 

    Journal.findAll( {
        where: {title: title}
    })
    .then(journals => res.status(200).json(journals))
    .catch(err => res.status(500).json({error: err}))
});


//!!! MODULE 12.3.5 - Updating Journal Entry (PUT) !!! put = update (replaces)
router.put('/update/:entryId', validateSession, function(req, res) {
    const updateJournalEntry = {
        title: req.body.journal.title, 
        date: req.body.journal.date, 
        entry: req.body.journal.entry, 
    }; 

    const query = { where: { id: req.params.entryId, owner: req.user.id } };

    Journal.update(updateJournalEntry, query)
    .then((journals) => res.status(200).json(journals))
    .catch((err) => res.status(500).json({error: err}));
});

//!!! MODULE 12.3.6. - Deleting A Journal Entry (DELETE) !!!
router.delete('/delete/:id', validateSession, function(req, res) {
    const query = { where: { id: req.params.id, owner: req.user.id } };

    Journal.destroy(query)
    .then(() => res.status(200).json({ message: 'Journal Entry Removed' }))
    .catch((err) => res.status(500).json({ error: err }));
});

router.get('/about', function(req, res) {
    res.send('This is the about route.');
}); 

module.exports = router; 
//export the module for usage outside of the file 