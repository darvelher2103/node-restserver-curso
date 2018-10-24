//este archivo contiene la definicion de todas nuestras rutas

const express = require('express');
const app = express();



//referenciamos las rutas del usuario
app.use(require('./usuario'));

//referenciamos las rutas del login
app.use(require('./login'));


module.exports = app;