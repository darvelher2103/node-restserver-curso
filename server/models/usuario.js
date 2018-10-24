const mongoose = require('mongoose');
//cargamos el plugin
const uniqueValidator = require('mongoose-unique-validator');

//definimos los roles para poderlos validar 
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un role válido'
}

let Schema = mongoose.Schema;

//definimos el esquema

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es requerido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos //validamos los roles
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: { //si el usuario no se crea con esta prop sera normal y estara por defecto en false
        type: Boolean,
        default: false
    }
});

// modificamos cuando se imprima en un toJson el usuarioSchema 
// para que no muestre la propiedad password
// quitamos el password cada vez que el objeto quiera pasarse a un JSON
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

// le decimos al Schema que use el plugin
// mongoose inyecta el mensaje de error por nosotros con la estructura por defecto
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
module.exports = mongoose.model('Usuario', usuarioSchema);