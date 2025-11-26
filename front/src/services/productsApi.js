// productsApi.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products';

// 🔹 Registrar producto
export const createProduct = async (productData) => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();

    for (const key in productData) {
      formData.append(key, productData[key]);
    }

    const response = await axios.post(`${API_URL}/create`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw 'Error al registrar producto';
  }
};


// 🔹 Obtener todos los productos
export const getProducts = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
};

// 🔹 Obtener productos inactivos
export const getInactiveProducts = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/inactives`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener productos inactivos:", error);
    throw error;
  }
};

// 🔹 Obtener producto por ID
export const getProductById = async (productId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener producto por ID:", error);
    throw error;
  }
};

// 🔹 Actualizar producto
export const updateProduct = async (productId, productData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/${productId}`, productData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw 'Error al actualizar el producto';
  }
};

// 🔹 Cambiar estado del producto
export const updateProductStatus = async (productId, statusId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/status/${productId}`, {
      id_status: statusId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el estado del producto:", error.response?.data || error);
    throw 'Error al actualizar el estado del producto';
  }
};

      
// 🔹 Eliminar producto (cambiar estado a inactivo)
export const deleteProduct = async (productId) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    throw new Error('Error al eliminar el producto.');
  }
};






