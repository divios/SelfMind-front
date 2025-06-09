import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TodoList from './TodoList';
import { ThemeToggle } from './theme-toggle';
import { getLists, createList, deleteList } from '@/lib/api';
import type { TodoListType } from '@/types/todo';

const TodoAppContent = () => {
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [lists, setLists] = useState<TodoListType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="min-h-screen bg-background flex w-full">
      <Sidebar 
        lists={lists}
        selectedListId={selectedListId}
        onSelectList={setSelectedListId}
        onCreateList={handleCreateList}
        onDeleteList={handleDeleteList}
      />
      <main className="flex-1 flex flex-col">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        {selectedList ? (
          <TodoList 
            listId={selectedList.id} 
            onUpdate={handleListUpdate}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome to Reminders</h2>
              <p className="text-muted-foreground">Select a list to get started, or create a new one.</p>
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
