const express = require('express');

//para encriptar contraseñas
const bcryp = require('bcrypt');

const jwt = require('jsonwebtoken');

//objeto usuario que podemos utilizar para crear nuevos elementos
const Usuario = require('../models/usuario');

//cargamos e inicializamos el express (funcion)
const app = express();


app.post('/login', (req, res) => { //ruta + un callback js

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => { //REGRESAMOS SOLO 1 findOne

        if (err) {
            return res.status(500).json({ //error de servidor
                ok: false,
                err
            });
        }

        if (!usuarioDB) { //si el usuario no existe en la bd
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos' //No hacer en produccion(Usuario)
                }
            });
        }

        //compareSync compara si la contraseñas no son iguales
        if (!bcryp.compareSync(body.password, usuarioDB.password)) { // retorna true o false
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        //definimos nuestro token
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });

    // para probar 
    /*
    res.json({
        ok: true,
    });
    */

});

module.exports = app; // de esta manera podemos usar todas las configuraciones que se le hagan a app en otras paginas