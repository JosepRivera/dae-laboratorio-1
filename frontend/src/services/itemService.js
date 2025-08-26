import axios from "axios";

const API_BASE = "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

export const itemService = {
  // Obtener todos los items
  getAll: async () => {
    const response = await api.get("/api/items/");
    return response.data;
  },

  // Obtener un item por ID
  getById: async (id) => {
    const response = await api.get(`/api/items/${id}/`);
    return response.data;
  },

  // Crear nuevo item
  create: async (itemData) => {
    const response = await api.post("/api/items/", itemData);
    return response.data;
  },

  // Actualizar item
  update: async (id, itemData) => {
    const response = await api.put(`/api/items/${id}/`, itemData);
    return response.data;
  },

  // Eliminar item
  delete: async (id) => {
    const response = await api.delete(`/api/items/${id}/`);
    return response.data;
  },
};
