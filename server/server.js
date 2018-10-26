require('./config/config'); //lee la configuracion del puerto
const express = require('express');

//cargamos la libreria de mongoose
const mongoose = require('mongoose');

//inicializamos el express
const app = express();

//serializa el data de un formulario
const bodyParser = require('body-parser');
//configuracion del bodyParser
//middlewares (app.use) -> por cada peticion que se haga se ejecuta este codigo..
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//paquete que serializa la informacion
//para que sea facilmente procesada en las peticiones post
app.use(bodyParser.json());

//Configuracion global de rutas
app.use(require('./routes/index'));


//environment desarrollo - produccion
//establecemos la conexion
//mongoose.connect('mongodb://localhost:27017/cafe', (err, resp) => {
mongoose.connect(process.env.URLDB, (err, resp) => {
    //definimos un collback para saber si lo logra hacer o no
    if (err) throw err; // se detiene el programa mostrando el porque.
    // en caso contrario
    console.log('Base de datos ONLINE (conectado)');
});

//cadena de conexion local(escuchando el puerto definido)
app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto:", process.env.PORT);
});