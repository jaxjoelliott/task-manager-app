import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ProgressChart from './components/ProgressChart';
import AuthForm from './components/AuthForm';
import './styles/App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const authAxios = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await authAxios.get('/api/tasks');
      setTasks(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load tasks');
      setLoading(false);
    }
  };

  const handleAuthSuccess = (data) => {
    setUser({ id: data._id, name: data.name, email: data.email });
    setToken(data.token);
    localStorage.setItem('token', data.token);
    setError('');
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
    setTasks([]);
  };

  const addTask = async (taskData) => {
    try {
      const res = await authAxios.post('/api/tasks', taskData);
      setTasks((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error(err);
      setError('Failed to add task');
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const res = await authAxios.put(`/api/tasks/${id}`, updates);
      setTasks((prev) => prev.map((task) => (task._id === id ? res.data : task)));
    } catch (err) {
      console.error(err);
      setError('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await authAxios.delete(`/api/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete task');
    }
  };

  const completedCount = tasks.filter((t) => t.status === 'Done').length;
  const completionRate = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  if (!token) {
    return (
      <div className="app-container">
        <h1 className="app-title">Task Manager App</h1>
        <AuthForm apiBaseUrl={API_BASE_URL} onAuthSuccess={handleAuthSuccess} />
        {error && <p className="error-text">{error}</p>}
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Task Manager App</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>

      {error && <p className="error-text">{error}</p>}

      <section className="top-section">
        <TaskForm onAddTask={addTask} />
        <div className="summary-card">
          <h2>Progress Overview</h2>
          <p>Total Tasks: {tasks.length}</p>
          <p>Completed: {completedCount}</p>
          <p>Completion Rate: {completionRate}%</p>
        </div>
      </section>

      <section className="content-section">
        <div className="tasks-container">
          <h2>Your Tasks</h2>
          {loading ? (
            <p>Loading tasks...</p>
          ) : (
            <TaskList tasks={tasks} onUpdateTask={updateTask} onDeleteTask={deleteTask} />
          )}
        </div>
        <div className="chart-container">
          <h2>Visual Progress</h2>
          <ProgressChart tasks={tasks} />
        </div>
      </section>
    </div>
  );
}

export default App;
