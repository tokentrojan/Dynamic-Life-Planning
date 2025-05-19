import { Container, Form, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { useTasks } from '../data/firebasetasks'; // Custom hook to load tasks from Firestore
import TaskCard from '../components/TaskCard'; // Reusable card to show a task
import TaskModal from '../components/TaskModal'; // Modal to view/edit a task
import { Task } from '../types/Task'; // Task type definition

const Tasks = () => {
  // Load tasks from Firestore
  const tasks = useTasks();

  // UI state for which task filters are active
  const [filters, setFilters] = useState({
    sorted: true,
    unsorted: true,
    completed: false,
  });

  // UI state for how tasks should be sorted
  const [sortMethod, setSortMethod] = useState<'priority' | 'dueDate'>('priority');

  // UI state to track which task (if any) is currently opened in a modal
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Toggle a filter checkbox (sorted, unsorted, completed)
  const handleFilterToggle = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter logic helpers
  const isSorted = (task: Task) => task.priority && !task.completed;
  const isUnsorted = (task: Task) => !task.priority && !task.completed;
  const isCompleted = (task: Task) => task.completed;

  // Apply filters and sorting to the task list
  const filteredTasks = tasks
    .filter(task => {
      return (
        (filters.sorted && isSorted(task)) ||
        (filters.unsorted && isUnsorted(task)) ||
        (filters.completed && isCompleted(task))
      );
    })
    .sort((a, b) => {
      if (sortMethod === 'priority') {
        const order = { high: 1, medium: 2, low: 3 };
        const aPriority = a.priority ?? 'low';
        const bPriority = b.priority ?? 'low';
        return (order[aPriority] ?? 4) - (order[bPriority] ?? 4);
      }

      // Sort by due date
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  return (
    <Container className="mt-4">
      <h2 className="mb-3">Tasks</h2>

      {/* Filter checkboxes: sorted, unsorted, completed */}
      <Form className="mb-3">
        <Row>
          <Col xs={12} md={4}>
            <Form.Check
              type="checkbox"
              label="Sorted"
              checked={filters.sorted}
              onChange={() => handleFilterToggle('sorted')}
            />
          </Col>
          <Col xs={12} md={4}>
            <Form.Check
              type="checkbox"
              label="Unsorted"
              checked={filters.unsorted}
              onChange={() => handleFilterToggle('unsorted')}
            />
          </Col>
          <Col xs={12} md={4}>
            <Form.Check
              type="checkbox"
              label="Completed"
              checked={filters.completed}
              onChange={() => handleFilterToggle('completed')}
            />
          </Col>
        </Row>
      </Form>

      {/* Sort method dropdown: Priority or Due Date */}
      <Form.Group controlId="sortMethod" className="mb-4">
        <Form.Label>Sort by:</Form.Label>
        <Form.Select
          value={sortMethod}
          onChange={(e) => setSortMethod(e.target.value as 'priority' | 'dueDate')}
        >
          <option value="priority">Priority</option>
          <option value="dueDate">Due Date</option>
        </Form.Select>
      </Form.Group>

      {/* Show filtered and sorted task list */}
      {filteredTasks.length === 0 ? (
        <p>No tasks match the selected filters.</p>
      ) : (
        filteredTasks.map(task => (
          <div
            key={task.taskID}
            onClick={() => setSelectedTask(task)} // Open modal on click
            style={{ cursor: 'pointer' }}
          >
            <TaskCard task={task} />
          </div>
        ))
      )}

      {/* Task modal for viewing/editing a single task */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          show={true}
          onClose={() => setSelectedTask(null)} // Close modal
        />
      )}
    </Container>
  );
};

export default Tasks;
