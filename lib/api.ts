import axios from "axios"
import { getAuthToken } from "./auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://lhw039haoh.execute-api.us-east-1.amazonaws.com/dev"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface Item {
  id: string
  name: string
  description: string
  updatedAt: string
}

export const itemsApi = {
  getAll: async (): Promise<Item[]> => {
    const response = await apiClient.get("/items")
    return response.data
  },

  getById: async (id: string): Promise<Item> => {
    const response = await apiClient.get(`/items/${id}`)
    return response.data
  },

  create: async (data: { name: string; description: string }): Promise<Item> => {
    const response = await apiClient.post("/items", data)
    return response.data
  },

  update: async (id: string, data: { name: string; description: string }): Promise<Item> => {
    const response = await apiClient.put(`/items/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/items/${id}`)
  },
}

export default apiClient
