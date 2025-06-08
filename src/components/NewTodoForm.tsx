
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTodoStore } from '@/hooks/useTodoStore';

interface NewTodoFormProps {
  listId: string;
  onCancel: () => void;
  onComplete: () => void;
}

const NewTodoForm = ({ listId, onCancel, onComplete }: NewTodoFormProps) => {
  const [text, setText] = useState('');
  const { addTodo } = useTodoStore();

  const handleSubmit = () => {
    if (text.trim()) {
      addTodo(listId, text.trim());
      setText('');
      onComplete();
    }
  };

  const handleCancel = () => {
    setText('');
    onCancel();
  };

  return (
    <div className="p-4 bg-white rounded-xl border-2 border-blue-200 shadow-sm">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What needs to be done?"
        className="mb-3 border-none bg-transparent p-0 text-lg focus-visible:ring-0"
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit();
          if (e.key === 'Escape') handleCancel();
        }}
        autoFocus
      />
      <div className="flex space-x-2">
        <Button onClick={handleSubmit} size="sm" className="bg-blue-500 hover:bg-blue-600">
          Add Task
        </Button>
        <Button variant="ghost" size="sm" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default NewTodoForm;
