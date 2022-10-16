const movieRouter = require('express').Router();
const { validMovieDel, validCreateMovie } = require('../middlewares/validation');
const {
  getMovies, deleteMovie, createMovie,
} = require('../controllers/movie');

movieRouter.get('/movies', getMovies);
movieRouter.delete('/movies/:movieId', validMovieDel, deleteMovie);
movieRouter.post('/movies', validCreateMovie, createMovie);

module.exports = movieRouter;
