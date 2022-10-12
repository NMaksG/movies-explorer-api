require('dotenv').config();

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const { PORT = 3000 } = process.env;
const app = express();

const { NODE_ENV, URL_DB } = process.env;
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');

const NotFoundError = require('./errors/NotFoundError');

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'https://nmg.nomoredomains.club',
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

app.use((req, res, next) => next(new NotFoundError('Запрашиваемая страница не найдена')));

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Произошла ошибка на сервере'
        : message,
    });
  next(err);
});

async function main() {
  try {
    await mongoose.connect(NODE_ENV === 'production' ? URL_DB : 'mongodb://localhost:27017/bitfilmsdb', {
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
