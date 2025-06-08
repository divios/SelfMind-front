
import { useState } from 'react';
import { Plus, List, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTodoStore } from '@/hooks/useTodoStore';

interface SidebarProps {
  selectedListId: string | null;
  onSelectList: (listId: string | null) => void;
}

const Sidebar = ({ selectedListId, onSelectList }: SidebarProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState('');
  const { lists, addList, deleteList } = useTodoStore();

  const handleCreateList = () => {
    if (newListName.trim()) {
      const newList = addList(newListName.trim());
      setNewListName('');
      setIsCreating(false);
      onSelectList(newList.id);
    }
  };

  const handleDeleteList = (listId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteList(listId);
    if (selectedListId === listId) {
      onSelectList(null);
    }
  };

  return (
    <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-slate-200 p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Reminders</h1>
        <p className="text-sm text-slate-500">Stay organized and productive</p>
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">My Lists</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCreating(true)}
            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-1">
          {lists.map((list) => (
            <div
              key={list.id}
              onClick={() => onSelectList(list.id)}
              className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedListId === list.id
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  selectedListId === list.id ? 'bg-white' : 'bg-blue-500'
                }`} />
                <List className="h-4 w-4" />
                <span className="font-medium">{list.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedListId === list.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {list.todos.filter(todo => !todo.completed).length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleDeleteList(list.id, e)}
                  className={`h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                    selectedListId === list.id 
                      ? 'hover:bg-white/20 text-white' 
                      : 'hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {isCreating && (
          <div className="mt-2 p-3 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
            <Input
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="List name"
              className="mb-2 border-none bg-white"
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
              <Button onClick={handleCreateList} size="sm" className="bg-blue-500 hover:bg-blue-600">
                Create
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setIsCreating(false);
                  setNewListName('');
                }}
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
