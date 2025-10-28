import express from 'express';
import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote
} from '../controllers/noteController.js';

const router = express.Router();

// CREATE - POST /api/notes
// Create a new note
router.post('/', createNote);

// READ - GET /api/notes
// Get all notes with optional filtering, searching, and sorting
// Query params: category, tag, search, sortBy, order
router.get('/', getAllNotes);

// READ - GET /api/notes/:id
// Get a single note by its ID
router.get('/:id', getNoteById);

// UPDATE - PUT /api/notes/:id
// Update an existing note by its ID
router.put('/:id', updateNote);

// DELETE - DELETE /api/notes/:id
// Delete a note by its ID
router.delete('/:id', deleteNote);

export default router;