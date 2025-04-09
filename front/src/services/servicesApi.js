import axios from 'axios';

const SERVICE_API_URL = 'http://localhost:5000/api/services';

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

export const getAllServices = async () => {
  const response = await axios.get(SERVICE_API_URL, getAuthHeaders());
  return response.data;
};

export const getServiceById = async (id) => {
  const response = await axios.get(`${SERVICE_API_URL}/${id}`, getAuthHeaders());
  return response.data;
};

export const createService = async (serviceData) => {
  const response = await axios.post(SERVICE_API_URL, serviceData, getAuthHeaders());
  return response.data;
};

export const updateService = async (id, updatedData) => {
  const response = await axios.put(`${SERVICE_API_URL}/${id}`, updatedData, getAuthHeaders());
  return response.data;
};

export const deleteService = async (id) => {
  const response = await axios.delete(`${SERVICE_API_URL}/${id}`, getAuthHeaders());
  return response.data;
};
