const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',       // Servidor local
    user: 'root',            // Usuario de MySQL
    password: '',            // Contraseña 
    database: 'crud-php-app' // Nombre de la base de datos
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos');
    }
});

module.exports = db;

