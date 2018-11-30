const express = require('express'); //modulo express
const fs = require('fs'); //nos sirve para verificar si una imagen existe o no,, fileSystem

const { verificaTokenImg } = require('../middlewares/autenticacion');

const path = require('path');

let app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`); //ubicacion de la imagen

    //verificamos si existe el "pathImagen"
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        //debemos crear el path absoluto
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg'); // creamos el path absoluto 
        res.sendFile(noImagePath);
    }


});


module.exports = app;