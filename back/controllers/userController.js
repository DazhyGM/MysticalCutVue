const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 🔥 Definir JWT_SECRET directamente en este archivo
const JWT_SECRET = 'W9mX7Pq2fG8kY6NvB3rH4tL5zA1J0CDE';

// 🔹 Registrar usuario
exports.registerUser = async (req, res) => {
    const { full_name, user_email, user_password, document_number, type_document_id, address, role_fk } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(user_password, 10);
        const query = 'INSERT INTO user (full_name, user_email, user_password, document_number, type_document_id, address,  role_fk, userStatus_fk) VALUES (?, ?, ?, ?, ?, ?, ?, 1)';
        db.query(query, [full_name, user_email, hashedPassword, document_number, type_document_id, address, role_fk], (err, result) => {
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
    const { email, password } = req.body;
    const query = `
        SELECT user.*, role.role_name 
        FROM user 
        JOIN role ON user.role_fk = role.role_id 
        WHERE user_email = ?`;

    db.query(query, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const user = results[0];

        if (!user.user_password) {
            return res.status(500).json({ error: 'Error interno: contraseña no encontrada.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.user_password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { id: user.user_id, role: user.role_name }, // 🔹 Ahora usamos el nombre del rol
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // 🔹 Devolver el nombre del rol en la respuesta
        res.json({ 
            message: 'Inicio de sesión exitoso', 
            token, 
            user: {
                full_name: user.full_name,
                email: user.user_email,
                role: user.role_name // 🔹 Ahora devuelve el nombre del rol
            }
        });
    });
};


// Obtener el usuario logueado

exports.getProfile = (req, res) => {
    const userId = req.user.id; // 🔹 ID del usuario desde el token

    const query = `
        SELECT 
            u.full_name, 
            u.user_email, 
            u.document_number, 
            dt.doctype_name AS type_document,  -- 🔹 Obtener el nombre del tipo de documento
            u.address, 
            r.role_name AS role  -- 🔹 Obtener el nombre del rol
        FROM user u
        LEFT JOIN document_type dt ON u.type_document_id = dt.id_doctypes
        LEFT JOIN role r ON u.role_fk = r.role_id
        WHERE u.user_id = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Error en la consulta:", err);
            return res.status(500).json({ error: 'Error al obtener el perfil del usuario' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        console.log("Usuario obtenido:", results[0]); // 🔹 Verificar datos en consola

        res.json(results[0]); // Retornar el usuario con los nombres correctos
    });
};







// 🔹 Obtener todos los usuarios
exports.getUsers = (req, res) => {
    const query = 'SELECT user_id, full_name, user_email, user_password, document_number, type_document_id, address,  role_fk, userStatus_fk FROM user WHERE userStatus_fk = 1';
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
    const query = 'SELECT user_id, full_name, user_email, user_password, document_number, type_document_id, address,  role_fk, userStatus_fk FROM user WHERE user_id = ?';
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
    let { full_name, user_email, user_password, role_fk, address } = req.body;

    // Verificar si el ID es válido
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    try {
        // 1️⃣ Primero obtenemos los datos actuales del usuario
        const getUserQuery = 'SELECT full_name, user_email, role_fk, address, user_password FROM user WHERE user_id = ?';
        db.query(getUserQuery, [id], async (err, results) => {
            if (err) {
                console.error('Error al obtener el usuario:', err);
                return res.status(500).json({ error: 'Error al obtener el usuario' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            const currentUser = results[0]; // Datos actuales del usuario

            // 2️⃣ Si no se envía un campo en la solicitud, usamos el valor actual
            full_name = full_name || currentUser.full_name;
            user_email = user_email || currentUser.user_email;
            role_fk = role_fk || currentUser.role_fk;
            address = address || currentUser.address;
            let newPassword = currentUser.user_password; // Por defecto, mantiene la misma contraseña

            // 3️⃣ Si el usuario envía una nueva contraseña, la encriptamos antes de actualizar
            if (user_password) {
                newPassword = await bcrypt.hash(user_password, 10);
            }

            // 4️⃣ Ahora actualizamos solo los campos permitidos
            const updateQuery = 'UPDATE user SET full_name = ?, user_email = ?, user_password = ?, role_fk = ?, address = ? WHERE user_id = ?';
            const values = [full_name, user_email, newPassword, role_fk, address, id];

            db.query(updateQuery, values, (err, result) => {
                if (err) {
                    console.error('Error al actualizar el usuario:', err);
                    return res.status(500).json({ error: 'Error al actualizar el usuario' });
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Usuario no encontrado' });
                }
                res.json({ message: 'Usuario actualizado correctamente' });
            });
        });

    } catch (error) {
        console.error('Error en la actualización:', error);
        res.status(500).json({ error: 'Error al procesar la actualización' });
    }
};

// Actualizar estado del usuario
exports.updateUserStatus = (req, res) => {
    const { id } = req.params;
    const { userStatus_fk } = req.body; // Recibimos el nuevo estado

    // Verificar si el ID es válido
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    // Verificar si el estado es válido (1 = activo, 2 = bloqueado, 3 = inactivo)
    if (![1, 2, 3].includes(userStatus_fk)) {
        return res.status(400).json({ error: 'Estado inválido' });
    }

    const query = 'UPDATE user SET userStatus_fk = ? WHERE user_id = ?';
    db.query(query, [userStatus_fk, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el estado del usuario:', err);
            return res.status(500).json({ error: 'Error al actualizar el estado del usuario' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado o ya tiene ese estado' });
        }
        res.json({ message: `Estado del usuario actualizado a ${userStatus_fk}` });
    });
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


