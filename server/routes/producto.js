const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');

//====================================
// Obtener todos los productos
//====================================
app.get('/producto', verificaToken, (req, res) => {
    // trae todos los produtos
    // populate: usuario - categoria
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion usuario')
        .exec((err, productos) => {

            if (err) { //si existe un error
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({ // muestra el resultado de la consulta
                ok: true,
                productos
            });

        });

});

//====================================
// Obtener un producto por ID
//====================================
app.get('/producto/:id', verificaToken, (req, res) => {
    // populate: usuario - categoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });

        });

});

//====================================
// Buscar Productos 
//====================================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i')

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        })
});


//====================================
// Crear un nuevo producto 
//====================================
app.post('/producto', verificaToken, (req, res) => {
    //grabar un usuario
    //grabar una categoria del listado

    let body = req.body; //cargamos lo que viene del formulario

    //instanciamos el objeto producto
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) { // si existe un error
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // si se crea el producto
        res.json({
            ok: true,
            producto: productoDB
        });

    });

});


//====================================
// Actualizar un producto 
//====================================
app.put('/producto/:id', (req, res) => {
    //grabar un usuario
    //grabar una categoria del listado
    let id = req.params.id;
    let body = req.body;


    //let producto = new Producto();

    Producto.findById(id, (err, productoDB) => { //verificamos si el ID existe
        // si existe un error
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) { // si no existe un productoDB
            return res.status(400).json({
                ok: false,
                message: 'El ID del producto no xiste'
            });
        }

        // si eiste, se debe actualizar
        //caturamos la informacion del objeto
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {
            // si existe un error
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            // si todo sale bien
            res.json({
                ok: true,
                producto: productoGuardado
            });
        });

    });


});


//====================================
// Borrar un producto 
//====================================
app.delete('/producto/:id', (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        // si existe un error
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        // si existe un error
        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                message: 'EL producto no existe'
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {
            // si existe un error
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'Producto Borrado'
            });
        });

    })


});

module.exports = app;