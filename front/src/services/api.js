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


