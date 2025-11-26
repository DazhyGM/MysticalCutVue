const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const {
    registerUser,
    getProfile,
    getUsers,
    getUserById,
    updateUser,
    updateUserStatus,
    deleteUser,
    getInactiveUsers,
    forgotPassword,
    resetPassword,
    getBarbers,
    getUserByEmail,
    filterUsersByRole,
    deleteAccount,
    activateUser,
    getUserByDocument
} = require('../models/userModel');

class UserController {

    async registerUser(req, res) {
    try {
        const {
            full_name,
            user_email,
            user_password,
            document_number,
            type_document_id,
            address,
            phone
        } = req.body;

        // Validaciones obligatorias
        if (!type_document_id) return res.status(400).json({ message: 'Por favor selecciona el tipo de documento.' });
        if (!full_name || full_name.trim() === '') return res.status(400).json({ message: 'El nombre completo es obligatorio.' });
        if (!user_email || user_email.trim() === '') return res.status(400).json({ message: 'El correo electrónico es obligatorio.' });
        if (!user_password || user_password.trim() === '') return res.status(400).json({ message: 'La contraseña es obligatoria.' });
        if (!document_number || document_number.trim() === '') return res.status(400).json({ message: 'El número de documento es obligatorio.' });
        if (!address || address.trim() === '') return res.status(400).json({ message: 'La dirección es obligatoria.' });
        if (!phone || phone.trim() === '') return res.status(400).json({ message: 'El teléfono es obligatorio.' });
        if (!/^\d+$/.test(phone.trim())) return res.status(400).json({ message: 'El teléfono solo debe contener números.' });


        // Validar formato de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user_email)) {
            return res.status(400).json({ message: 'El correo electrónico no tiene un formato válido.' });
        }

        // Validar que el documento solo tenga números
        if (!/^\d+$/.test(document_number.trim())) {
            return res.status(400).json({ message: 'El número de documento solo debe contener números.' });
        }

        // Validar seguridad de la contraseña
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(user_password)) {
            return res.status(400).json({
                message: 'La contraseña debe tener mínimo 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un símbolo.'
            });
        }

        // Validar si ya existe un usuario con esa cédula
        const existingUser = await getUserByDocument(document_number);
        if (existingUser) {
            return res.status(400).json({ message: 'Ya existe un usuario registrado con esta cédula.' });
        }

        // Validar si ya existe un usuario con ese correo
        const existingEmail = await getUserByEmail(user_email);
        if (existingEmail) {
            return res.status(400).json({ message: 'Ya existe un usuario registrado con este correo.' });
        }

        // Registrar usuario si todo está correcto
        await registerUser(req.body);
        res.status(201).json({ message: '✅ Usuario creado correctamente' });

    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
    }
}

    async loginUser(req, res) {
        const { email, password } = req.body;

        try {
            const user = await getUserByEmail(email);
            if (!user) {
                return res.status(401).json({ error: 'Usuario no encontrado' });
            }

            if (user.userStatus_fk === 4) {
                return res.status(403).json({ error: 'Cuenta eliminada, no puedes acceder' });
            }

            if (user.userStatus_fk === 2) {
                return res.status(403).json({ error: 'Cuenta bloqueada, no puedes acceder' });
            }

            const passwordMatch = await bcrypt.compare(password, user.user_password);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Credenciales incorrectas' });
            }

            if (user.userStatus_fk === 3) {
                await activateUser(user.user_id);
            }

            const token = jwt.sign(
                { id: user.user_id, role: user.role_name },
                process.env.JWT_SECRET,
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

        } catch (error) {
            res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
        }
    }

    async getProfile(req, res) {
        try {
            const result = await getProfile(req.user.id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el perfil', error });
        }
    }

    async getUsers(req, res) {
        try { 
            //Intenta ejecutar la función getUsers() que viene del modelo (base de datos) 
            // Esta función realiza la consulta SQL y devuelve los resultados
            const result = await getUsers(); // Espera a que la promesa se resuelva

            // ✅ Si todo va bien, devuelve los resultados con un estado 200 (OK)
            res.status(200).json(result);

        } catch (error) {
            // ❌ Si ocurre un error (por ejemplo, falla la conexión o la consulta), captura la excepcion y responde con estado 500 (Error del servidor)
            res.status(500).json({
                message: 'Error al obtener los usuarios', // Mensaje
                error // Detalles del error para depuración
            });
        }
    }

    async getUserById(req, res) {
        try {
            const result = await getUserById(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el usuario por ID', error });
        }
    }

    async updateUser(req, res) {
        try {
            await updateUser(req.params.id, req.body);
            res.status(200).json({ message: '✅ Usuario actualizado correctamente' });
        } catch (error) {
            console.error('Error al actualizar usuario:', error.message);
            if (error.message === 'Usuario no encontrado') {
                res.status(404).json({ message: 'Usuario no encontrado' });
            } else {
                res.status(500).json({ message: 'Error al actualizar usuario' });
            }
        }
    }

    async updateUserStatus(req, res) {
        try {
            await updateUserStatus(req.params.id, req.body.userStatus_fk);
            res.status(200).json({ message: `Estado del usuario actualizado a ${req.body.userStatus_fk}` });

        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el estado del usuario', error });
        }
    }

    async deleteUser(req, res) {
        try {
            const result = await deleteUser(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el usuario', error });
        }
    }

    async getInactiveUsers(req, res) {
        try {
            const result = await getInactiveUsers();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error al buscar los usuarios inactivos', error });
        }
    }

    async forgotPassword(req, res) {
        const { email } = req.body;
        try {
            const user = await getUserByEmail(email);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const expires = Date.now() + 3600000;

            console.log('Token:', token);
            console.log('Expires:', expires);

            try {
                await forgotPassword(user.user_email, token, expires);
            } catch (dbError) {
                console.error('Error actualizando reset_token en DB:', dbError);
                return res.status(500).json({ message: 'Error al actualizar token en base de datos', error: dbError });
            }

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const resetLink = `http://localhost:8080/reset-password/${token}`;
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.user_email,
                subject: 'Recuperación de contraseña',
                html: `<p>Bienvenido a Mystical Cut 💈💥</p>
                    <p>Haz clic en el siguiente enlace para restablecer tu contraseña 😉:</p>
                    <a href="${resetLink}">${resetLink}</a>
                    <p>Ingresa al enlace lo más pronto posible y restablece tu contraseña, este expirará en 1 hora 😱🏃‍♂️.</p>`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).json({ message: 'Error al enviar correo', error });
                }
                res.status(200).json({ message: 'Correo de recuperación enviado' });
            });
        } catch (error) {
            console.error('Error general en forgotPassword:', error);
            res.status(500).json({ message: 'Error en la recuperación de contraseña', error });
        }
    }

    async resetPassword(req, res) {
        const { token, newPassword } = req.body;

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const result = await resetPassword(userId, hashedPassword);

            res.status(200).json(result);
        } catch (error) {
            console.error('Error en resetPassword:', error);
            res.status(500).json({ message: 'Error al restablecer la contraseña', error: error.message });
        }
    }

    async showResetPasswordForm(req, res) {
        const { token } = req.params;
        try {
            jwt.verify(token, process.env.JWT_SECRET);
            res.status(200).json({ message: 'Token válido' });
        } catch (error) {
            res.status(500).json({ message: 'Token inválido o expirado', error });
        }
    }

    async getBarbers(req, res) {
        try {
            const result = await getBarbers();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los barberos', error });
        }
    }

    async getUserByEmail(req, res) {
        try {
            const result = await getUserByEmail(req.params.email);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el usuario', error });
        }
    }

    async filterUsersByRole(req, res) {
        try {
            const result = await filterUsersByRole(req.params.role);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error al filtrar los usuarios por rol', error });
        }
    }

    async deleteAccount(req, res) {
        try {
            const result = await deleteAccount(req.user.id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar la cuenta', error });
        }
    }
}

module.exports = new UserController();
