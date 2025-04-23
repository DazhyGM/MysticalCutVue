import axios from 'axios';

const QUOTES_API_URL = 'http://localhost:5000/api/quotes';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  };
};

export const createQuote = async (quoteData) => {
  try {
    const response = await axios.post(QUOTES_API_URL, quoteData, getAuthHeaders());
    return response.data;
  } catch (error) {
    // Esto te dará más detalles si algo falla
    console.error('Error en createQuote:', error.response?.data || error.message);
    throw error;
  }
};

export const getQuotesByMonth = async (barberId, year, month) => {
    try {
      const response = await axios.get(`${QUOTES_API_URL}/mes`, {
        params: {
          barber_id: barberId,
          year,
          month
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener citas del mes:', error.response?.data || error.message);
      throw error;
    }
  };
  
  // 🔹 Obtener citas con detalles de servicio por usuario
export const getQuotesWithServiceDetails = async (userId) => {
  try {
    const response = await axios.get(`${QUOTES_API_URL}/detalles`, {
      params: { user_id: userId },
      ...getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener citas con detalles:', error.response?.data || error.message);
    throw error;
  }
};

// Función para cancelar una cita
export const cancelQuote = async (quoteId) => {
  try {
    const response = await axios.put(`${QUOTES_API_URL}/cancel/${quoteId}`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al cancelar la cita:', error.response?.data || error.message);
    throw error;
  }
};



// Función para finalizar una cita
export const finishQuote = async (quoteId) => {
  try {
    const response = await axios.put(`${QUOTES_API_URL}/finish/${quoteId}`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al finalizar la cita:', error.response?.data || error.message);
    throw error;
  }
};



// 🔹 Obtener citas de un barbero en una fecha específica
export const getQuotesByBarberAndDate = async (barberId, date) => {
  try {
    const response = await axios.get(QUOTES_API_URL, {
      params: {
        barber_id: barberId,
        date
      },
      ...getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener citas por barbero y fecha:', error.response?.data || error.message);
    throw error;
  }
};



// 🔹 Enviar correo con los detalles de la cita
export const sendQuoteEmail = async (emailData) => {
  try {
    const response = await axios.post(`${QUOTES_API_URL}/send-email`, emailData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al enviar el correo de la cita:', error.response?.data || error.message);
    throw error;
  }
};
