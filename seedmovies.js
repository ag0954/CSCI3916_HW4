const mongoose = require('mongoose');
const Movie = require('./Movies');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));

// Define movie data (at least 5 movies)
const movies = [
  {
    title: "Inception",
    releaseDate: 2010,
    genre: "Science Fiction",
    actors: [{ actorName: "Leonardo DiCaprio", characterName: "Cobb" }]
  },
  {
    title: "The Matrix",
    releaseDate: 1999,
    genre: "Science Fiction",
    actors: [{ actorName: "Keanu Reeves", characterName: "Neo" }]
  },
  {
    title: "The Godfather",
    releaseDate: 1972,
    genre: "Drama",
    actors: [{ actorName: "Marlon Brando", characterName: "Vito Corleone" }]
  },
  {
    title: "Pulp Fiction",
    releaseDate: 1994,
    genre: "Thriller",
    actors: [{ actorName: "John Travolta", characterName: "Vincent Vega" }]
  },
  {
    title: "The Dark Knight",
    releaseDate: 2008,
    genre: "Action",
    actors: [{ actorName: "Christian Bale", characterName: "Batman" }]
  }
];

// Function to insert movies
const seedMovies = async () => {
  try {
    // Optional: Clear existing movies (uncomment if needed)
    // await Movie.deleteMany({});
    
    // Insert movies
    await Movie.insertMany(movies);
    console.log('Movies inserted successfully');
  } catch (err) {
    console.error('Error inserting movies:', err);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
};

// Run the seeding function
seedMovies();