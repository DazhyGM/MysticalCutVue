const productModel = require('../models/productModel');

// 🔹 Crear producto
exports.createProduct = async (req, res) => {
  try {
    const image = req.file ? req.file.filename : null;
    const productData = { ...req.body, image };

    const newProduct = await productModel.createProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

// 🔹 Obtener todos los productos
exports.getProducts = async (req, res) => {
  try {
    const products = await productModel.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// 🔹 Obtener producto por ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.getProductById(id);
    res.status(200).json(product);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(404).json({ error: 'Producto no encontrado' });
  }
};

// 🔹 Actualizar producto
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = { ...req.body };

    // Solo si hay archivo nuevo, actualizar la imagen
if (req.file) {
  productData.image = req.file.filename;
} else {
  // Mantener la imagen actual en DB: deberías obtener la imagen actual antes y asignarla aquí
  const currentProduct = await productModel.getProductById(id);
  productData.image = currentProduct.image;
}

    const updatedProduct = await productModel.updateProduct(id, productData);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

// 🔹 Cambiar estado del producto
exports.updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_status } = req.body;

    await productModel.updateProductStatus(id, id_status);
    res.status(200).json({ message: 'Estado del producto actualizado' });
  } catch (error) {
    console.error('Error al cambiar estado del producto:', error);
    res.status(500).json({ error: 'Error al cambiar estado del producto' });
  }
};

// 🔹 Eliminar producto (lógica suave)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await productModel.updateProductStatus(id, 3); // Estado 3 = Inactivo
    res.status(200).json({ message: 'Producto eliminado (inactivado)' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

// 🔹 Obtener productos inactivos
exports.getInactiveProducts = async (req, res) => {
  try {
    const products = await productModel.getInactiveProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error al obtener productos inactivos:', error);
    res.status(500).json({ error: 'Error al obtener productos inactivos' });
  }
};



