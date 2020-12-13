const uniqid = require("uniqid");
const express = require("express");
const path = require("path");
const PORT = 8080;
const app = express();
const dbEl = require('./db/db.json');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
let dbArr;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.use(express.static('public'))

app.get('/api/notes', (req, res) => {
    dbArr = dbEl;
    res.json(dbEl);
})

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

let testId = 1;
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = (testId++).toString();
    console.log(newNote);
    dbEl.push(newNote);
    res.json(newNote);
})

app.delete('/api/notes/:note', (req, res) => {
    const chosen = req.params.note;
    for (let i = 0; i < dbArr.length; i++) {
        if(chosen === dbArr[i].id) {
            res.send(`User deleted this note: ${dbArr[i].title}`);
        }
    }
})

app.listen(PORT, (err) => {
    err?console.error:console.log(`server is listening to ${PORT}`);
});

