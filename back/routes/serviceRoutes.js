const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authenticateToken = require('../middlewares/authMiddleware'); // Asumiendo que tienes un middleware de autenticación

// Obtener todos los servicios activos
router.get('/', authenticateToken, serviceController.getAllServices);

// Obtener un servicio por ID
router.get('/:id', authenticateToken, serviceController.getServiceById);

// Crear un nuevo servicio
router.post('/', authenticateToken, serviceController.createService);

// Actualizar un servicio
router.put('/:id', authenticateToken, serviceController.updateService);

// Eliminar un servicio (cambiar estado a inactivo)
router.delete('/:id', authenticateToken, serviceController.deleteService);

module.exports = router;
