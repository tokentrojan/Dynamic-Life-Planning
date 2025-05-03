import { useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import TaskCard from '../components/TaskCard';
import { Task } from '../types/Task';

const tasks: Task[] = [
  {
    id: '1',
    title: 'WebDev Quiz',
    dueDate: '2025-05-01T08:00:00',
    duration: 45,
    priority: 'high',
  },
  {
    id: '2',
    title: 'Touching Grass',
    dueDate: '2025-05-03T18:00:00',
    duration: 30,
    priority: 'low',
  },
  {
    id: '3',
    title: 'TFT double-up Comp',
    dueDate: '2025-05-03T14:00:00',
    duration: 240,
    priority: 'medium',
  },
];

const priorityValue = { high: 1, medium: 2, low: 3 };

function SortedTasks() {
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate' | 'duration'>('priority');

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === 'priority') {
      return priorityValue[a.priority] - priorityValue[b.priority];
    }
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (sortBy === 'duration') {
      return a.duration - b.duration;
    }
    return 0;
  });

  return (
    <Container className="mt-4">
      <h2 className="mb-3">Sorted Task List</h2>

      <Form.Group className="mb-4" controlId="sortBy">
        <Form.Label>Sort by:</Form.Label>
        <Form.Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'priority' | 'dueDate' | 'duration')}
        >
          <option value="priority">Priority</option>
          <option value="dueDate">Due Date</option>
          <option value="duration">Duration</option>
        </Form.Select>
      </Form.Group>

      {sortedTasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </Container>
  );
}

export default SortedTasks;