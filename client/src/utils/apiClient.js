import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': 'anonymous'
  }
});

export async function analyzeDocument({ text, fileName, fileType, ocrConfidence, language }) {
  const response = await apiClient.post('/api/analyze', {
    text,
    fileName,
    fileType,
    ocrConfidence,
    language
  });
  return response.data;
}

export async function sendChatMessage({ documentId, message, language }) {
  const response = await apiClient.post('/api/chat', {
    documentId,
    message,
    language
  });
  return response.data;
}

export async function getDocuments() {
  const response = await apiClient.get('/api/documents');
  return response.data;
}

export async function getDocument(id) {
  const response = await apiClient.get(`/api/documents/${id}`);
  return response.data;
}

export async function deleteDocument(id) {
  const response = await apiClient.delete(`/api/documents/${id}`);
  return response.data;
}

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}

export default apiClient;
