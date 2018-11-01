const express = require('express');

//para encriptar contraseñas
const bcryp = require('bcrypt');

const jwt = require('jsonwebtoken');

// para verificar token 
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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

//Configuraciones de google
//verify es una promesa
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];

    //console.log(payload.name);
    return { //obhjeto googleUser que contiene la informacion del usuario
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

    // If request specified a G Suite domain:
    //const domain = payload['hd'];
}


app.post('/google', async(req, res) => {
    //capturo el token del lado del servidor a travez de una peticion http
    let token = req.body.idtoken;

    //promesa debe tener un await y el debe estar dentro de un async
    let googleUser = await verify(token)
        .catch(e => { //si ha sufrido cambios el token
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    //ya teniendo el usuario de google, validamos

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        //si hay algun error lo mostramos 
        if (err) {
            return res.status(500).json({ //error de servidor
                ok: false,
                err
            });
        }

        // si existe un usuario de bd
        if (usuarioDB) {
            //preguntamos si se ha autenticado por la cuenta normal
            if (usuarioDB.google === false) {
                return res.status(400).json({ //error de servidor
                    ok: false,
                    err: {
                        message: 'Debe de usar su atenticación normal'
                    }
                });
            } else {
                //si se ha autenticado por google renovamos su token para que pueda seguir trabajando

                //definimos nuestro token
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                //lo mandamos a imprimir
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else { //si nunca se ha autenticado debemos crear el usuario
            //si el usuario no existe en nuestra base de datos
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({ //error de servidor
                        ok: false,
                        err
                    });
                };

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            });
        }


    });

    /*res.json({
        usuario: googleUser
    });*/

    /*res.json({
        body: req.body
    });
    */
});

module.exports = app; // de esta manera podemos usar todas las configuraciones que se le hagan a app en otras paginas