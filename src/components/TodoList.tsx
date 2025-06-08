import { useState, useEffect } from 'react';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TodoItem from './TodoItem';
import NewTodoForm from './NewTodoForm';
import type { TodoListType } from '@/types/todo';
import { getList, updateTodo as updateTodoApi, deleteTodo as deleteTodoApi } from '@/lib/api';

interface TodoListProps {
  listId: string;
}

const TodoList = ({ listId }: TodoListProps) => {
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
      setList(prev => {
        if (!prev) return null;
        return {
          ...prev,
          todos: prev.todos.map(todo => 
            todo.id === todoId ? updatedTodo : todo
          )
        };
      });
    } catch (err) {
      console.error('Failed to update todo:', err);
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    if (!list) return;
    try {
      await deleteTodoApi(list.id, todoId);
      setList(prev => {
        if (!prev) return null;
        return {
          ...prev,
          todos: prev.todos.filter(todo => todo.id !== todoId)
        };
      });
    } catch (err) {
      console.error('Failed to delete todo:', err);
    }
  };

  if (isLoading) {
    return <div className="flex-1 p-8">Loading...</div>;
  }

  if (error || !list) {
    return <div className="flex-1 p-8 text-red-500">{error || 'List not found'}</div>;
  }

  const incompleteTodos = list.todos.filter(todo => !todo.completed);
  const completedTodos = list.todos.filter(todo => todo.completed);

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{list.name}</h1>
          <p className="text-muted-foreground">
            {incompleteTodos.length} of {list.todos.length} tasks remaining
          </p>
        </div>

        <div className="space-y-6">
          {/* Incomplete todos */}
          <div className="space-y-2">
            {incompleteTodos.map((todo) => (
              <TodoItem
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
              onComplete={() => setIsAdding(false)}
            />
          ) : (
            <Button
              variant="ghost"
              onClick={() => setIsAdding(true)}
              className="w-full justify-start p-4 h-auto text-muted-foreground hover:text-foreground hover:bg-accent border-2 border-dashed border-border hover:border-border/80 rounded-xl"
            >
              <Plus className="h-5 w-5 mr-3" />
              Add new task
            </Button>
          )}

          {/* Completed todos */}
          {completedTodos.length > 0 && (
            <div className="space-y-4">
              <Button
                variant="ghost"
                className="w-full flex items-center justify-between text-muted-foreground hover:text-foreground"
                onClick={() => setIsCompletedOpen(!isCompletedOpen)}
              >
                <span>Completed ({completedTodos.length})</span>
                {isCompletedOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              
              {isCompletedOpen && (
                <div className="space-y-4">
                  {completedTodos.map((todo) => (
                    <TodoItem
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
