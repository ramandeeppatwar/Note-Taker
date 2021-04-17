const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const _ = require("lodash");
const db = "db/db.json";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//*********************
//GET /api/notes route
//*********************

app.get("/api/notes", (req, res) => {
  const file = fs.readFileSync(db, "utf8");
  res.json(JSON.parse(file));
});

//**********************
//POST /api/notes route
//**********************

app.post("/api/notes", (req, res) => {
  fs.readFile(db, (err, data) => {
    if (err) throw err;
    let newNote = { ...req.body, id: uuid() };
    let notesArr = JSON.parse(data);
    let updatedNotesArr = [...notesArr, newNote];

    fs.writeFileSync(db, JSON.stringify(updatedNotesArr));
    res.json(newNote);
  });
});

//****************************
//DELETE /api/notes/:id route
//****************************

app.delete("/api/notes/:id", (req, res) => {
  fs.readFile(db, "utf-8", (err, data) => {
    if (err) throw err;
    let id = req.params.id;
    let notesArr = JSON.parse(data);

    let deleteNote = _.find(notesArr, (note) => note.id === id);

    let updatedNotesArr = notesArr.filter(
      (note) => !_.isEqual(note, deleteNote)
    );

    fs.writeFileSync(db, JSON.stringify(updatedNotesArr));
    res.json(deleteNote);
  });
});

//*****************
// HTML GET ROUTES
//*****************

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

app.listen(PORT, () => {
  console.log("App listening on PORT " + PORT);
});
// GET /notes - list all notes
// POST /notes - Create a new note
// DELETE /note/:id - Destroy one note
