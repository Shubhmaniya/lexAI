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

// Streaming chat - returns chunks in real-time via callback
export const streamChatWithDocument = async (
  documentId: string, 
  message: string, 
  onChunk: (text: string) => void,
  language: string = 'en'
): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documentId, message, language }),
  });

  if (!response.ok) {
    throw new Error('Failed to stream chat');
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  if (!reader) throw new Error('No reader available');

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value, { stream: true });
    const lines = text.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.chunk) {
            fullText += data.chunk;
            onChunk(data.chunk);
          }
          if (data.done) {
            return fullText;
          }
        } catch (e) {
          // skip malformed JSON
        }
      }
    }
  }

  return fullText;
};

export default api;
