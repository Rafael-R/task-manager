import React from 'react';
import AddTask from './components/AddTask';
import TaskList from './components/TaskList';
import "./App.css"

const App: React.FC = () => {
  return (
    <div className='App'>
      <AddTask/>
      <TaskList/>
    </div>
  );
};

export default App;