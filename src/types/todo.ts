export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export interface TodoType {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TodoListType {
  id: string;
  name: string;
  todos: TodoType[];
  createdAt: string;
  updatedAt: string;
}
