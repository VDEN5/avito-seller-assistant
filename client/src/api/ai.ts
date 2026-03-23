import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export async function generateDescription(
  title: string,
  category: string,
  params: any,
  currentDescription: string
): Promise<string> {
  const response = await axios.post(`${API_BASE_URL}/ai/description`, {
    title,
    category,
    params,
    currentDescription,
  });
  return response.data.description;
}

export async function generatePriceRecommendations(
  title: string,
  category: string,
  params: any,
  currentPrice: number
): Promise<{ details: string[] }> {
  const response = await axios.post(`${API_BASE_URL}/ai/price`, {
    title,
    category,
    params,
    currentPrice,
  });
  return response.data;
}