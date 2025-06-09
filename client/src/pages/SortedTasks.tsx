<<<<<<< Updated upstream
import { Container, Form } from "react-bootstrap";
import { useTasks } from "../data/firebasetasks";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal"; // new
import { Task } from "../types/Task"; // new
import { useState } from "react"; // new

const SortedTasks = () => {
  const tasks = useTasks();
  const [sortMethod, setSortMethod] = useState<"priority" | "dueDate">(
    "priority"
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // new

  const sortedTasks = tasks
    .filter((task) => !!task.priority && !task.completed)
    .sort((a, b) => {
      if (sortMethod === "priority") {
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
          onChange={(e) =>
            setSortMethod(e.target.value as "priority" | "dueDate")
          }
        >
          <option value="priority">Priority</option>
          <option value="dueDate">Due Date</option>
        </Form.Select>
      </Form.Group>

      {sortedTasks.length === 0 ? (
        <p>No sorted tasks found.</p>
      ) : (
        sortedTasks.map((task) => (
          <div
            key={task.taskID}
            onClick={() => setSelectedTask(task)}
            style={{ cursor: "pointer" }}
          >
            <TaskCard
              task={task}
              onEdit={() => setSelectedTask(task)}
            ></TaskCard>
          </div>
        ))
      )}

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          show={true}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </Container>
  );
};

export default SortedTasks;
=======
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
    recurring: false,
  },
  {
    id: '2',
    title: 'Touching Grass',
    dueDate: '2025-05-03T18:00:00',
    duration: 30,
    priority: 'low',
    recurring: true,
  },
  {
    id: '3',
    title: 'TFT double-up Comp',
    dueDate: '2025-05-03T14:00:00',
    duration: 240,
    priority: 'medium',
    recurring: true,
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
>>>>>>> Stashed changes
