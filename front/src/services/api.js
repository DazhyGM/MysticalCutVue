import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

// 🔹 Iniciar sesión
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        throw 'Error al iniciar sesión';
    }
};

// 🔹 Obtener datos del usuario autenticado
export const getUserData = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw 'Error al obtener los datos del usuario';
    }
};

// 🔹 Registrar usuario
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        throw 'Error al registrar usuario';
    }
};

export const getUsers = async () => {
    try {
      const token = localStorage.getItem('token'); // 🔹 Obtener el token del localStorage
      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}` // 🔹 Agregar el token en los headers
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error en getUsers:", error);
      throw error;
    }
  };
  
  

// 🔹 Obtener un solo usuario por ID

export const getUserById = async (userId) => {
  try {
    const token = localStorage.getItem('token'); // Asegúrate de que el token esté almacenado
    const response = await axios.get(`${API_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error en getUserById:", error);
    throw error;
  }
};


// 🔹 Actualizar usuario
export const updateUser = async (id, userData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, userData);
        return response.data;
    } catch (error) {
        throw 'Error al actualizar el usuario';
    }
};

// 🔹 Actualizar estado del usuario (activar, bloquear o inactivar)
export const updateUserStatus = async (id, status) => {
    try {
        const response = await axios.put(`${API_URL}/status/${id}`, { userStatus_fk: status });
        return response.data;
    } catch (error) {
        throw 'Error al actualizar el estado del usuario';
    }
};

// 🔹 Eliminar usuario (cambiar estado a inactivo)
export const deleteUser = async (id) => {
    const token = localStorage.getItem('token');  // Obtener el token de localStorage
  
    if (!token) {
      console.error("No se encontró el token, el usuario no está autenticado.");
      throw new Error('Usuario no autenticado.');
    }
  
    try {
      await axios.delete(`http://localhost:5000/api/users/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Incluir el token en los encabezados
        }
      });
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      throw new Error('Error al eliminar el usuario.');
    }
  };
