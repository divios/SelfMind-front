import { useState } from 'react';
import { Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Todo } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (updates: Partial<Todo>) => void;
  onDelete: () => void;
}

const TodoItem = ({ todo, onUpdate, onDelete }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate({ text: editText.trim() });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  return (
    <div className={`group flex items-center space-x-3 p-4 bg-card rounded-xl border transition-all duration-200 hover:shadow-sm ${
      todo.completed ? 'border-border/50 bg-muted/50' : 'border-border hover:border-border/80'
    }`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onUpdate({ completed: !todo.completed })}
        className={`h-6 w-6 p-0 rounded-full border-2 transition-all duration-200 ${
          todo.completed
            ? 'bg-green-500 border-green-500 text-white hover:bg-green-600'
            : 'border-border hover:border-green-400 hover:bg-green-50/50'
        }`}
      >
        {todo.completed && <Check className="h-3 w-3" />}
      </Button>

      <div className="flex-1">
        {isEditing ? (
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
            onBlur={handleSave}
            className="border-none bg-transparent p-0 h-auto focus-visible:ring-0"
            autoFocus
          />
        ) : (
          <span
            onClick={() => setIsEditing(true)}
            className={`block cursor-text transition-all duration-200 ${
              todo.completed
                ? 'line-through text-muted-foreground'
                : 'text-foreground hover:text-foreground/90'
            }`}
          >
            {todo.text}
          </span>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TodoItem;
