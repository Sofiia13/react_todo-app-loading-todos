/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addNewTodo, getTodos, USER_ID } from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos?.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTodo.trim()) {
      return;
    }

    try {
      await addNewTodo({
        userId: USER_ID,
        title: newTodo.trim(),
        completed: false,
      });

      setNewTodo('');
      const updatedTodos = await getTodos();

      setTodos(updatedTodos);
    } catch (err) {
      setErrorMessage('Unable to add a todo');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          newTodo={newTodo}
          setNewTodo={setNewTodo}
          onSubmit={handleAddTodo}
        />

        <TodoList todos={filteredTodos} />

        {/* Hide the footer if there are no todos */}
        {todos && todos.length > 0 && (
          <TodoFooter todos={todos} filter={filter} setFilter={setFilter} />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`
    notification is-danger is-light has-text-weight-normal
    ${!errorMessage ? 'hidden' : ''}
  `}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
