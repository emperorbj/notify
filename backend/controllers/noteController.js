import Note from '../models/Notes.js';

// CREATE - Create a new note
export const createNote = async (req, res) => {
  try {
    const { title, content, tags, category, isPinned } = req.body;
    
    const note = new Note({
      title,
      content,
      tags,
      category,
      isPinned
    });
    
    const savedNote = await note.save();
    
    res.status(201).json({
      success: true,
      data: savedNote
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// READ - Get all notes with optional filters
export const getAllNotes = async (req, res) => {
  try {
    const { category, tag, search, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    // Build query object
    const query = {};
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by tag
    if (tag) {
      query.tags = tag;
    }
    
    // Search in title and content
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Sort order
    const sortOrder = order === 'asc' ? 1 : -1;
    
    // Execute query
    const notes = await Note.find(query)
      .sort({ [sortBy]: sortOrder })
      .exec();
    
    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// READ - Get a single note by ID
export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: note
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// UPDATE - Update a note
export const updateNote = async (req, res) => {
  try {
    const { title, content, tags, category, isPinned } = req.body;
    
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, tags, category, isPinned },
      { new: true, runValidators: true }
    );
    
    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: note
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// DELETE - Delete a note
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
      data: note
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};