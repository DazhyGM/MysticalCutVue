const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Registrar usuario
exports.registerUser = async (req, res) => {
    const { full_name, user_email, user_password, role_fk } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(user_password, 10);
        const query = 'INSERT INTO user (full_name, user_email, user_password, role_fk, userStatus_fk) VALUES (?, ?, ?, ?, 1)';
        db.query(query, [full_name, user_email, hashedPassword, role_fk], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error al registrar el usuario' });
            }
            res.status(201).json({ message: 'Usuario registrado correctamente' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al encriptar la contraseña' });
    }
};

// Iniciar sesión
exports.loginUser = (req, res) => {
    const { user_email, user_password } = req.body;
    const query = 'SELECT * FROM user WHERE user_email = ?';

    db.query(query, [user_email], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(user_password, user.user_password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user.user_id, role: user.role_fk }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Inicio de sesión exitoso', token });
    });
};

// Obtener todos los usuarios
exports.getUsers = (req, res) => {
    const query = 'SELECT user_id, full_name, user_email, role_fk FROM user WHERE userStatus_fk = 1';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los usuarios' });
        }
        res.json(results);
    });
};

// Obtener un solo usuario por ID
exports.getUserById = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT user_id, full_name, user_email, role_fk FROM user WHERE user_id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener el usuario' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(result[0]);
    });
};

// Actualizar usuario
exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { full_name, user_email, role_fk } = req.body;
    const query = 'UPDATE user SET full_name = ?, user_email = ?, role_fk = ? WHERE user_id = ?';

    db.query(query, [full_name, user_email, role_fk, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar el usuario' });
        }
        res.json({ message: 'Usuario actualizado correctamente' });
    });
};

// Eliminar usuario (cambio de estado en lugar de eliminación física)
exports.deleteUser = (req, res) => {
    const { id } = req.params;
    const query = 'UPDATE user SET userStatus_fk = 0 WHERE user_id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar el usuario' });
        }
        res.json({ message: 'Usuario eliminado correctamente' });
    });
};
