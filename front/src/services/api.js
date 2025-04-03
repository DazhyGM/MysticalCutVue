import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

// 🔹 Registrar usuario
export const registerUser = async (userData) => {
  try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
  } catch (error) {
      throw 'Error al registrar usuario';
  }
};

// 🔹 Iniciar sesión
export const login = async (email, password) => {
  try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      return response.data;
  } catch (error) {
      console.error("🚨 Error en login:", error.response?.data || error.message);
      throw error;
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




// 🔹 Obtener todos los usuarios
export const getUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`
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
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');

    const response = await axios.put(
      `${API_URL}/users/status/${id}`,
      { userStatus_fk: status },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al actualizar estado:", error);
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

  //Mostrar usuarios inactivos
  export const getInactiveUsers = async () => {
    const token = localStorage.getItem('token'); // Obtén el token almacenado
    try {
        const response = await fetch('http://localhost:5000/api/users/inactives', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Enviar el token
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los usuarios inactivos');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

// 🔹 Solicitar recuperación de contraseña
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, { token, newPassword });
    return response.data;
  } catch (error) {
    console.error("Error en resetPassword:", error);
    throw error;
  }
};

// 🔹 Solicitar recuperación de contraseña
export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    console.error("Error en requestPasswordReset:", error);
    throw error;
  }
};




