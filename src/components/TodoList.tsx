import { useState, useEffect } from 'react';
import { Plus, ChevronDown, ChevronUp, GripVertical, Pencil, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TodoItem from './TodoItem';
import NewTodoForm from './NewTodoForm';
import type { TodoListType, TodoType } from '@/types/todo';
import { getList, updateTodo as updateTodoApi, deleteTodo as deleteTodoApi, updateTodoOrder, getTodos, updateList } from '@/lib/api';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface TodoListProps {
  listId: string;
  onUpdate?: (updatedList: TodoListType) => void;
}

interface DraggableTodoListProps {
  todos: TodoType[];
  onDragEnd: (result: DropResult) => void;
  onUpdate: (todoId: string, updates: Partial<TodoType>) => void;
  onDelete: (todoId: string) => void;
}

const DraggableTodoList = ({ todos, onDragEnd, onUpdate, onDelete }: DraggableTodoListProps) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="todos">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {todos.map((todo, index) => (
              <Draggable key={todo.id} draggableId={todo.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`flex items-center group relative ${snapshot.isDragging ? 'opacity-50' : ''}`}
                  >
                    <div
                      {...provided.dragHandleProps}
                      className="absolute -left-8 top-1/2 -translate-y-1/2 cursor-grab text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <GripVertical className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <TodoItem
                        todo={todo}
                        onUpdate={onUpdate}
                        onDelete={onDelete}
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const TodoList = ({ listId, onUpdate }: TodoListProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isCompletedOpen, setIsCompletedOpen] = useState(false);
  const [list, setList] = useState<TodoListType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const fetchList = async () => {
      try {
        const data = await getList(listId);

        setList(data);
        setError(null);
      } catch (err) {
        setError('Failed to load todo list');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchList();
  }, [listId]);

  const handleUpdateTodo = async (todoId: string, updates: Partial<TodoType>) => {
    if (!list) return;
    try {
      await updateTodoApi(list.id, todoId, updates);
      const updatedList = await getList(listId)

      setList(updatedList);
      onUpdate?.(updatedList);

    } catch (err) {
      console.error('Failed to update todo:', err);
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    if (!list) return;
    try {
      await deleteTodoApi(list.id, todoId);
      const updatedList = await getList(listId)

      setList(updatedList);
      onUpdate?.(updatedList);

    } catch (err) {
      console.error('Failed to delete todo:', err);
    }
  };

  const handleNewTodo = async (newTodo: TodoType) => {
    if (!list) return;
    const updatedList = await getList(listId)

    setList(updatedList);
    onUpdate?.(updatedList);
    setIsAdding(false);
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || !list) return;

    // Handle reordering
    if (result.destination.index === result.source.index) return;

    const items = Array.from(list.todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update list for smooth ui
    setList({
      ...list,
      todos: items
    })

    // Update the order in the backend
    try {
      await updateTodoOrder(reorderedItem.id, result.destination.index);
      const updatedList = await getList(listId)

      setList(updatedList);
      onUpdate?.(updatedList);

    } catch (err) {
      console.error('Failed to update todo order:', err);
    }
  };

  if (isLoading) {
    return <div className="flex-1 pt-12 px-8 pb-8">Loading...</div>;
  }

  if (error || !list) {
    return <div className="flex-1 pt-12 px-8 pb-8 text-red-500">{error || 'List not found'}</div>;
  }

  const incompleteTodos = list.todos.filter(todo => !todo.completed);
  const completedTodos = list.todos.filter(todo => todo.completed);

  return (
    <div className="flex-1 pt-12 px-8 pb-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          {isEditing ? (
            <div className="flex items-center gap-2 mb-2">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="text-3xl font-bold h-auto py-0"
                autoFocus
              />
              <Button
                size="icon"
                variant="ghost"
                aria-label="Save list name"
                onClick={async () => {
                  if (newName.trim() === '') {
                    alert('List title cannot be empty.');
                    return;
                  }
                  try {
                    await updateList(list.id, newName);
                    const updatedList = await getList(listId);
                    setList(updatedList);
                    onUpdate?.(updatedList);
                    setIsEditing(false);
                  } catch (err) {
                    console.error('Failed to update list name:', err);
                  }
                }}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Cancel rename"
                onClick={() => {
                  setIsEditing(false);
                  setNewName(list.name);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-2 group">
              <h1 className="text-3xl font-bold text-foreground">{list.name}</h1>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  setNewName(list.name);
                  setIsEditing(true);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          )}
          <p className="text-base text-muted-foreground">
            {incompleteTodos.length} of {list.todos.length} tasks remaining
          </p>
        </div>

        <div className="space-y-6">
          {/* Incomplete todos */}
          <DraggableTodoList
            todos={incompleteTodos}
            onDragEnd={handleDragEnd}
            onUpdate={handleUpdateTodo}
            onDelete={handleDeleteTodo}
          />

          {/* Add new todo */}
          {isAdding ? (
            <NewTodoForm
              listId={list.id}
              onCancel={() => setIsAdding(false)}
              onComplete={handleNewTodo}
              currentOrder={incompleteTodos.length}
            />
          ) : (
            <Button
              variant="ghost"
              onClick={() => setIsAdding(true)}
              className="w-full justify-start p-6 h-auto text-muted-foreground hover:text-foreground hover:bg-accent border-2 border-dashed border-border dark:border-white/20 hover:border-border/80 dark:hover:border-white/50 rounded-xl"
            >
              <Plus className="h-6 w-6 mr-3" />
              Add new task
            </Button>
          )}

          {/* Completed todos */}
          {completedTodos.length > 0 && (
            <div className="space-y-6">
              <Button
                variant="ghost"
                className="w-full flex items-center justify-between text-muted-foreground hover:text-foreground text-lg"
                onClick={() => setIsCompletedOpen(!isCompletedOpen)}
              >
                <span>Completed ({completedTodos.length})</span>
                {isCompletedOpen ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </Button>

              {isCompletedOpen && (
                <div className="space-y-3">
                  {completedTodos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onUpdate={handleUpdateTodo}
                      onDelete={handleDeleteTodo}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;
