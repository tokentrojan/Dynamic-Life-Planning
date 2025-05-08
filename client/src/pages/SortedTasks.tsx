import { Container, Form } from 'react-bootstrap';
import TaskCard from '../components/TaskCard';
import { useTasks } from '../data/firebasetasks';
import { useState } from 'react';


const SortedTasks = () => {
  const tasks = useTasks();
  const [sortMethod, setSortMethod] = useState<'priority' | 'dueDate'>('priority');

  const sortedTasks = tasks
    .filter(task => !!task.priority)
    .sort((a, b) => {
      if (sortMethod === 'priority') {
        const order = { high: 1, medium: 2, low: 3 };
        return (order[a.priority!] ?? 4) - (order[b.priority!] ?? 4);
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    return (
      <Container className="mt-4">
        <h2 className="mb-3">Sorted Tasks</h2>
  
        <Form.Group controlId="sortMethod" className="mb-3">
          <Form.Label>Sort by:</Form.Label>
          <Form.Select
            value={sortMethod}
            onChange={(e) => setSortMethod(e.target.value as 'priority' | 'dueDate')}
          >
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
          </Form.Select>
        </Form.Group>
  
        {sortedTasks.length === 0 ? (
          <p>No sorted tasks found.</p>
        ) : (
          sortedTasks.map((task) => (
            <TaskCard key={task.taskID} task={task} />
          ))
        )}
      </Container>
    );
  };

export default SortedTasks;
