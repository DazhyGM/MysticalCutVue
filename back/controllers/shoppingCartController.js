
const ShoppingCart = require('../models/shoppingCart');

const shoppingCartController = {
  // Agregar producto al carrito
  async addToCart(req, res) {
    try {
      const { user_id, id_product, amount } = req.body;

      // Validaciones
      if (!user_id || !id_product || !amount) {
        return res.status(400).json({
          success: false,
          message: 'Todos los campos son requeridos: user_id, id_product, amount'
        });
      }

      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'La cantidad debe ser mayor a 0'
        });
      }

      const result = await ShoppingCart.addToCart({ user_id, id_product, amount });
      
      res.status(201).json({
        success: true,
        message: result.message,
        data: result
      });
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Obtener carrito del usuario
  async getCart(req, res) {
    try {
      const { user_id } = req.params;

      if (!user_id) {
        return res.status(400).json({
          success: false,
          message: 'ID de usuario es requerido'
        });
      }

      const cartItems = await ShoppingCart.getCartByUser(user_id);
      const cartTotal = await ShoppingCart.getCartTotal(user_id);

      res.status(200).json({
        success: true,
        data: {
          items: cartItems,
          summary: cartTotal
        }
      });
    } catch (error) {
      console.error('Error al obtener carrito:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Actualizar cantidad de producto
  async updateCartItem(req, res) {
    try {
      const { id_cart } = req.params;
      const { amount } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'La cantidad debe ser mayor a 0'
        });
      }

      const updated = await ShoppingCart.updateCartItem(id_cart, amount);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Item del carrito no encontrado'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Cantidad actualizada correctamente'
      });
    } catch (error) {
      console.error('Error al actualizar item del carrito:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Eliminar producto del carrito
  async removeFromCart(req, res) {
    try {
      const { id_cart } = req.params;

      const removed = await ShoppingCart.removeFromCart(id_cart);

      if (!removed) {
        return res.status(404).json({
          success: false,
          message: 'Item del carrito no encontrado'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Producto eliminado del carrito'
      });
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Limpiar carrito completo
  async clearCart(req, res) {
    try {
      const { user_id } = req.params;

      const cleared = await ShoppingCart.clearCart(user_id);

      res.status(200).json({
        success: true,
        message: cleared ? 'Carrito limpiado correctamente' : 'El carrito ya estaba vacío'
      });
    } catch (error) {
      console.error('Error al limpiar carrito:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
};

module.exports = shoppingCartController;