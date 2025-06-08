import { useState } from 'react';
import Sidebar from './Sidebar';
import TodoList from './TodoList';
import { useTodoStore } from '@/hooks/useTodoStore';
import { ThemeToggle } from './theme-toggle';

const TodoApp = () => {
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const { lists } = useTodoStore();

  const selectedList = selectedListId ? lists.find(list => list.id === selectedListId) : null;

  return (
    <div className="min-h-screen bg-background flex w-full">
      <Sidebar 
        selectedListId={selectedListId}
        onSelectList={setSelectedListId}
      />
      <main className="flex-1 flex flex-col">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        {selectedList ? (
          <TodoList list={selectedList} />
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

export default TodoApp;
