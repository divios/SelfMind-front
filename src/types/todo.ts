
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export interface TodoListType {
  id: string;
  name: string;
  todos: Todo[];
}
