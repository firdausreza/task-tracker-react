import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import About from './components/About'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import { useState, useEffect } from 'react'

const App = () => {
  const [showAddTask, setShowAdd] = useState(false)
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
    }

    getTasks();
  }, [])

  // FETCH TASKS
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks');
    const data = await res.json();

    return data
  }

  // FETCH AND UPDATE TASK
  const updateTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`);
    const data = await res.json();

    return data
  }

  // DELETE TASK LIST
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE',
    })

    setTasks(tasks.filter((task) => task.id !== id));
  }

  // TOGGLE REMINDER 
  const toggleReminder = async (id) => {
    const taskToToggle = await updateTask(id);
    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder};

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(updTask)
    });

    const data = await res.json();

    setTasks(tasks.map((task) => 
      task.id === id ? { ...task, reminder: data.reminder } : task))
  }

  // ADD TASKS 
  const addTask = async (task) => {
    const res = await fetch(`http://localhost:5000/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(task)
    })

    const data = await res.json()
    setTasks([...tasks, data]);

    // const id = tasks.length + 1;
    // const newTask = { id, ...task }
  }

  return (
    <Router>
      <div className="container">
        <Header onAdd={() => setShowAdd(!showAddTask)} showAdd={showAddTask} />
        <Route path='/' exact render={(props) => (
          <>
            {showAddTask && <AddTask onAdd={addTask} />}
            {
              tasks.length > 0 ? (<Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} />) : ('No tasks currently')
            }
          </>
        )} />
        <Route path='/about' component={About} />
        <Footer />
      </div>
    </Router>
  );
}

export default App;