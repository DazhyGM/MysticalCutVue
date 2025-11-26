const API_BASE_URL = 'http://localhost:5000/api';

export const addToCartAPI = async (cartData) => {
  try {
    const token = localStorage.getItem('token'); // Obtener el token
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Agregar el header de autorización
      },
      body: JSON.stringify(cartData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al agregar al carrito');
    }
    
    return data;
  } catch (error) {
    console.error('Error en addToCartAPI:', error);
    throw error;
  }
};

export const getCartAPI = async (user_id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/user/${user_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener carrito');
    }
    
    return data;
  } catch (error) {
    console.error('Error en getCartAPI:', error);
    throw error;
  }
};

export const updateCartItemAPI = async (id_cart, amount) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/item/${id_cart}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar item');
    }
    
    return data;
  } catch (error) {
    console.error('Error en updateCartItemAPI:', error);
    throw error;
  }
};

export const removeFromCartAPI = async (id_cart) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/item/${id_cart}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al eliminar del carrito');
    }
    
    return data;
  } catch (error) {
    console.error('Error en removeFromCartAPI:', error);
    throw error;
  }
};

export const clearCartAPI = async (user_id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/clear/${user_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al limpiar carrito');
    }
    
    return data;
  } catch (error) {
    console.error('Error en clearCartAPI:', error);
    throw error;
  }
};