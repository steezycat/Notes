const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

let notes = [];
let id = 1;

// Create a new note
app.post('/notes', (req, res) => {
  const { title, content, status } = req.body;
  const newNote = { id: id++, title, content, status };
  notes.push(newNote);
  res.status(201).json(newNote);
});

// Get all notes
app.get('/notes', (req, res) => {
  res.json(notes);
});

// Get a note by ID
app.get('/notes/:id', (req, res) => {
  const noteId = parseInt(req.params.id);

  // Find the note by ID
  const note = notes.find(note => note.id === noteId);
  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }

  res.json(note);
});

// Update a note by ID
app.put('/notes/:id', (req, res) => {
  const noteId = parseInt(req.params.id);
  const { title, content, status } = req.body;

  // Find the note by ID
  const noteIndex = notes.findIndex(note => note.id === noteId);
  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }

  // Update the note
  notes[noteIndex].title = title;
  notes[noteIndex].content = content;
  if (status) {
    notes[noteIndex].status = status;
  }

  res.json(notes[noteIndex]);
});

// Delete a note by ID
app.delete('/notes/:id', (req, res) => {
  const noteId = parseInt(req.params.id);

  // Find the note by ID
  const noteIndex = notes.findIndex(note => note.id === noteId);
  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }

  // Remove the note from the array
  const deletedNote = notes.splice(noteIndex, 1);

  res.json({ message: 'Note deleted', deletedNote });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
