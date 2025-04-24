import axios from 'axios';

// Base URL for API calls
const API_URL = 'http://backend:8000';

// Get all news entries
export const getAllNews = async () => {
  try {
    const response = await axios.get(`${API_URL}/news`);
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

// Get a specific news by ID
export const getNewsById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/news/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching news with ID ${id}:`, error);
    throw error;
  }
};

// Create a new news entry
export const createNews = async (newsData) => {
  try {
    const formData = new FormData();
    formData.append('title', newsData.title);
    formData.append('content', newsData.content);
    
    const response = await axios.post(`${API_URL}/news`, formData);
    return response.data;
  } catch (error) {
    console.error('Error creating news:', error);
    throw error;
  }
};

// Update an existing news entry
export const updateNews = async (id, newsData) => {
  try {
    const formData = new FormData();
    formData.append('title', newsData.title);
    formData.append('content', newsData.content);
    
    const response = await axios.put(`${API_URL}/news/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error(`Error updating news with ID ${id}:`, error);
    throw error;
  }
};

// Delete a news entry
export const deleteNews = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/news/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting news with ID ${id}:`, error);
    throw error;
  }
};

// Search news by keyword
export const searchNews = async (keyword) => {
  try {
    const response = await axios.get(`${API_URL}/news/search?keyword=${encodeURIComponent(keyword)}`);
    return response.data;
  } catch (error) {
    console.error('Error searching news:', error);
    throw error;
  }
}; 