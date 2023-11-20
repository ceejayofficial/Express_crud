const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Connect to the local MongoDB database

mongoose.connect('mongodb://localhost:27017/students', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the Student schema
const studentSchema = new mongoose.Schema({

   name: String,
   school: Number,
   email: String,
   department: String,

});

// Create a mongoose model based on the schema

const Student = mongoose.model('Student', studentSchema);

// Middleware to parse incoming JSON requests
app.use(bodyParser.json()); 

// CRUD operations

// Read all students

app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


