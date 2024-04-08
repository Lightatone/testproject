import React, { useState, ChangeEvent, KeyboardEvent  } from 'react';
import './Todo.css';
import { MdOutlineCancel } from "react-icons/md";
// definition of todo item
interface Todoitem {
    id: number;
    task: string;
    completed: boolean;
  }

// Todo component
const Todo: React.FC = () => {
    const [todos, setTodos] = useState<Todoitem[]>([]);
    const [task, setTask] = useState<string>('');
    // set up state for filter
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  
    // handle input change
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      setTask(event.target.value);
    };
  
    // Add a new Todo task
    const addTodo = (task: string) => {
      if (task.trim() === '') {
        alert('Task cannot be empty!');
        return;
      }
      const newTodo = { id: Date.now(), task, completed: false };
      setTodos([...todos, newTodo]);
      setTask('');
    };
  
    // Handle key press to add Todo task
    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        addTodo(task);
      }
    };
    // Toggle task completion
    const toggleCompletion = (id: number) => {
        const newTodos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
        });
        setTodos(newTodos);
    };

    // Delete a task
    const deleteTodo = (id: number) => {
        const newTodos = todos.filter(todo => todo.id !== id);
        setTodos(newTodos);
    };
    // Filter tasks based on the current filter
    const filteredTodos = todos.filter(todo => {
        if (filter === 'all') return true;
        return filter === 'completed' ? todo.completed : !todo.completed;
    });

    
  
    return (
      <div className="todo-container">
        <h2 className="todo-heading">Todo App</h2>
        {/* Filter options */}
        <div>
            <button
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
            >
            All
            </button>
            <button
            className={`filter-button ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
            >
            Pending
            </button>
            <button
            className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
            >
            Completed
            </button>
        </div>
        {/* Filtered Todo list */}
        <ul>
            {filteredTodos.map(Todoitem => (
                <li key={Todoitem.id}>
                <div className="checkbox-container" onClick={() => toggleCompletion(Todoitem.id)}>
                    <input
                    type="checkbox"
                    className="checkbox" // Use class for marginRight
                    checked={Todoitem.completed}
                    onChange={() => {}} // Empty function to suppress console warnings
                    />
                    <span style={{ textDecoration: Todoitem.completed ? 'line-through' : 'none' }}>
                    {Todoitem.task}
                    </span>
                </div>
                <button onClick={() => deleteTodo(Todoitem.id)} className="delete-button"><MdOutlineCancel/></button>
                </li>
            ))}
        </ul>

        {/* Add Todo form */}
        <input
          type="text"
          value={task}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />
        <button className='todobutton' onClick={() => addTodo(task)}>Add Todo</button>
  
        
      </div>
    );
  };
  
  export default Todo;