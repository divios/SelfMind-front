import { useState } from 'react';
import { Plus, List, Trash2, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { TodoListType } from '@/types/todo';
import ProfileDropdown from './ProfileDropdown';

interface SidebarProps {
  lists: TodoListType[];
  selectedListId: string | null;
  onSelectList: (listId: string | null) => void;
  onCreateList: (name: string) => Promise<void>;
  onDeleteList: (listId: string) => Promise<void>;
}

const Sidebar = ({ lists, selectedListId, onSelectList, onCreateList, onDeleteList }: SidebarProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateList = async () => {
    if (!newListName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onCreateList(newListName.trim());
      setNewListName('');
      setIsCreating(false);
    } catch (err) {
      console.error('Failed to create list:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteList = async (listId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await onDeleteList(listId);
    } catch (err) {
      console.error('Failed to delete list:', err);
    }
  };

  return (
    <div className="w-full md:w-80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-r border-slate-200 dark:border-slate-700 p-4 md:p-6 flex flex-col h-full">
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col items-center mb-4">
          <ProfileDropdown />
        </div>
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Reminders</h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Stay organized and productive</p>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">My Lists</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCreating(true)}
            className="h-7 w-7 md:h-8 md:w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Plus className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
        </div>

        <div className="space-y-1">
          {lists.map((list) => (
            <div
              key={list.id}
              onClick={() => onSelectList(list.id)}
              className={`group flex items-center justify-between p-2 md:p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedListId === list.id
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  selectedListId === list.id ? 'bg-white' : 'bg-blue-500'
                }`} />
                <List className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                <span className="font-medium text-sm md:text-base truncate">{list.name}</span>
              </div>
              <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0">
                <span className={`text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full ${
                  selectedListId === list.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}>
                  {list.todos.filter(todo => !todo.completed).length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleDeleteList(list.id, e)}
                  className={`h-5 w-5 md:h-6 md:w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                    selectedListId === list.id 
                      ? 'hover:bg-white/20 text-white' 
                      : 'hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400'
                  }`}
                >
                  <Trash2 className="h-2.5 w-2.5 md:h-3 md:w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {isCreating && (
          <div className="mt-2 p-2 md:p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600">
            <Input
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="List name"
              className="mb-2 border-none bg-white dark:bg-slate-700 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateList();
                if (e.key === 'Escape') {
                  setIsCreating(false);
                  setNewListName('');
                }
              }}
              autoFocus
            />
            <div className="flex space-x-2">
              <Button onClick={handleCreateList} size="sm" className="bg-blue-500 hover:bg-blue-600 text-xs md:text-sm">
                Create
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setIsCreating(false);
                  setNewListName('');
                }}
                className="text-xs md:text-sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
