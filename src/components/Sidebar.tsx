import { useState } from 'react';
import { Plus, List, Trash2, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { TodoListType } from '@/types/todo';
import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';

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
  const { toggleSidebar } = useSidebar();

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
    <UISidebar 
      className="w-80 backdrop-blur-sm border-r border-border transition-transform duration-200 ease-in-out group-data-[state=collapsed]:-translate-x-full" 
      collapsible="offcanvas"
    >
      <div className="h-full overflow-hidden">
        <SidebarHeader className="p-6 pb-8">
          <h1 className="text-2xl font-bold text-foreground mb-0.5">Reminders</h1>
          <p className="text-sm text-muted-foreground">Stay organized and productive</p>
        </SidebarHeader>

        <SidebarContent className="px-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-muted-foreground">My Lists</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCreating(true)}
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {isCreating ? (
            <div className="flex gap-2 mb-4">
              <Input
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="New list name..."
                className="h-8"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateList();
                  } else if (e.key === 'Escape') {
                    setIsCreating(false);
                    setNewListName('');
                  }
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsCreating(false);
                  setNewListName('');
                }}
                className="h-8 w-8"
              >
                <span className="sr-only">Cancel</span>
                ×
              </Button>
            </div>
          ) : null}

          <SidebarMenu>
            {lists.map((list) => (
              <SidebarMenuItem key={list.id}>
                <div
                  onClick={() => onSelectList(list.id)}
                  className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedListId === list.id
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                      : 'hover:bg-accent text-foreground'
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
                        : 'bg-muted text-muted-foreground'
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
                          : 'hover:bg-destructive/10 hover:text-destructive'
                      }`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </div>
    </UISidebar>
  );
};

export default Sidebar;
