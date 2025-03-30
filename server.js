const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const authJwtController = require('./auth_jwt'); // You're not using authController, consider removing it
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./Users');
const Movie = require('./Movies'); // You're not using Movie, consider removing it
const Review = require('./Reviews')
const app = express();

const crypto = require('crypto');
const rp = require('request-promise');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

const router = express.Router();

const GA_TRACKING_ID = process.env.GA_KEY

async function trackReview(category, action, label, value, movieName) {
  const options = {
    method: 'GET',
    url: 'https://www.google-analytics.com/collect',
    qs: {
      v: '1', // API Version
      tid: GA_TRACKING_ID, // Tracking ID
      cid: crypto.randomBytes(16).toString('hex'), // Random Client ID
      t: 'event', // Hit type: Event
      ec: category, // Event Category (e.g., movie genre)
      ea: action, // Event Action (e.g., 'post/reviews')
      el: label, // Event Label (e.g., 'API Request for Movie Review')
      ev: value, // Event Value (numeric, e.g., 1)
      cd1: movieName, // Custom Dimension 1: Movie Name
      cm1: 1 // Custom Metric 1: Number of requests (increment by 1)
    },
    headers: {
      'Cache-Control': 'no-cache'
    }
  };

  try {
    await rp(options);
    console.log(`Analytics tracked for movie: ${movieName}`);
  } catch (err) {
    console.error('Error sending analytics:', err);
  }
}


router.post('/signup', async (req, res) => { // Use async/await
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ success: false, msg: 'Please include both username and password to signup.' }); // 400 Bad Request
  }

  try {
    const user = new User({ // Create user directly with the data
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
    });

    await user.save(); // Use await with user.save()

    res.status(201).json({ success: true, msg: 'Successfully created new user.' }); // 201 Created
  } catch (err) {
    if (err.code === 11000) { // Strict equality check (===)
      return res.status(409).json({ success: false, message: 'A user with that username already exists.' }); // 409 Conflict
    } else {
      console.error(err); // Log the error for debugging
      return res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' }); // 500 Internal Server Error
    }
  }
});


router.post('/signin', async (req, res) => { // Use async/await
  try {
    const user = await User.findOne({ username: req.body.username }).select('name username password');

    if (!user) {
      return res.status(401).json({ success: false, msg: 'Authentication failed. User not found.' }); // 401 Unauthorized
    }

    const isMatch = await user.comparePassword(req.body.password); // Use await

    if (isMatch) {
      const userToken = { id: user._id, username: user.username }; // Use user._id (standard Mongoose)
      const token = jwt.sign(userToken, process.env.SECRET_KEY, { expiresIn: '1h' }); // Add expiry to the token (e.g., 1 hour)
      res.json({ success: true, token: 'JWT ' + token });
    } else {
      res.status(401).json({ success: false, msg: 'Authentication failed. Incorrect password.' }); // 401 Unauthorized
    }
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' }); // 500 Internal Server Error
  }
});

router.route('/movies')
    .get(authJwtController.isAuthenticated,async (req, res) => {
      try {
        const movies = await Movie.find();
        res.json(movies);
      }catch (error) {
        res.status(500).json({ success: false, msg: 'Error retrieving movies' });
      }
    })
    .post(authJwtController.isAuthenticated,async (req, res) =>{
      const { title, releaseDate, genre, actors } = req.body;
      if (!title || !releaseDate || !genre || !actors || !Array.isArray(actors) || actors.length === 0) {
        return res.status(400).json({
          success: false,
          msg: "All fields are required. The movie must include a title, release date, genre, and at least one actor."
        });
      }
      try {
        const newMovie = new Movie(req.body);
        await newMovie.save();
        res.status(201).json({ success: true, msg: 'Movie added successfully.', movie: newMovie });
      }catch (error) {
        res.status(400).json({ success: false, msg: 'Failed to add movie', error });
      }
    })
    .all((req,res)=>{
      res.status(405).send({status: 405, message: 'HTTP method not supported'});
    });

router.route('/movies/:title')
  .get(authJwtController.isAuthenticated,async (req, res) => {
    try {
      if(req.query.reviews === 'true'){
        const movieWithReviews = await Movie.aggregate([
          {$match:{title:req.params.title}},
          {
            $lookup:{
              from: "reviews",
              localField: "_id",
              foreignField: "movieId",
              as: "reviews"
            }
          }
        ]);
        if(!movieWithReviews||movieWithReviews.length === 0){
          return res.status(404).json({success:false, msg:'Movie not found.'});
        }
        return res.json(movieWithReviews[0]);
      }else{

        const movie = await Movie.findOne({title: req.params.title});
        if(!movie) return res.status(404).json({success: false, msg:'Movie not found'})
        res.json(movie);
      }
    }catch (error) {
      res.status(500).json({ success: false, msg: 'Error retrieving movie' });
    }
  })
  .put(authJwtController.isAuthenticated,async (req, res) =>{
    try {
      const updatedMovie = await Movie.findOneAndUpdate(
          { title: req.params.title }, 
          req.body, 
          { new: true }
      );
      if (!updatedMovie) return res.status(404).json({ success: false, msg: 'Movie not found.' });
      res.json({ success: true, msg: 'Movie updated.', movie: updatedMovie });
      }catch (error) {
        res.status(400).json({ success: false, msg: 'Failed to update movie', error });
      }
  })
  .delete(authJwtController.isAuthenticated,async (req, res) =>{
    try {
      const deletedMovie = await Movie.findOneAndDelete({ title: req.params.title });
      if (!deletedMovie) return res.status(404).json({ success: false, msg: 'Movie not found.' });
      res.json({ success: true, msg: 'Movie deleted.' });
    }catch (error) {
      res.status(500).json({ success: false, msg: 'Failed to delete movie', error });
    }
  });

//Routes for reviews, for getting, posting, and deleting reviews using express router and mongodb

router.route('/reviews')
  .get(authJwtController.isAuthenticated,async(req,res)=>{
    try{
      let filter = {};
      if(req.query.movieId){
        filter.movieId = req.query.movieId;
      }
      const reviews = await Review.find(filter);
      res.json({success: true, reviews});
    }catch(err){
      res.status(500).json({success: false, msg: 'Error Retrieving Reviews', error: err});
    }
  })
  .post(authJwtController.isAuthenticated, async(req, res)=>{
    const{movieId, username, review, rating} = req.body;
    if (!movieId|| !username || !review || rating == undefined){
      return res.status(400).json({success: false, msg: "All fields(movieId, username, review, and rating are required)."});
    }
    if(rating <0|| rating >5){
      return res.status(400).json({
        success: false,
        msg: "Rating must be between 0 and 5."
      });
    }
    try{
      const movie = await Movie.findById(movieId);
       if(!movie){
        return res.status(404).jsonp({success: false, msg: 'Movie Not Found'});
       }
       const newReview = new Review({movieId, username, review, rating});
       await newReview.save();

       await trackReview(
        movie.genre,
        'post/reviews',
        'API Request for Movie Review',
        1,
        movie.title
       );
       res.status(201).json({success: true, msg: 'Review created!'});
    }catch(err){
      res.status(500).json({success: false, msg: 'Failed to create review', error: err});
    }
  });



app.use('/', router);

const PORT = process.env.PORT || 8080; // Define PORT before using it
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // for testing only