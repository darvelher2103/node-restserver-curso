const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion'); //todas lo requieren

let app = express();

let Categoria = require('../models/categoria');

//*****************************
// Mostrar todas las categorias
//*****************************
app.get('/categoria', verificaToken, (req, res) => {

    // Trae Todas las categorías
    // .populate() verifica que objecId existe en el modelo Categoria
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });

        })

});


//*****************************
// Mostrar una categoria por ID
//*****************************
app.get('/categoria/:id', verificaToken, (req, res) => {
    //Categoria.findById();

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        // Si existe un error
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Si no existe la categoria en la base de datos
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                message: 'El ID de la Categoría no existe'
            });
        }

        // Si existe la categoria en la base de datos

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

//*****************************
// Crear nueva Categoria
//*****************************
app.post('/categoria', verificaToken, (req, res) => {
    // Regresa la nueva categoria
    // req.usuario._id

    let body = req.body;
    //console.log(req.usuario._id);
    //instancia de categoria 
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id // para que funcione debemos enviar el verificar token
    });

    categoria.save((err, categoriaDB) => {
        // si existe un error 
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // si no se crea la categoría // (err) dice porque no se creo
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //Si todo salio bien
        res.json({
            ok: true,
            categoria: categoriaDB
        });


    });

});

//*****************************
// Actualizar una Categoria po ID
//*****************************
app.put('/categoria/:id', verificaToken, (req, res) => {
    //actualizar la descripcion de la categoria

    let id = req.params.id; // lo trae la url
    let body = req.body; // lo trae el body

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => { //error o categoria actualizada de la bd
        // si existe un error
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // si no se crea la categoria
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // si todo sale bien 
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // Solo un admin puede borrar la categoria
    // Vategoria.finByIdAndRemove

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        // Si existe un error
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Si no existe el usuario en la base de datos
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                message: 'El ID de la Categoría no existe'
            });
        }

        // Si todo sale bien

        res.json({
            ok: true,
            message: 'Categoría Borrada'
        });

    });

});

module.exports = app;