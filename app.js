require('dotenv').config();

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const { NODE_ENV, URL_DB } = process.env;
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const { handlerErrors } = require('./middlewares/handlerErrors');
const { limiter } = require('./middlewares/limiter');

const NotFoundError = require('./errors/NotFoundError');
const {
  MONGO_DB,
  FRONTEND_URL,
  PORT_BACKEND,
  NF_ERR,
} = require('./utils/contants');

const { PORT = PORT_BACKEND } = process.env;
const app = express();

app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

app.use(requestLogger);

// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

app.use(router);

app.use((req, res, next) => next(new NotFoundError(NF_ERR)));

app.use(errorLogger);

app.use(errors());

app.use(handlerErrors);

async function main() {
  try {
    await mongoose.connect(NODE_ENV === 'production' ? URL_DB : MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    });
    await app.listen(PORT);
    console.log(`Cервер запущен на ${PORT} порту`);
  } catch (err) {
    console.error(err.message);
  }
}

main();
