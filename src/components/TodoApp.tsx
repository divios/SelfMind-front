import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TodoList from './TodoList';
import { HeaderActions } from './HeaderActions';
import { getLists, createList, deleteList } from '@/lib/api';
import type { TodoListType } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { PanelLeftClose } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const TodoAppContent = () => {
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [lists, setLists] = useState<TodoListType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchLists = async () => {
    try {
      const data = await getLists();
      setLists(data);
      setError(null);
    } catch (err) {
      setError('Failed to load lists');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const handleCreateList = async (name: string) => {
    try {
      const newList = await createList(name);
      setLists(prev => [...prev, newList]);
      setSelectedListId(newList.id);
    } catch (err) {
      console.error('Failed to create list:', err);
    }
  };

  const handleDeleteList = async (listId: string) => {
    try {
      await deleteList(listId);
      setLists(prev => prev.filter(list => list.id !== listId));
      if (selectedListId === listId) {
        setSelectedListId(null);
      }
    } catch (err) {
      console.error('Failed to delete list:', err);
    }
  };

  const handleListUpdate = (updatedList: TodoListType) => {
    setLists(prev => prev.map(list => 
      list.id === updatedList.id ? updatedList : list
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading lists...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const selectedList = selectedListId ? lists.find(list => list.id === selectedListId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex w-full">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar 
          lists={lists}
          selectedListId={selectedListId}
          onSelectList={setSelectedListId}
          onCreateList={handleCreateList}
          onDeleteList={handleDeleteList}
        />
      </div>

      <main className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            {selectedList ? selectedList.name : 'Reminders'}
          </h1>
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              <Sidebar 
                lists={lists}
                selectedListId={selectedListId}
                onSelectList={setSelectedListId}
                onCreateList={handleCreateList}
                onDeleteList={handleDeleteList}
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Content */}
        {selectedList ? (
          <TodoList 
            listId={selectedList.id}
            onUpdate={handleListUpdate}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
                <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-2">Welcome to Reminders</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
                {lists.length === 0 ? 'Create your first list to get started.' : 'Select a list to get started.'}
              </p>
              <div className="md:hidden mt-4">
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                  <SheetTrigger asChild>
                    <Button className="bg-blue-500 hover:bg-blue-600">
                      <Menu className="h-4 w-4 mr-2" />
                      {lists.length === 0 ? 'Create List' : 'View Lists'}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 w-80">
                    <Sidebar 
                      lists={lists}
                      selectedListId={selectedListId}
                      onSelectList={setSelectedListId}
                      onCreateList={handleCreateList}
                      onDeleteList={handleDeleteList}
                    />
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const TodoApp = () => {
  return <TodoAppContent />;
};

export default TodoApp;
