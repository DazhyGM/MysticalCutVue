const express = require('express');
const router = express.Router();
const shoppingCartController = require('../controllers/shoppingCartController');
const authenticateToken = require('../middlewares/authenticate');

/**
 * @swagger
 * tags:
 *   name: Carrito
 *   description: Endpoints para la gestión del carrito de compras
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - user_id
 *         - id_product
 *         - amount
 *       properties:
 *         user_id:
 *           type: integer
 *           description: ID del usuario
 *           example: 1
 *         id_product:
 *           type: integer
 *           description: ID del producto
 *           example: 5
 *         amount:
 *           type: integer
 *           description: Cantidad del producto
 *           minimum: 1
 *           example: 2
 *     CartResponse:
 *       type: object
 *       properties:
 *         id_cart:
 *           type: integer
 *           example: 1
 *         user_id:
 *           type: integer
 *           example: 1
 *         id_product:
 *           type: integer
 *           example: 5
 *         amount:
 *           type: integer
 *           example: 2
 *         date_added:
 *           type: string
 *           format: date-time
 *         name:
 *           type: string
 *           example: "Producto ejemplo"
 *         description:
 *           type: string
 *           example: "Descripción del producto"
 *         price:
 *           type: number
 *           format: decimal
 *           example: 25.99
 *         image:
 *           type: string
 *           example: "producto.jpg"
 *         subtotal:
 *           type: number
 *           format: decimal
 *           example: 51.98
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Agregar producto al carrito
 *     tags: [Carrito]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartItem'
 *     responses:
 *       201:
 *         description: Producto agregado al carrito exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Producto agregado al carrito"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Todos los campos son requeridos"
 *       401:
 *         description: Token de autenticación inválido
 *       500:
 *         description: Error interno del servidor
 */
router.post('/add', shoppingCartController.addToCart);

/**
 * @swagger
 * /api/cart/user/{user_id}:
 *   get:
 *     summary: Obtener carrito de compras por usuario
 *     tags: [Carrito]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Carrito obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/CartResponse'
 *                     summary:
 *                       type: object
 *                       properties:
 *                         total_items:
 *                           type: integer
 *                           example: 3
 *                         total_amount:
 *                           type: number
 *                           format: decimal
 *                           example: 127.97
 *       400:
 *         description: ID de usuario requerido
 *       401:
 *         description: Token de autenticación inválido
 *       500:
 *         description: Error interno del servidor
 */
router.get('/user/:user_id', shoppingCartController.getCart);

/**
 * @swagger
 * /api/cart/item/{id_cart}:
 *   put:
 *     summary: Actualizar cantidad de producto en el carrito
 *     tags: [Carrito]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_cart
 *         in: path
 *         required: true
 *         description: ID del item en el carrito
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: integer
 *                 description: Nueva cantidad del producto
 *                 minimum: 1
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cantidad actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cantidad actualizada correctamente"
 *       400:
 *         description: Cantidad inválida
 *       401:
 *         description: Token de autenticación inválido
 *       404:
 *         description: Item del carrito no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/item/:id_cart', shoppingCartController.updateCartItem);

/**
 * @swagger
 * /api/cart/item/{id_cart}:
 *   delete:
 *     summary: Eliminar producto del carrito
 *     tags: [Carrito]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_cart
 *         in: path
 *         required: true
 *         description: ID del item en el carrito
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Producto eliminado del carrito exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Producto eliminado del carrito"
 *       401:
 *         description: Token de autenticación inválido
 *       404:
 *         description: Item del carrito no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Item del carrito no encontrado"
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/item/:id_cart',  shoppingCartController.removeFromCart);

/**
 * @swagger
 * /api/cart/clear/{user_id}:
 *   delete:
 *     summary: Limpiar carrito completo del usuario
 *     tags: [Carrito]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Carrito limpiado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Carrito limpiado correctamente"
 *       401:
 *         description: Token de autenticación inválido
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/clear/:user_id',  shoppingCartController.clearCart);

module.exports = router;