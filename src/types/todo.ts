export interface TodoType {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface TodoListType {
  id: string;
  name: string;
  todos: TodoType[];
  createdAt: string;
  updatedAt: string;
}
