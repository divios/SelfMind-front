import { useState } from 'react';
import { Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { TodoType } from '@/types/todo';

interface TodoItemProps {
  todo: TodoType;
  onUpdate: (updates: Partial<TodoType>) => void;
  onDelete: () => void;
}

const TodoItem = ({ todo, onUpdate, onDelete }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate({ 
        title: editTitle.trim(),
        description: editDescription.trim() || undefined
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsEditing(false);
  };

  return (
    <div className={`group flex ${
      isEditing ? 'items-start' : todo.description ? 'items-start' : 'items-center'
    } space-x-3 p-4 bg-card rounded-xl border transition-all duration-200 hover:shadow-sm ${
      todo.completed ? 'border-border/50 bg-muted/50' : 'border-border hover:border-border/80'
    }`}>
      {!isEditing && (
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
      )}

      <div className="flex-1">
        {isEditing ? (
          <div className="space-y-2 w-full pt-1 pl-9">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                }
                if (e.key === 'Escape') handleCancel();
              }}
              className="border-none bg-transparent p-0 h-auto !text-xl focus-visible:ring-0 focus-visible:ring-offset-0"
              style={{ fontSize: '1.25rem' }}
              autoFocus
            />
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Add a description..."
              className="h-[140px] overflow-y-auto resize-none border-none bg-transparent p-0 !text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              style={{ fontSize: '0.875rem' }}
            />
            <div className="flex justify-end space-x-2 mt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div onClick={() => setIsEditing(true)} className="cursor-text w-full">
            {todo.description ? (
              <>
                <span
                  className={`block transition-all duration-200 ${
                    todo.completed
                      ? 'line-through text-muted-foreground'
                      : 'text-foreground hover:text-foreground/90'
                  }`}
                >
                  {todo.title}
                </span>
                <p className={`mt-1 text-sm ${
                  todo.completed ? 'text-muted-foreground/70' : 'text-muted-foreground'
                }`}>
                  {todo.description}
                </p>
              </>
            ) : (
              <span
                className={`transition-all duration-200 ${
                  todo.completed
                    ? 'line-through text-muted-foreground'
                    : 'text-foreground hover:text-foreground/90'
                }`}
              >
                {todo.title}
              </span>
            )}
          </div>
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
