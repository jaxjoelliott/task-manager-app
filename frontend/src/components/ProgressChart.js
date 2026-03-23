import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProgressChart = ({ tasks }) => {
  if (!tasks.length) {
    return <p>Add tasks to see your progress.</p>;
  }

  const statusCounts = tasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    {}
  );

  const data = [
    { name: 'To Do', value: statusCounts['To Do'] || 0 },
    { name: 'In Progress', value: statusCounts['In Progress'] || 0 },
    { name: 'Done', value: statusCounts['Done'] || 0 },
  ];

  // 🎨 Colors for each section
  const COLORS = ['#f87171', '#facc15', '#4ade80']; // red, yellow, green

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ProgressChart;
