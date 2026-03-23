import React from 'react';

const TaskList = ({ tasks, onUpdateTask, onDeleteTask }) => {
  if (!tasks.length) {
    return <p>No tasks yet. Add your first task above.</p>;
  }

  const handleStatusChange = (task, newStatus) => {
    onUpdateTask(task._id, { ...task, status: newStatus });
  };

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div className="task-card" key={task._id}>
          <div className="task-header">
            <h3>{task.title}</h3>
            <span className={`status-badge status-${task.status.replace(' ', '').toLowerCase()}`}>
              {task.status}
            </span>
          </div>
          {task.description && <p className="task-desc">{task.description}</p>}
          <div className="task-meta">
            {task.dueDate && (
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            )}
            <span>Priority: {task.priority}</span>
          </div>
          <div className="task-actions">
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(task, e.target.value)}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <button
              className="danger-button"
              onClick={() => onDeleteTask(task._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
