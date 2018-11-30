const express = require('express');

const fileUpload = require('express-fileupload');

const app = express();

const Usuario = require('../models/usuario'); //acceso a las propiedades de un usuario

const Producto = require('../models/producto');

const fs = require('fs');

const path = require('path'); //npm install

// default options
app.use(fileUpload()); // Todos los archivos que aqui se carguen caen dentro del objeto llamado "req.files"

app.put('/upload/:tipo/:id', function(req, res) {

    // Capturamos los datos
    let tipo = req.params.tipo;
    let id = req.params.id;

    //si no hay archivos
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    // Valida tipo
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        //no encontro ninguno..
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(', '),
            }
        });
    }

    //Nombre que se le asigna al input "archivo"
    let archivo = req.files.archivo;

    // Validar la extensión del archivo
    let extensionesValidas = ['png', 'jpg', 'git', 'jpeg'];
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    //console.log(extension); //imprimimos en la consola
    //return;//para no continuar ejecutando el codigo

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({ //validamos las extensiones que solo se pueden guardar
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    }

    //Cambiar nombre al archivo
    //1234567890-123.jpg -> construimos el nombre del archivo debe ser unico
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`; //para prevenir la cache en el navegador 

    //Podemos mover los archivos al directorio deseado en este caso en la carpeta uploads 
    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });


        //Aqui, imagen cargada

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo); //pasamos el "res" para poderlo usar
        } else {
            imagenProducto(id, res, nombreArchivo);
        }

    });

});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => { //Buscamos el usuario

        //verificamos si un error
        if (err) {

            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        // verificamos si no existe el usuario
        if (!usuarioDB) {

            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Usuario no existe'
                }
            });
        }

        //confirmamos que el path de la imagen exista usando el fileSystem fs
        //Es decir, verificamos que la ruta exista
        borraArchivo(usuarioDB.img, 'usuarios');

        //Si existe - actualizamos la imagen
        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                Usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });

    });
}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => { //Buscamos el producto

        //verificamos si un error
        if (err) {

            borraArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        // verificamos si no existe el producto
        if (!productoDB) {

            borraArchivo(nombreArchivo, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Producto no existe'
                }
            });
        }

        //confirmamos que el path de la imagen exista usando el fileSystem fs
        //Es decir, verificamos que la ruta exista..
        borraArchivo(productoDB.img, 'productos');

        //Si existe - actualizamos la imagen
        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });

    });

}

function borraArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);

    if (fs.existsSync(pathImagen)) {
        //Retorna true o false
        fs.unlinkSync(pathImagen);
    }

}

module.exports = app; //para poderlo usuar en otros archivos