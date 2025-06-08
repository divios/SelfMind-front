
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TodoItem from './TodoItem';
import NewTodoForm from './NewTodoForm';
import { useTodoStore } from '@/hooks/useTodoStore';
import type { TodoListType } from '@/types/todo';

interface TodoListProps {
  list: TodoListType;
}

const TodoList = ({ list }: TodoListProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const { updateTodo, deleteTodo } = useTodoStore();

  const incompleteTodos = list.todos.filter(todo => !todo.completed);
  const completedTodos = list.todos.filter(todo => todo.completed);

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{list.name}</h1>
          <p className="text-slate-500">
            {incompleteTodos.length} of {list.todos.length} tasks remaining
          </p>
        </div>

        <div className="space-y-6">
          {/* Incomplete todos */}
          <div className="space-y-2">
            {incompleteTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={(updates) => updateTodo(list.id, todo.id, updates)}
                onDelete={() => deleteTodo(list.id, todo.id)}
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
              className="w-full justify-start p-4 h-auto text-slate-500 hover:text-slate-700 hover:bg-slate-50 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl"
            >
              <Plus className="h-5 w-5 mr-3" />
              Add new task
            </Button>
          )}

          {/* Completed todos */}
          {completedTodos.length > 0 && (
            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wide">
                Completed ({completedTodos.length})
              </h3>
              <div className="space-y-2">
                {completedTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onUpdate={(updates) => updateTodo(list.id, todo.id, updates)}
                    onDelete={() => deleteTodo(list.id, todo.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;
