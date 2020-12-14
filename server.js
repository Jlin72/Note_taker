const express = require("express");
const path = require("path");
const PORT = 8080;
const app = express();
const dbEl = require('./db/db.json');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
let dbArr;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// This next line of code will be used to load the 'index.html' when the user first access the website.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// This next line of code is used to load and start the html file 'notes.html' when the user goes into the '/notes' URL.
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// This next line of code is used so that when the index.html is hosted on localhost the javascript and css files will also be operational with the site.
app.use(express.static('public'))

// This next line of codes will be used to check the information inside the database.
app.get('/api/notes', (req, res) => {
    dbArr = dbEl;
    res.json(dbEl);
})

// This next line app code will be used to return a specific line of data from the database, when someone calls the api.
app.get('/api/notes/:note', (req, res) => {
    const chosen = req.params.note;
  
    console.log('this is: '+chosen);
  
    for (let i = 0; i < dbArr.length; i++) {
        if(chosen === dbArr[i].id) {
            return res.json(dbArr[i]);
        }
    }
  
    return res.json(false);
});

// The testId variable is used to give each note a specific id.
let testId = 1;
// This next line of code is used for when the user want to do a fetch request with a post method.
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = (testId++).toString(); //this line of code will transform the id into a string, this is required because url link need a string value not a number.
    console.log("User added the following note with the title: "+ newNote.title);
    dbEl.push(newNote); //This line is used to push the post data from the index.html into the database.
    res.json(newNote);
})

// The next lines of code are used for when the user starts a fetch call with a delete method.
app.delete('/api/notes/:note', (req, res) => {
    const chosen = req.params.note;
    for (let i = 0; i < dbArr.length; i++) {
        if(chosen === dbArr[i].id) {
            console.log(`User deleted a note, note title is: ${dbArr[i].title}`);
            dbArr.splice(i,1); //This line of code is used to delete the note the user selects.
            return res.json(dbArr);
        }
    }
})

app.listen(PORT, (err) => {
    err?console.error:console.log(`server is listening to ${PORT}`);
});

