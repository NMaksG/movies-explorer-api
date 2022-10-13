const MONGO_DB = 'mongodb://localhost:27017/moviesdb';
const FRONTEND_URL = 'https://nmg-diploma.nomoredomains.icu';
const PORT_BACKEND = 3000;
const NF_ERR = 'Запрашиваемая страница не найдена';
const U_ERR = 'Неправильные почта или пароль';
const BR_ERR = 'Переданы некорректные данные';
const C_ERR = 'Пользователь с таким Email уже существует';
const IS_ERR = 'Произошла ошибка на сервере';
const NFU_ERR = 'Запрашиваемый пользователь не найден';
const NFM_ERR = 'Запрашиваемый фильм не найден';
const F_ERR = 'Нет прав на удаление';

module.exports = {
  MONGO_DB,
  FRONTEND_URL,
  PORT_BACKEND,
  NF_ERR,
  U_ERR,
  BR_ERR,
  C_ERR,
  IS_ERR,
  NFU_ERR,
  NFM_ERR,
  F_ERR,
};
