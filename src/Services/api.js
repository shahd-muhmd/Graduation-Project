import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

export const getDevices = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/devices`);
    return response.data;
  } catch (error) {
    console.error("Error fetching devices:", error);
    throw error;
  }
};

export const addDeviceToApi = async (deviceData) => {
  try {
    const response = await axios.post(`${BASE_URL}/devices`, deviceData);
    return response.data;
  } catch (error) {
    console.error("Error adding device:", error);
    throw error;
  }
};

export const updateDeviceInApi = async (id, updatedData) => {
  try {
    const response = await axios.put(`${BASE_URL}/devices/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating device:", error);
    throw error;
  }
};

export const deleteDeviceFromApi = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/devices/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting device:", error);
    throw error;
  }
};