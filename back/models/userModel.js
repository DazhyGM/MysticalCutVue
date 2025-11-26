const db = require('../config/db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// 🔹 Registrar usuario
exports.registerUser = async (userData) => {
    const { full_name, user_email, user_password, document_number, type_document_id, address, phone, role_fk } = userData;
    try {
        const hashedPassword = await bcrypt.hash(user_password, 10);
        const query = 'INSERT INTO user (full_name, user_email, user_password, document_number, type_document_id, address, phone, role_fk, userStatus_fk) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)';
        return new Promise((resolve, reject) => {
            db.query(query, [full_name, user_email, hashedPassword, document_number, type_document_id, address, phone, role_fk], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    } catch (error) {
        throw new Error('Error al encriptar la contraseña');
    }
};

// 🔹 Iniciar sesión y Obtener usuario por correo electrónico
exports.getUserByEmail = (email) => {
    const query = `
        SELECT 
            user.*, 
            role.role_name 
        FROM user 
        JOIN role ON user.role_fk = role.role_id 
        WHERE user_email = ?
    `;

    return new Promise((resolve, reject) => {
        db.query(query, [email], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return resolve(null);
            resolve(results[0]);
        });
    });
};


// 🔹 Obtener el perfil del usuario
exports.getProfile = (userId) => {
    const query = `
        SELECT u.user_id, u.full_name, u.user_email, u.document_number, dt.doctype_name AS type_document, 
               u.address, u.phone, r.role_name AS role
        FROM user u
        LEFT JOIN document_type dt ON u.type_document_id = dt.id_doctypes
        LEFT JOIN role r ON u.role_fk = r.role_id
        WHERE u.user_id = ?
    `;
    return new Promise((resolve, reject) => {
        db.query(query, [userId], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject(new Error('Usuario no encontrado'));
            resolve(results[0]);
        });
    });
};

// 🔹 Obtener todos los usuarios
exports.getUsers = () => {
    const query = 'SELECT user_id, full_name, user_email, user_password, document_number, type_document_id, address, phone, role_fk, userStatus_fk FROM user WHERE userStatus_fk IN (1, 2, 4);';
    return new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// 🔹 Obtener un usuario por ID
exports.getUserById = (id) => {
    const query = `
        SELECT 
            user.user_id, 
            user.full_name, 
            user.user_email, 
            user.user_password, 
            user.document_number, 
            user.type_document_id, 
            user.address, 
            user.phone, 
            user.role_fk, 
            user.userStatus_fk,
            userStatus.userStatus_name 
        FROM user 
        JOIN userStatus ON user.userStatus_fk = userStatus.userStatus_id
        WHERE user.user_id = ?
    `;
    return new Promise((resolve, reject) => {
        db.query(query, [id], (err, result) => {
            if (err) return reject(err);
            if (result.length === 0) return reject(new Error('Usuario no encontrado'));
            resolve(result[0]);
        });
    });
};


// 🔹 Actualizar usuario
exports.updateUser = async (id, userData) => {
    const currentUser = await module.exports.getUserById(id); // Asegúrate de usar `module.exports`

    // Actualizamos solo si los valores están definidos y no vacíos
    const full_name = userData.full_name?.trim() || currentUser.full_name;
    const user_email = userData.user_email?.trim() || currentUser.user_email;
    const role_fk = userData.role_fk ?? currentUser.role_fk;
    const address = userData.address?.trim() || currentUser.address;
    const phone = userData.phone?.trim() || currentUser.phone;

    // Lógica para la contraseña
    const newPassword = userData.user_password
        ? await bcrypt.hash(userData.user_password, 10)
        : currentUser.user_password;

    const updateQuery = `
        UPDATE user 
        SET full_name = ?, user_email = ?, user_password = ?, role_fk = ?, address = ?, phone = ?
        WHERE user_id = ?
    `;

    return new Promise((resolve, reject) => {
        db.query(
            updateQuery,
            [full_name, user_email, newPassword, role_fk, address, phone, id],
            (err, result) => {
                if (err) return reject(err);
                if (result.affectedRows === 0) return reject(new Error('Usuario no encontrado'));
                resolve(result);
            }
        );
    });
};


// 🔹 Actualizar estado del usuario
exports.updateUserStatus = (id, userStatus_fk) => {
    const query = 'UPDATE user SET userStatus_fk = ? WHERE user_id = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [userStatus_fk, id], (err, result) => {
            if (err) return reject(err);
            if (result.affectedRows === 0) return reject(new Error('Usuario no encontrado'));
            resolve(result);
        });
    });
};

exports.activateUser = (userId) => {
    const query = `UPDATE user SET userStatus_fk = 1 WHERE user_id = ?`;
    return new Promise((resolve, reject) => {
        db.query(query, [userId], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};


// 🔹 Eliminar usuario (cambio de estado a "Inactivo")
exports.deleteUser = (id) => {
    const query = 'UPDATE user SET userStatus_fk = 3 WHERE user_id = ?';  // Cambia el estado a inactivo
    return new Promise((resolve, reject) => {
        db.query(query, [id], (err, result) => {
            if (err) return reject(err);
            if (result.affectedRows === 0) return reject(new Error('Usuario no encontrado'));
            resolve(result);
        });
    });
};

// 🔹 Obtener solo los usuarios inactivos
exports.getInactiveUsers = () => {
    const query = 'SELECT user_id, full_name, user_email, document_number, type_document_id, address, phone, role_fk, userStatus_fk FROM user WHERE userStatus_fk = 3';
    return new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// 🔹 Recuperar contraseña
exports.forgotPassword = (email, token, expires) => {
    const query = 'UPDATE user SET reset_token = ?, reset_token_expires = ? WHERE user_email = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [token, expires, email], (err, result) => {
            if (err) return reject(err);
            if (result.affectedRows === 0) return reject(new Error('Correo no encontrado'));
            resolve();
        });
    });
};


// 🔹 Actualizar contraseña
exports.resetPassword = (userId, hashedPassword) => {
    const updateQuery = 'UPDATE user SET user_password = ?, reset_token = NULL, reset_token_expires = NULL WHERE user_id = ?';
    return new Promise((resolve, reject) => {
        db.query(updateQuery, [hashedPassword, userId], (err) => {
            if (err) return reject(err);
            resolve({ message: 'Contraseña actualizada correctamente' });
        });
    });
};


// 🔹 Obtener solo los barberos activos
exports.getBarbers = () => {
    const query = 'SELECT user_id, full_name, profile_image, user_email, phone, address, role_fk FROM user WHERE role_fk = 2 AND userStatus_fk = 1';
    return new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};



// 🔹 Filtrar usuarios por rol
exports.filterUsersByRole = (roleId) => {
    const query = 'SELECT * FROM user WHERE role_fk = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [roleId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// 🔹 Eliminar cuenta del usuario
exports.deleteAccount = (userId) => {
    const query = 'UPDATE user SET userStatus_fk = 4 WHERE user_id = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [userId], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// 🔹 Verificar si ya existe una cédula registrada
exports.getUserByDocument = (document_number) => {
    const query = 'SELECT * FROM user WHERE document_number = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [document_number], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return resolve(null);
            resolve(results[0]);
        });
    });
};

