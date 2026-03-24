import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const analyzeDocument = async (params: {
  text: string;
  fileName: string;
  fileType: string;
  language?: string;
}) => {
  const response = await api.post('/analyze', params);
  return response.data;
};

export const getDocuments = async () => {
  const response = await api.get('/documents');
  return response.data;
};

export const deleteDocument = async (id: string) => {
  const response = await api.delete(`/documents/${id}`);
  return response.data;
};

export const chatWithDocument = async (documentId: string, message: string, history: any[] = []) => {
  const response = await api.post('/chat', {
    documentId,
    message,
    history,
  });
  return response.data;
};

export default api;
