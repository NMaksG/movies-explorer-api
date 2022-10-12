const router = require('express').Router();
const movieRouter = require('./movie');
const userRouter = require('./user');
const { auth } = require('../middlewares/auth');
const { createUser, login, deleteCookie } = require('../controllers/user');
const { validLogin, validCreateUser } = require('../middlewares/validation');

router.post('/signin', validLogin, login);

router.post('/signup', validCreateUser, createUser);

router.delete('/signout', deleteCookie);

router.use(auth);

router.use(userRouter);
router.use(movieRouter);

module.exports = router;
