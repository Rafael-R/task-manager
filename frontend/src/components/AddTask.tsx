import React, { useState } from 'react';

const AddTask: React.FC = () => {
  const [description, setDescription] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleClick = async () => {
    if (description.trim()) {
      try {
        const response = await fetch('http://127.0.0.1:8000/todos', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ description: description }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log("Task added sucessfully")
        setDescription('');
      } catch (error) {
        console.error("Error adding task:", error)
      }
    } else {
      alert('You must provide a description');
    }
  };

  return (
    <div className='add-task-section'>
      <input 
        type="text"
        className='add-task-input'
        placeholder="Write new task here..."
        value={description}
        onChange={handleChange}
      />
      <button 
        className='add-task-button'
        onClick={handleClick}>
        Create
      </button>
    </div>
  );
};

export default AddTask;