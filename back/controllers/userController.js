const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 🔥 Definir JWT_SECRET directamente en este archivo
const JWT_SECRET = 'W9mX7Pq2fG8kY6NvB3rH4tL5zA1J0CDE';

// 🔹 Registrar usuario
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

// 🔹 Iniciar sesión
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

        console.log('Valor de JWT_SECRET:', JWT_SECRET);  // 🔥 Verifica el valor en la terminal

        if (!JWT_SECRET) {
            return res.status(500).json({ error: 'JWT_SECRET no está definido' });
        }

        const token = jwt.sign({ id: user.user_id, role: user.role_fk }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Inicio de sesión exitoso', token });
    });
};

// 🔹 Obtener todos los usuarios
exports.getUsers = (req, res) => {
    const query = 'SELECT user_id, full_name, user_email, role_fk FROM user WHERE userStatus_fk = 1';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los usuarios' });
        }
        res.json(results);
    });
};

// 🔹 Obtener un solo usuario por ID
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

// 🔹 Actualizar usuario

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    let { full_name, user_email, user_password, role_fk } = req.body;

    // Verificar si el ID es válido
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    try {
        let query;
        let values;

        // Si se proporciona una nueva contraseña, la encripta antes de actualizar
        if (user_password) {
            const hashedPassword = await bcrypt.hash(user_password, 10);
            query = 'UPDATE user SET full_name = ?, user_email = ?, user_password = ?, role_fk = ? WHERE user_id = ?';
            values = [full_name, user_email, hashedPassword, role_fk, id];
        } else {
            // Si no hay contraseña nueva, actualiza sin modificarla
            query = 'UPDATE user SET full_name = ?, user_email = ?, role_fk = ? WHERE user_id = ?';
            values = [full_name, user_email, role_fk, id];
        }

        db.query(query, values, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al actualizar el usuario' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.json({ message: 'Usuario actualizado correctamente' });
        });

    } catch (error) {
        res.status(500).json({ error: 'Error al procesar la actualización' });
    }
};


// 🔹 Eliminar usuario (cambio de estado en lugar de eliminación física)
exports.deleteUser = (req, res) => {
    const { id } = req.params;
    
    // Verificar si el ID es válido
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    const query = 'UPDATE user SET userStatus_fk = 3 WHERE user_id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al cambiar el estado del usuario' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario marcado como inactivo correctamente' });
    });
};


