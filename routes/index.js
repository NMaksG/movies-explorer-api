const router = require('express').Router();
const movieRouter = require('./movie');
const userRouter = require('./user');
const { auth } = require('../middlewares/auth');
const { createUser, login, deleteCookie } = require('../controllers/user');
const { validLogin, validCreateUser } = require('../middlewares/validation');
const NotFoundError = require('../errors/NotFoundError');
const { NF_ERR } = require('../utils/contants');

router.post('/signin', validLogin, login);

router.post('/signup', validCreateUser, createUser);

router.delete('/signout', deleteCookie);

router.use(auth);

router.use(userRouter);
router.use(movieRouter);
router.use((req, res, next) => next(new NotFoundError(NF_ERR)));

module.exports = router;
