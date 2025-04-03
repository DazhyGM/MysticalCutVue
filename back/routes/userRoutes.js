const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

// Rutas de autenticación
router.post('/users/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Rutas protegidas
router.get('/profile', authenticateToken, userController.getProfile); 
router.get('/users', authenticateToken, userController.getUsers);
router.get('/users/:id', authenticateToken, userController.getUserById);
router.put('/users/:id', authenticateToken, userController.updateUser);
router.put('/users/status/:id', authenticateToken, userController.updateUserStatus);
router.delete('/users/:id', authenticateToken, userController.deleteUser);

module.exports = router;
