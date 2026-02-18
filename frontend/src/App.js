import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const STATUS_COLORS = {
  'To Do': '#8884d8',
  'In Progress': '#82ca9d',
  'Done': '#ffc658',
};

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    status: 'To Do',
  });

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const handleAuthChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  const handleTaskChange = (e) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/auth/register`, authForm);
      handleAuthSuccess(res.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        email: authForm.email,
        password: authForm.password,
      });
      handleAuthSuccess(res.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  const handleAuthSuccess = (data) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('token', data.token);
    setAuthForm({ name: '', email: '', password: '' });
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
    setTasks([]);
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/tasks`, taskForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks([res.data, ...tasks]);
      setTaskForm({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
        status: 'To Do',
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Could not create task');
    }
  };

  const handleUpdateTask = async (id, updates) => {
    try {
      const res = await axios.put(`${API_BASE}/api/tasks/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch (error) {
      alert('Could not update task');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await axios.delete(`${API_BASE}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (error) {
      alert('Could not delete task');
    }
  };

  const statusCounts = ['To Do', 'In Progress', 'Done'].map((status) => ({
    name: status,
    value: tasks.filter((t) => t.status === status).length,
  }));

  if (!token) {
    return (
      <div className="app-container">
        <div className="card">
          <h2>Task Manager</h2>
          <p>Register or log in to manage your tasks.</p>
          <div style={{ marginBottom: 12 }}>
            <button
              onClick={() => setAuthMode('login')}
              style={{
                marginRight: 8,
                padding: '6px 12px',
                borderRadius: 4,
                border: authMode === 'login' ? '2px solid #333' : '1px solid #ccc',
                background: authMode === 'login' ? '#eee' : '#fff',
              }}
            >
              Log In
            </button>
            <button
              onClick={() => setAuthMode('register')}
              style={{
                padding: '6px 12px',
                borderRadius: 4,
                border: authMode === 'register' ? '2px solid #333' : '1px solid #ccc',
                background: authMode === 'register' ? '#eee' : '#fff',
              }}
            >
              Register
            </button>
          </div>
          <form onSubmit={authMode === 'login' ? handleLogin : handleRegister}>
            {authMode === 'register' && (
              <div style={{ marginBottom: 8 }}>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={authForm.name}
                  onChange={handleAuthChange}
                  style={{ width: '100%', padding: 6, marginTop: 4 }}
                />
              </div>
            )}
            <div style={{ marginBottom: 8 }}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={authForm.email}
                onChange={handleAuthChange}
                style={{ width: '100%', padding: 6, marginTop: 4 }}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={authForm.password}
                onChange={handleAuthChange}
                style={{ width: '100%', padding: 6, marginTop: 4 }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                borderRadius: 4,
                border: 'none',
                background: '#333',
                color: '#fff',
                marginTop: 8,
              }}
            >
              {authMode === 'login' ? 'Log In' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Task Manager Dashboard</h2>
            <p>Welcome, {user?.name || 'User'}!</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '6px 12px',
              borderRadius: 4,
              border: '1px solid #ccc',
              background: '#fff',
            }}
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Create Task</h3>
        <form onSubmit={handleCreateTask}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
            <div>
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={taskForm.title}
                onChange={handleTaskChange}
                style={{ width: '100%', padding: 6, marginTop: 4 }}
                required
              />
            </div>
            <div>
              <label>Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={taskForm.dueDate}
                onChange={handleTaskChange}
                style={{ width: '100%', padding: 6, marginTop: 4 }}
              />
            </div>
            <div>
              <label>Priority</label>
              <select
                name="priority"
                value={taskForm.priority}
                onChange={handleTaskChange}
                style={{ width: '100%', padding: 6, marginTop: 4 }}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Description</label>
            <textarea
              name="description"
              value={taskForm.description}
              onChange={handleTaskChange}
              style={{ width: '100%', padding: 6, marginTop: 4, minHeight: 60 }}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Status</label>
            <select
              name="status"
              value={taskForm.status}
              onChange={handleTaskChange}
              style={{ width: '100%', padding: 6, marginTop: 4 }}
            >
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
          </div>
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              border: 'none',
              background: '#333',
              color: '#fff',
              marginTop: 8,
            }}
          >
            Add Task
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Task Status Overview</h3>
        {tasks.length === 0 ? (
          <p>No tasks yet. Create your first task to see the chart.</p>
        ) : (
          <PieChart width={400} height={260}>
            <Pie
              data={statusCounts}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {statusCounts.map((entry, index) => (
                <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )}
      </div>

      <div className="card">
        <h3>Your Tasks</h3>
        {tasks.length === 0 ? (
          <p>No tasks yet. Start by creating one above.</p>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <div key={task._id} className="task-card card" style={{ borderLeftColor: STATUS_COLORS[task.status] }}>
                <h4>{task.title}</h4>
                {task.description && <p>{task.description}</p>}
                <p>
                  <strong>Due:</strong>{' '}
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                </p>
                <p>
                  <strong>Priority:</strong> {task.priority}
                </p>
                <p>
                  <span
                    className="status-pill"
                    style={{
                      background: STATUS_COLORS[task.status] + '22',
                      border: `1px solid ${STATUS_COLORS[task.status]}`,
                    }}
                  >
                    {task.status}
                  </span>
                </p>
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                  <select
                    value={task.status}
                    onChange={(e) => handleUpdateTask(task._id, { status: e.target.value })}
                    style={{ flex: 1, padding: 4 }}
                  >
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: 4,
                      border: '1px solid #e57373',
                      background: '#ffebee',
                      color: '#c62828',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;