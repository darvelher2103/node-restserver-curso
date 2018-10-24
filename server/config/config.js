//Archivo de configuracion que me permite de manera transparente cambiar
//El estado de configuracion local a produccion, sin necesidad de modificar  
//El archivo server.js (cambio de puerto)

//Aqui definimos las variables de configuracion

//=====================
// puerto
//===================

process.env.PORT = process.env.PORT || 3000;


//=====================
// Entorno
//===================
//si existe algo se que estare corriendo en produccion
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; //si esta variabe no existe me encuentro en el entorno desarrollo 

//=====================
// Vencimiento del token
//===================
// 60 segundos 
// 60 minutos
// 24 horas 
// 30 dias 
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//=====================
// SEED de autenticación o cemilla
//===================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';
//configuramos variable de entorno en heroku llamada SEED
//para no permitir ver las credenciales de la cemilla en git 

//=====================
//Base de Datos
//===================

let urlBD;

if (process.env.NODE_ENV === 'dev') {
    // si es igual a desarrollo le asignamos la cadena de conexion
    urlBD = 'mongodb://localhost:27017/cafe';
} else {
    // cadena de conexion produccion
    urlBD = process.env.DATABASE_URI;
}

process.env.URLDB = urlBD;