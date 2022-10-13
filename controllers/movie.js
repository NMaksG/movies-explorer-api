const Movie = require('../models/movie');
const InternalServerError = require('../errors/InternalServerError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const {
  BR_ERR,
  IS_ERR,
  NFM_ERR,
  F_ERR,
} = require('../utils/contants');

module.exports.createMovie = async (req, res, next) => {
  const owner = req.user._id;
  try {
    const movie = await Movie.create({ owner, ...req.body });
    return res.send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(BR_ERR));
    }
    return next(new InternalServerError(IS_ERR));
  }
};

module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({});
    return res.send(movies);
  } catch (err) {
    return next(new InternalServerError(IS_ERR));
  }
};

module.exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) {
      return next(new NotFoundError(NFM_ERR));
    }
    if (!movie.owner.equals(req.user._id)) {
      return next(new ForbiddenError(F_ERR));
    }
    await movie.remove();
    return res.send(movie);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return next(new BadRequestError(BR_ERR));
    }
    return next(new InternalServerError(IS_ERR));
  }
};
