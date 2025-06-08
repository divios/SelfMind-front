import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createTodo } from '@/lib/api';

interface NewTodoFormProps {
  listId: string;
  onCancel: () => void;
  onComplete: () => void;
}

const NewTodoForm = ({ listId, onCancel, onComplete }: NewTodoFormProps) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await createTodo(listId, title.trim());
      setTitle('');
      onComplete();
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
