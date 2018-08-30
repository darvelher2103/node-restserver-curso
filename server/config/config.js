//Archivo de configuracion que me permite de manera transparente cambiar
//El estado de configuracion local a produccion, sin necesidad de modificar el 
//El archivo server.js (cambio de puerto)


//=====================
//puerto
//===================

process.env.PORT = process.env.PORT || 3000;