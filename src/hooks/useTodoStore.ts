
import { useState } from 'react';
import type { TodoListType, Todo } from '@/types/todo';

const initialLists: TodoListType[] = [
  {
    id: '1',
    name: 'Personal',
    todos: [
      {
        id: '1',
        text: 'Buy groceries for the week',
        completed: false,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        text: 'Exercise for 30 minutes',
        completed: true,
        createdAt: new Date('2024-01-01'),
      },
    ],
  },
  {
    id: '2',
    name: 'Work',
    todos: [
      {
        id: '3',
        text: 'Review project proposal',
        completed: false,
        createdAt: new Date('2024-01-02'),
      },
      {
        id: '4',
        text: 'Schedule team meeting',
        completed: false,
        createdAt: new Date('2024-01-02'),
      },
    ],
  },
];

export const useTodoStore = () => {
  const [lists, setLists] = useState<TodoListType[]>(initialLists);

  const addList = (name: string): TodoListType => {
    const newList: TodoListType = {
      id: Date.now().toString(),
      name,
      todos: [],
    };
    setLists(prev => [...prev, newList]);
    return newList;
  };

  const deleteList = (listId: string) => {
    setLists(prev => prev.filter(list => list.id !== listId));
  };

  const addTodo = (listId: string, text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date(),
    };

    setLists(prev =>
      prev.map(list =>
        list.id === listId
          ? { ...list, todos: [...list.todos, newTodo] }
          : list
      )
    );
  };

  const updateTodo = (listId: string, todoId: string, updates: Partial<Todo>) => {
    setLists(prev =>
      prev.map(list =>
        list.id === listId
          ? {
              ...list,
              todos: list.todos.map(todo =>
                todo.id === todoId ? { ...todo, ...updates } : todo
              ),
            }
          : list
      )
    );
  };

  const deleteTodo = (listId: string, todoId: string) => {
    setLists(prev =>
      prev.map(list =>
        list.id === listId
          ? { ...list, todos: list.todos.filter(todo => todo.id !== todoId) }
          : list
      )
    );
  };

  return {
    lists,
    addList,
    deleteList,
    addTodo,
    updateTodo,
    deleteTodo,
  };
};
