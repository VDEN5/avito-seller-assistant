import axios from 'axios';
import { Item, ItemsResponse, ItemsFilters } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getItems = async (filters: ItemsFilters): Promise<ItemsResponse> => {
  const params: Record<string, any> = {};
  if (filters.q) params.q = filters.q;
  if (filters.limit) params.limit = filters.limit;
  if (filters.skip) params.skip = filters.skip;
  if (filters.needsRevision !== undefined) params.needsRevision = filters.needsRevision;
  if (filters.categories && filters.categories.length > 0) {
    params.categories = filters.categories.join(',');
  }
  if (filters.sortColumn) params.sortColumn = filters.sortColumn;
  if (filters.sortDirection) params.sortDirection = filters.sortDirection;

  const response = await api.get<ItemsResponse>('/items', { params });
  return response.data;
};

export const getItem = async (id: number): Promise<Item> => {
  const response = await api.get<Item>(`/items/${id}`);
  return response.data;
};

export const updateItem = async (id: number, data: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'needsRevision'>): Promise<{ success: boolean }> => {
  const response = await api.put(`/items/${id}`, data);
  return response.data;
};