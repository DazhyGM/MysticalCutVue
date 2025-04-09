        const db = require('../config/db');
        const bcrypt = require('bcrypt');
        const jwt = require('jsonwebtoken');
        const JWT_SECRET = 'W9mX7Pq2fG8kY6NvB3rH4tL5zA1J0CDE';
        const nodemailer = require('nodemailer');
        const crypto = require('crypto');

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'kevinsabogal24@gmail.com', // Reemplaza con tus credenciales
                pass: 'wwqc rxvl xmqi mocs' // Usa variables de entorno en producción
            }
        });

        // 🔹 Registrar usuario
        exports.registerUser = async (req, res) => {
            const { full_name, user_email, user_password, document_number, type_document_id, address, phone, role_fk } = req.body;
            try {
                const hashedPassword = await bcrypt.hash(user_password, 10);
                const query = 'INSERT INTO user (full_name, user_email, user_password, document_number, type_document_id, address, phone,  role_fk, userStatus_fk) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)';
                db.query(query, [full_name, user_email, hashedPassword, document_number, type_document_id, address, phone, role_fk], (err, result) => {
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
            const query = `SELECT user.*, role.role_name 
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

                // Verificar si el usuario está bloqueado antes de validar la contraseña
                if (user.userStatus_fk === 2) {
                    return res.status(403).json({ error: 'Este usuario está bloqueado. Contacta al administrador.' });
                }

                if (!user.user_password) {
                    return res.status(500).json({ error: 'Error interno: contraseña no encontrada.' });
                }

                const passwordMatch = await bcrypt.compare(password, user.user_password);

                if (!passwordMatch) {
                    return res.status(401).json({ error: 'Credenciales incorrectas. Verifica tu correo y contraseña.' });
                }

                // Si el estado del usuario es 'inactivo', lo activamos automáticamente cuando el usuario inicie sesion
                if (user.userStatus_fk === 3) { // 3 = Inactivo
                    const updateQuery = 'UPDATE user SET userStatus_fk = 1 WHERE user_id = ?';
                    db.query(updateQuery, [user.user_id], (err, result) => {
                        if (err) {
                            console.error("Error al actualizar el estado del usuario:", err);
                            return res.status(500).json({ error: 'Error al activar el usuario' });
                        }
                    });
                }

                const token = jwt.sign(
                    { id: user.user_id, role: user.role_name },
                    JWT_SECRET,
                    { expiresIn: '1h' }
                );

                res.json({ 
                    message: 'Inicio de sesión exitoso', 
                    token, 
                    user: {
                        full_name: user.full_name,
                        email: user.user_email,
                        role: user.role_name
                    }
                });
            });
        };




        // 🔹 Obtener los datos del usuario logueado

        exports.getProfile = (req, res) => {
            const userId = req.user.id;
            const query = `
                SELECT 
                    u.user_id,  
                    u.full_name, 
                    u.user_email, 
                    u.document_number, 
                    dt.doctype_name AS type_document,
                    u.address, 
                    u.phone,
                    r.role_name AS role
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

                console.log("Usuario obtenido:", results[0]);

                res.json(results[0]);
            });
        };


        // 🔹 Obtener todos los usuarios
        exports.getUsers = (req, res) => {
            // Consulta para obtener todos los usuarios
            const query = 'SELECT user_id, full_name, user_email, user_password, document_number, type_document_id, address, phone, role_fk, userStatus_fk FROM user WHERE userStatus_fk IN (1, 2);';
            
            db.query(query, (err, results) => {
                if (err) {
                    return res.status(500).json({ error: 'Error al obtener los usuarios' });
                }
                res.json(results);  // Devuelve todos los usuarios (activos y bloqueados)
            });
        };


        // 🔹 Obtener un solo usuario por ID
        exports.getUserById = (req, res) => {
            const { id } = req.params;
            const query = 'SELECT user_id, full_name, user_email, user_password, document_number, type_document_id, address, phone,  role_fk, userStatus_fk FROM user WHERE user_id = ?';
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
            let { full_name, user_email, user_password, role_fk, address, phone } = req.body;

            // Verificar si el ID es válido
            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'ID de usuario inválido' });
            }

            try {
                // Obtenemos los datos actuales del usuario
                const getUserQuery = 'SELECT full_name, user_email, role_fk, address, phone, user_password FROM user WHERE user_id = ?';
                db.query(getUserQuery, [id], async (err, results) => {
                    if (err) {
                        console.error('Error al obtener el usuario:', err);
                        return res.status(500).json({ error: 'Error al obtener el usuario' });
                    }
                    if (results.length === 0) {
                        return res.status(404).json({ error: 'Usuario no encontrado' });
                    }

                    const currentUser = results[0]; // Datos actuales del usuario

                    // Si no se envía un campo en la solicitud, usamos el valor actual
                    full_name = full_name || currentUser.full_name;
                    user_email = user_email || currentUser.user_email;
                    role_fk = role_fk || currentUser.role_fk;
                    address = address || currentUser.address;
                    phone = phone || currentUser.phone;
                    let newPassword = currentUser.user_password; // Por defecto, mantiene la misma contraseña

                    // Si el usuario envía una nueva contraseña, se encripta antes de actualizar
                    if (user_password) {
                        newPassword = await bcrypt.hash(user_password, 10);
                    }

                    // Se actualizan solo los campos permitidos
                    const updateQuery = 'UPDATE user SET full_name = ?, user_email = ?, user_password = ?, role_fk = ?, address = ?, phone = ? WHERE user_id = ?';
                    const values = [full_name, user_email, newPassword, role_fk, address, phone, id];

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

        // 🔹 Actualizar estado del usuario

        exports.updateUserStatus = (req, res) => {
            const { id } = req.params;
            const { userStatus_fk } = req.body; // Nuevo estado

            if (![1, 2].includes(userStatus_fk)) { // Solo Active (1) y Blocked (2)
                return res.status(400).json({ error: 'Estado inválido' });
            }

            const query = 'UPDATE user SET userStatus_fk = ? WHERE user_id = ?';
            db.query(query, [userStatus_fk, id], (err, result) => {
                if (err) {
                    console.error('Error al actualizar el estado del usuario:', err);
                    return res.status(500).json({ error: 'Error al actualizar el estado del usuario' });
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Usuario no encontrado' });
                }
                res.json({ message: `Estado del usuario actualizado a ${userStatus_fk}` });
            });
        };


        // 🔹 Eliminar usuario (cambio de estado a "3-Inactive" en lugar de eliminación física)

        exports.deleteUser = (req, res) => {
            const { id } = req.params;
            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'ID de usuario inválido' });
            }

            const query = 'UPDATE user SET userStatus_fk = 3 WHERE user_id = ?';  // Cambia el estado a inactivo
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

        // 🔹 Obtener solo los usuarios inactivos
        exports.getInactiveUsers = (req, res) => {
            const query = 'SELECT user_id, full_name, user_email, document_number, type_document_id, address, phone, role_fk, userStatus_fk FROM user WHERE userStatus_fk = 3';

            db.query(query, (err, results) => {
                if (err) {
                    return res.status(500).json({ error: 'Error al obtener los usuarios inactivos' });
                }
                res.json(results);  // Devuelve solo los usuarios inactivos
            });
        };

        //Recuperar contraseña
        exports.forgotPassword = (req, res) => {
            const { email } = req.body;

            const query = 'SELECT user_id FROM user WHERE user_email = ?';
            db.query(query, [email], (err, results) => {
                if (err) {
                    console.error('❌ Error en la consulta:', err);
                    return res.status(500).json({ error: 'Error en el servidor' });
                }
                if (results.length === 0) {
                    return res.status(404).json({ error: 'Correo no registrado' });
                }

                const userId = results[0].user_id;
                const token = crypto.randomBytes(32).toString('hex'); 
                const expires = Date.now() + 3600000; // Expira en 1 hora

                const insertQuery = 'UPDATE user SET reset_token = ?, reset_token_expires = ? WHERE user_id = ?';
                db.query(insertQuery, [token, expires, userId], (err) => {
                    if (err) {
                        console.error('❌ Error al guardar el token en la BD:', err);
                        return res.status(500).json({ error: 'Error al guardar el token' });
                    }

                    const resetLink = `http://localhost:8080/reset-password/${token}`;;
                    const mailOptions = {
                        from: 'kevinsabogal24@gmail.com',
                        to: email,
                        subject: 'Recuperación de contraseña',
                        html: `<p>Bienvenido a Mystical Cut 💈💥</p>
                                <p>Haz clic en el siguiente enlace para restablecer tu contraseña 😉:</p>
                            <a href="${resetLink}">${resetLink}</a>
                            <p>Ingresa al enlace lo mas pronto posible y restablece tu contraseña, este expirara en 1 hora 😱🏃‍♂️.</p>`
                    };

                    transporter.sendMail(mailOptions, (err) => {
                        if (err) {
                            console.error('❌ Error al enviar el correo:', err);
                            return res.status(500).json({ error: 'Error al enviar el correo' });
                        }
                        console.log('✅ Correo enviado con éxito a:', email);
                        res.json({ message: 'Correo enviado con éxito' });
                    });
                });
            });
        };



        //Metodo para la nueva contraseña
        exports.resetPassword = async (req, res) => {
            const { token, newPassword } = req.body;

            const query = 'SELECT user_id FROM user WHERE reset_token = ? AND reset_token_expires > ?';
            db.query(query, [token, Date.now()], async (err, results) => {
                if (err) return res.status(500).json({ error: 'Error en el servidor' });
                if (results.length === 0) return res.status(400).json({ error: 'Token inválido o expirado' });

                const userId = results[0].user_id;
                const hashedPassword = await bcrypt.hash(newPassword, 10);

                const updateQuery = 'UPDATE user SET user_password = ?, reset_token = NULL, reset_token_expires = NULL WHERE user_id = ?';
                db.query(updateQuery, [hashedPassword, userId], (err) => {
                    if (err) return res.status(500).json({ error: 'Error al actualizar la contraseña' });
                    res.json({ message: 'Contraseña actualizada correctamente' });
                });
            });
        };

        exports.showResetPasswordForm = async (req, res) => {
            try {
                const { token } = req.params;
                // Verificar si el token es válido en la base de datos
                const user = await User.findOne({ where: { reset_token: token } });

                if (!user) {
                    return res.status(400).json({ message: "Token inválido o expirado." });
                }

                // Si el token es válido, redirige a la vista de cambio de contraseña en el frontend
                res.redirect(`http://localhost:8080/reset-password/${token}`);
            } catch (error) {
                console.error("Error en showResetPasswordForm:", error);
                res.status(500).json({ message: "Error en el servidor" });
            }
        };
        




