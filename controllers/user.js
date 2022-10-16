const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const InternalServerError = require('../errors/InternalServerError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const {
  BR_ERR,
  C_ERR,
  IS_ERR,
  NFU_ERR,
  U_ERR,
  cookieDel,
} = require('../utils/contants');

module.exports.createUser = async (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, password: hashedPassword,
    });
    return res.send({
      name: user.name, email,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(BR_ERR));
    }
    if (err.code === 11000) {
      return next(new ConflictError(C_ERR));
    }
    return next(new InternalServerError(IS_ERR));
  }
};

module.exports.getUserMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new NotFoundError(NFU_ERR));
    }
    return res.send(user);
  } catch {
    return next(new InternalServerError(IS_ERR));
  }
};

module.exports.updateUser = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true },
    );
    if (!user) {
      return next(new NotFoundError(NFU_ERR));
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(BR_ERR));
    }
    if (err.code === 11000) {
      return next(new ConflictError(C_ERR));
    }
    return next(new InternalServerError(IS_ERR));
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new UnauthorizedError(U_ERR));
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return next(new UnauthorizedError(U_ERR));
    }
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    res.cookie('jwt', token, {
      maxAge: 3600000,
      httpOnly: true,
      sameSite: true,
    });
    return res.send({
      name: user.name, about: user.about, avatar: user.avatar, email,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports.deleteCookie = async (req, res, next) => {
  try {
    await res.clearCookie('jwt');
    return res.send({ message: cookieDel });
  } catch (err) {
    return next(err);
  }
};
