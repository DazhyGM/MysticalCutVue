const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para autenticación y gestión de usuarios
 */

/**
 * @swagger
 * /api/users/users/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 */
router.post('/users/register', userController.registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 */
router.post('/login', userController.loginUser);

/**
 * @swagger
 * /api/users/forgot-password:
 *   post:
 *     summary: Enviar email para restablecer contraseña
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email de restablecimiento enviado
 */
router.post('/forgot-password', userController.forgotPassword);

/**
 * @swagger
 * /api/users/reset-password:
 *   post:
 *     summary: Restablecer contraseña
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña restablecida
 */
router.post('/reset-password', userController.resetPassword);

/**
 * @swagger
 * /api/users/reset-password/{token}:
 *   get:
 *     summary: Mostrar formulario de restablecimiento de contraseña
 *     tags: [Usuarios]
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Formulario mostrado
 */
router.get('/reset-password/:token', userController.showResetPasswordForm);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido
 */
router.get('/profile',authenticate, userController.getProfile);

/**
 * @swagger
 * /api/users/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get('/users', authenticate, userController.getUsers);

/**
 * @swagger
 * /api/users/users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario obtenido
 */
router.get('/users/:id', authenticate, userController.getUserById);

/**
 * @swagger
 * /api/users/inactives:
 *   get:
 *     summary: Obtener usuarios inactivos
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios inactivos
 */
router.get('/inactives',authenticate, userController.getInactiveUsers);

/**
 * @swagger
 * /api/users/users/{id}:
 *   put:
 *     summary: Actualizar información de usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Usuario actualizado
 */
router.put('/users/:id',authenticate, userController.updateUser);

/**
 * @swagger
 * /api/users/users/status/{id}:
 *   put:
 *     summary: Cambiar estado (activo/inactivo) de usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Estado del usuario actualizado
 */
router.put('/users/status/:id', authenticate, userController.updateUserStatus);

/**
 * @swagger
 * /api/users/users/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado
 */userController
router.delete('/users/:id', authenticate, userController.deleteUser);

/**
 * @swagger
 * /api/users/barbers:
 *   get:
 *     summary: Obtener todos los barberos
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de barberos
 */
router.get('/barbers', authenticate, userController.getBarbers);

/**
 * @swagger
 * /api/users/profile-by-email:
 *   post:
 *     summary: Obtener perfil de usuario por email
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil encontrado
 */
router.post('/profile-by-email', authenticate, userController.getUserByEmail);

/**
 * @swagger
 * /api/users/role/{role}:
 *   get:
 *     summary: Obtener usuarios filtrados por rol
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: role
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol (1 = Cliente, 2 = Barbero, 3 = Administrador, 4 = Eliminado)
 *     responses:
 *       200:
 *         description: Lista de usuarios con el rol especificado
 *       400:
 *         description: Rol inválido
 *       404:
 *         description: No se encontraron usuarios
 *       500:
 *         description: Error del servidor
 */
router.get('/role/:role', authenticate, userController.filterUsersByRole);

/**
 * @swagger
 * /api/users/{id}/delete:
 *   put:
 *     summary: Marcar una cuenta de usuario como eliminada (estado 4)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Cuenta marcada como eliminada correctamente
 *       400:
 *         description: ID de usuario inválido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al eliminar la cuenta
 */
router.put("/:id/delete", authenticate, userController.deleteAccount);



module.exports = router;
