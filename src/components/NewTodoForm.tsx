import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createTodo } from '@/lib/api';
import type { TodoType } from '@/types/todo';

interface NewTodoFormProps {
  listId: string;
  onCancel: () => void;
  onComplete: (newTodo: TodoType) => void;
}

const NewTodoForm = ({ listId, onCancel, onComplete }: NewTodoFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const newTodo = await createTodo(listId, title.trim(), description.trim() || undefined);
      setTitle('');
      setDescription('');
      onComplete(newTodo);
    } catch (err) {
      console.error('Failed to create todo:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        disabled={isSubmitting}
        autoFocus
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add a description (optional)"
        disabled={isSubmitting}
        className="h-[140px] overflow-y-auto resize-none border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!title.trim() || isSubmitting}
        >
          Add Task
        </Button>
      </div>
    </form>
  );
};

export default NewTodoForm;
