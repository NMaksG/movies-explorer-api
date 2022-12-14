const { Joi, celebrate } = require('celebrate');
const { ObjectId } = require('mongoose').Types;
const { isURL } = require('validator');
const { messageValidUrl, validMId } = require('../utils/contants');

const validUrl = (value) => {
  if (isURL(value)) {
    return value;
  }
  throw new Error(messageValidUrl);
};
const validMovieId = (value) => {
  if (ObjectId.isValid(value)) {
    return value;
  }
  throw new Error(validMId);
};

module.exports.validLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validMovieDel = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().length(24).custom(validMovieId),
  }),
});

module.exports.validCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    image: Joi.string().required().custom(validUrl),
    trailerLink: Joi.string().required().custom(validUrl),
    thumbnail: Joi.string().required().custom(validUrl),
    movieId: Joi.number().required(),
  }),
});
module.exports.validUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
  }),
});
