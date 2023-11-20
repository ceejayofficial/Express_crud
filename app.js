const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Connect to the local MongoDB database
mongoose.connect('mongodb://localhost:27017/mylibrary', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the Book schema
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
});

// Create a mongoose model based on the schema
const Book = mongoose.model('Book', bookSchema);

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// CRUD operations

// Read all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read a specific book by ID
app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new book
app.post('/books', async (req, res) => {
  const newBook = new Book({
    title: req.body.title,
    author: req.body.author,
  });

  try {
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a book by ID
app.put('/books/:id', async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        author: req.body.author,
      },
      { new: true }
    );

    if (updatedBook) {
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a book by ID
app.delete('/books/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findOneAndDelete(req.params.id);
    if (deletedBook) {
      res.json({ message: 'Book deleted successfully' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
