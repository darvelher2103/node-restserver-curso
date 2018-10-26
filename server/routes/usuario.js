const express = require('express');

//para encriptar contraseñas
const bcryp = require('bcrypt');

//para hacer uso de la libreria underscore
const _ = require('underscore');

//objeto usuario que podemos utilizar para crear nuevos elementos
const Usuario = require('../models/usuario');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

//cargamos e inicializamos el express
const app = express();

//traemos los usuarios de la base de datos..
// verificaToken es el middlewar que se dispara cuando quiera acceder a esta ruta
app.get('/usuario', verificaToken, (req, res) => { //remplazamos el callback por un middlewares

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde) //desde donde quiero los registros..
        .limit(limite) //cuantos quiero por pagina
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });

        });

    /*return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email
    });*/

    //res.json('get Usuario LOCAL!!!')
});

//agregamos los usuarios a la base de datos..
//los middlewares se colocan como segundo argumento es un collbacks
// este midd.. se dispara cuando quiera acceder a la ruta '/usuario'
app.post('/usuario', [verificaToken, verificaAdmin_Role], function(req, res) {

    let body = req.body;
    //creamos el objeto de tipo usuario con los valores que recibimos del formulario..

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcryp.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) { //si existe un error termina el codigo
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({ // si no hay errores..
            ok: true,
            usuario: usuarioDB
        });

    });

    /*if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre de usuario es requerido!'
        });
    } else {
        res.json({
            usuario: body
        });
    }*/

});

//actualizamos los usuarios de la basde de datos..
app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;
    //cargamos las opciones que sepuedan atualizar
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

    //res.json({
    //    id,
    //});

});

//eliminamos los usuarios de la base de datos..
app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.param.id;
    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    let cambiaEstado = {
        estado: false
    };

    Usuario.findOneAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encotrado'
                }
            });
        };

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });
    //res.json("delete Usario");
});

module.exports = app;