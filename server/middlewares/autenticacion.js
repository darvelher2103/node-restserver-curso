// comprobamos que el toke sea valido

const jwt = require('jsonwebtoken');


// ===================
// Verifica Token 
// ==================

//next permite que siga ejecutando la funcion
let verificaToken = (req, res, next) => {

    let token = req.get('token'); // obtiene los headers
    // verify verifca la informacion del token
    jwt.verify(token, process.env.SEED, (err, decoded) => { //decoded contiene la informacion del usuario
        if (err) {
            return res.status(401).json({ //error no autorizado
                ok: false,
                err: {
                    message: "Token no válido"
                }
            });
        }

        //hacemos que cualquier peticion tenga acceso a los usuarios
        // con solo pasar por el verificar token
        req.usuario = decoded.usuario;
        //console.log(req.usuario);
        next(); // para que continue

    });

    /*
    res.json({
        token: token
    });
    */
};

// ===================
// Verifica adminRole req(solicitud) - res(respuesta) -  next(Continua con la ejecucion del programa)
// ==================

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role == 'ADMIN_ROLE') {
        next(); // continua la ejecucion del programa
    } else {
        res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

}


// ===================
// Verifica token para imagen
// ==================

let verificaTokenImg = (req, res, next) => {
    let token = req.query.token; //obtiene el token por url
    /*res.json({
        token
    })*/

    // verify verifca la informacion del token
    jwt.verify(token, process.env.SEED, (err, decoded) => { //decoded contiene la informacion del usuario
        if (err) {
            return res.status(401).json({ //error no autorizado
                ok: false,
                err: {
                    message: "Token no válido"
                }
            });
        }

        //hacemos que cualquier peticion tenga acceso a los usuarios
        // con solo pasar por el verificar token
        req.usuario = decoded.usuario;
        //console.log(req.usuario);
        next(); // para que continue

    });

}

module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}