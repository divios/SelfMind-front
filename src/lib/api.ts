import type { TodoListType, TodoType } from '@/types/todo';
import axios, { InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log('Interceptor called for URL:', config.url);
    const token = localStorage.getItem('token');
    console.log('Token in interceptor:', token);
    if (token) {
      // Set the Authorization header with Bearer token
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear the token
      localStorage.removeItem('token');
      // Dispatch a custom event that the auth context can listen to
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  }
);

interface LoginResponse {
  token: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  console.log('Login function called');
  // Create Basic Auth header
  const credentials = btoa(`${email}:${password}`);
  const response = await api.post<LoginResponse>('/auth/login', null, {
    headers: {
      'Authorization': `Basic ${credentials}`
    }
  });
  
  console.log('Login response received:', response.data);
  // Set the token in localStorage immediately after receiving it
  if (response.data.token) {
    console.log('Setting token in localStorage');
    localStorage.setItem('token', response.data.token);
  }
  
  return response.data;
};

interface RegisterResponse {
  token: string;
}

export const register = async (email: string, password: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to register');
  }
};

// Lists API
export const getLists = async (): Promise<TodoListType[]> => {
  const response = await api.get<TodoListType[]>('/api/lists');
  return response.data;
};

export const getList = async (listId: string): Promise<TodoListType> => {
  const response = await api.get<TodoListType>(`/api/lists/${listId}`);
  return response.data;
};

export const createList = async (name: string): Promise<TodoListType> => {
  const response = await api.post<TodoListType>('/api/lists', { name });
  return response.data;
};

export const updateList = async (listId: string, name: string): Promise<TodoListType> => {
  const response = await api.put<TodoListType>(`/api/lists/${listId}`, { name });
  return response.data;
};

export const deleteList = async (listId: string): Promise<void> => {
  await api.delete(`/api/lists/${listId}`);
};

// Todos API
export const getTodos = async (listId: string): Promise<TodoType[]> => {
  const response = await api.get<TodoType[]>(`/api/todos/${listId}`);
  return response.data;
};

export const createTodo = async (listId: string, title: string): Promise<TodoType> => {
  const response = await api.post<TodoType>(`/api/todos`, { title, completed: false, listId });
  return response.data;
};

export const updateTodo = async (listId: string, todoId: string, updates: Partial<TodoType>): Promise<TodoType> => {
  const response = await api.put<TodoType>(`/api/todos/${todoId}`, updates);
  return response.data;
};

export const deleteTodo = async (listId: string, todoId: string): Promise<void> => {
  await api.delete(`/api/todos/${todoId}`);
}; 