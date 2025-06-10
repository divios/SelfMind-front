import { useState, useEffect } from 'react';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TodoItem from './TodoItem';
import NewTodoForm from './NewTodoForm';
import type { TodoListType, TodoType } from '@/types/todo';
import { getList, updateTodo as updateTodoApi, deleteTodo as deleteTodoApi } from '@/lib/api';

interface TodoListProps {
  listId: string;
  onUpdate?: (updatedList: TodoListType) => void;
}

const TodoList = ({ listId, onUpdate }: TodoListProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isCompletedOpen, setIsCompletedOpen] = useState(true);
  const [list, setList] = useState<TodoListType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const data = await getList(listId);
        setList(data);
        setError(null);
      } catch (err) {
        setError('Failed to load todo list');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchList();
  }, [listId]);

  const handleUpdateTodo = async (todoId: string, updates: Partial<TodoType>) => {
    if (!list) return;
    try {
      const updatedTodo = await updateTodoApi(list.id, todoId, updates);
      const updatedList = {
        ...list,
        todos: list.todos.map(todo => 
          todo.id === todoId ? updatedTodo : todo
        )
      };
      setList(updatedList);
      onUpdate?.(updatedList);
    } catch (err) {
      console.error('Failed to update todo:', err);
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    if (!list) return;
    try {
      await deleteTodoApi(list.id, todoId);
      const updatedList = {
        ...list,
        todos: list.todos.filter(todo => todo.id !== todoId)
      };
      setList(updatedList);
      onUpdate?.(updatedList);
    } catch (err) {
      console.error('Failed to delete todo:', err);
    }
  };

  const handleNewTodo = (newTodo: TodoType) => {
    if (!list) return;
    const updatedList = {
      ...list,
      todos: [...list.todos, newTodo]
    };
    setList(updatedList);
    onUpdate?.(updatedList);
    setIsAdding(false);
  };

  if (isLoading) {
    return <div className="flex-1 pt-24 px-12 pb-12">Loading...</div>;
  }

  if (error || !list) {
    return <div className="flex-1 pt-24 px-12 pb-12 text-red-500">{error || 'List not found'}</div>;
  }

  const incompleteTodos = list.todos.filter(todo => !todo.completed);
  const completedTodos = list.todos.filter(todo => todo.completed);

  return (
    <div className="flex-1 pt-24 px-12 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">{list.name}</h1>
          <p className="text-lg text-muted-foreground">
            {incompleteTodos.length} of {list.todos.length} tasks remaining
          </p>
        </div>

        <div className="space-y-8">
          {/* Incomplete todos */}
          <div className="space-y-3">
            {incompleteTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={(updates) => handleUpdateTodo(todo.id, updates)}
                onDelete={() => handleDeleteTodo(todo.id)}
              />
            ))}
          </div>

          {/* Add new todo */}
          {isAdding ? (
            <NewTodoForm
              listId={list.id}
              onCancel={() => setIsAdding(false)}
              onComplete={handleNewTodo}
            />
          ) : (
            <Button
              variant="ghost"
              onClick={() => setIsAdding(true)}
              className="w-full justify-start p-6 h-auto text-muted-foreground hover:text-foreground hover:bg-accent border-2 border-dashed border-border hover:border-border/80 rounded-xl"
            >
              <Plus className="h-6 w-6 mr-3" />
              Add new task
            </Button>
          )}

          {/* Completed todos */}
          {completedTodos.length > 0 && (
            <div className="space-y-6">
              <Button
                variant="ghost"
                className="w-full flex items-center justify-between text-muted-foreground hover:text-foreground text-lg"
                onClick={() => setIsCompletedOpen(!isCompletedOpen)}
              >
                <span>Completed ({completedTodos.length})</span>
                {isCompletedOpen ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </Button>
              
              {isCompletedOpen && (
                <div className="space-y-3">
                  {completedTodos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onUpdate={(updates) => handleUpdateTodo(todo.id, updates)}
                      onDelete={() => handleDeleteTodo(todo.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;
