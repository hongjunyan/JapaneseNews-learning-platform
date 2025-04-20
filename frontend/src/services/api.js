import axios from 'axios';

// 獲取API URL
// 在 Docker 環境中，後端服務可以通過服務名稱訪問 
// 但在瀏覽器中，仍然需要使用 localhost，因為瀏覽器並不在 Docker 網絡內部
const API_URL = 'http://localhost:8000';

console.log('API URL is configured as:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// News API
export const getAllNews = async () => {
  try {
    const response = await api.get('/news');
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

export const getNewsById = async (newsId) => {
  try {
    const response = await api.get(`/news/${newsId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching news ${newsId}:`, error);
    throw error;
  }
};

export const createNews = async (title, youtube_url = null) => {
  try {
    const response = await api.post('/news', { title, youtube_url });
    return response.data;
  } catch (error) {
    console.error('Error creating news:', error);
    throw error;
  }
};

export const updateNews = async (newsId, { title, youtube_url = null }) => {
  try {
    const response = await api.put(`/news/${newsId}`, { title, youtube_url });
    return response.data;
  } catch (error) {
    console.error(`Error updating news ${newsId}:`, error);
    throw error;
  }
};

export const deleteNews = async (newsId) => {
  try {
    const response = await api.delete(`/news/${newsId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting news ${newsId}:`, error);
    throw error;
  }
};

// Notes API
export const createNote = async (newsId, note) => {
  try {
    const response = await api.post(`/news/${newsId}/notes`, note);
    return response.data;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

export const updateNote = async (noteId, note) => {
  try {
    const response = await api.put(`/notes/${noteId}`, note);
    return response.data;
  } catch (error) {
    console.error(`Error updating note ${noteId}:`, error);
    throw error;
  }
};

export const deleteNote = async (noteId) => {
  try {
    const response = await api.delete(`/notes/${noteId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting note ${noteId}:`, error);
    throw error;
  }
};

export const searchNotes = async (keyword) => {
  try {
    const response = await api.get(`/search/notes`, { 
      params: { keyword } 
    });
    return response.data;
  } catch (error) {
    console.error('Error searching notes:', error);
    throw error;
  }
};

// Furigana API
export const getFurigana = async (text) => {
  try {
    const response = await api.post('/furigana', { text });
    return response.data;
  } catch (error) {
    console.error('Error getting furigana:', error);
    throw error;
  }
}; 