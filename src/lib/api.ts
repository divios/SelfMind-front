import type { TodoListType, TodoType } from '@/types/todo';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Lists API
export const getLists = async (): Promise<TodoListType[]> => {
  const response = await fetch(`${API_BASE_URL}/lists`);
  if (!response.ok) throw new Error('Failed to fetch lists');
  return response.json();
};

export const getList = async (listId: string): Promise<TodoListType> => {
  const response = await fetch(`${API_BASE_URL}/lists/${listId}`);
  if (!response.ok) throw new Error('Failed to fetch list');
  return response.json();
};

export const createList = async (name: string): Promise<TodoListType> => {
  const response = await fetch(`${API_BASE_URL}/lists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error('Failed to create list');
  return response.json();
};

export const updateList = async (listId: string, name: string): Promise<TodoListType> => {
  const response = await fetch(`${API_BASE_URL}/lists/${listId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error('Failed to update list');
  return response.json();
};

export const deleteList = async (listId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/lists/${listId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete list');
};

// Todos API
export const getTodos = async (listId: string): Promise<TodoType[]> => {
  const response = await fetch(`${API_BASE_URL}/todos?listId=${listId}`);
  if (!response.ok) throw new Error('Failed to fetch todos');
  return response.json();
};

export const createTodo = async (listId: string, title: string): Promise<TodoType> => {
  const response = await fetch(`${API_BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, completed: false, listId }),
  });
  if (!response.ok) throw new Error('Failed to create todo');
  return response.json();
};

export const updateTodo = async (listId: string, todoId: string, updates: Partial<TodoType>): Promise<TodoType> => {
  const response = await fetch(`${API_BASE_URL}/todos/${todoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...updates, listId }),
  });
  if (!response.ok) throw new Error('Failed to update todo');
  return response.json();
};

export const deleteTodo = async (listId: string, todoId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/todos/${todoId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete todo');
}; 