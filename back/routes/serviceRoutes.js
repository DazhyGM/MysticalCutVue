const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authenticateToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');    

/**
 * @swagger
 * tags:
 *   name: Servicios
 *   description: Endpoints para gestión de servicios
 */

/**
 * @swagger
 * /api/services/inactive:
 *   get:
 *     summary: Obtener todos los servicios inactivos
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de servicios inactivos
 */
router.get('/inactive', authenticateToken, serviceController.getInactiveServices);

/**
 * @swagger
 * /api/services/activate/{id}:
 *   put:
 *     summary: Activar un servicio por ID
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del servicio
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Servicio activado correctamente
 */
router.put('/activate/:id', authenticateToken, serviceController.activateService);

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Obtener todos los servicios activos
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de servicios activos
 */
router.get('/', authenticateToken, serviceController.getAllServices);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Obtener un servicio por ID
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del servicio
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles del servicio
 */
router.get('/:id', authenticateToken, serviceController.getServiceById);

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Crear un nuevo servicio
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name_service:
 *                 type: string
 *               price:
 *                 type: number
 *               estimated_time:
 *                 type: string
 *                 example: "00:30:00"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Servicio creado correctamente
 */
router.post('/', authenticateToken, upload.single('image'), serviceController.createService);

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Actualizar un servicio
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del servicio
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name_service:
 *                 type: string
 *               price:
 *                 type: number
 *               estimated_time:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Servicio actualizado correctamente
 */
router.put('/:id', authenticateToken, upload.single('image'), serviceController.updateService);

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Eliminar (inactivar) un servicio
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del servicio
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Servicio inactivado correctamente
 */
router.delete('/:id', authenticateToken, serviceController.deleteService);

module.exports = router;
