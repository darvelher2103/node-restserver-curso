//Archivo de configuracion que me permite de manera transparente cambiar
//El estado de configuracion local a produccion, sin necesidad de modificar  
//El archivo server.js (cambio de puerto)


//=====================
//puerto
//===================

process.env.PORT = process.env.PORT || 3000;


//=====================
//Entorno
//===================
//si existe algo se que o estare corriendo en poduccion
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; //si esta variabe no existe me encuentro en el entorno desarrollo 

//=====================
//Base de Datos
//===================

let urlBD;

if (process.env.NODE_ENV === 'dev') {
    // si es igual a desarrollo le asignamos la cadena de conexion
    urlBD = 'mongodb://localhost:27017/cafe';
} else {
    // cadena de conexion produccion
    urlBD = 'mongodb://cafe-user:D180714E@ds153552.mlab.com:53552/cafe';
}

process.env.URLDB = urlBD;