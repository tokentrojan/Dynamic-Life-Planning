<<<<<<< Updated upstream
import { Container } from 'react-bootstrap';
import { useTasks } from '../data/firebasetasks';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal'; // NEW
import { Task } from '../types/Task'; // NEW
import { useState } from 'react'; // NEW

function UnsortedTasks() {
  const tasks = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // Track clicked task

  const unsortedTasks = tasks.filter(task => !task.priority && !task.completed); // Only tasks without priority and not completed

  return (
    <Container className="mt-4">
      <h2 className="mb-3">Unsorted Tasks</h2>

      {unsortedTasks.length === 0 ? (
        <p>No unsorted tasks found.</p>
      ) : (
        unsortedTasks.map((task) => (
          <div
            key={task.taskID}
            onClick={() => setSelectedTask(task)} // Open modal on click
            style={{ cursor: 'pointer' }}
          >
            <TaskCard task={task} />
          </div>
        ))
      )}

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          show={true}
          onClose={() => setSelectedTask(null)} // Close modal
        />
      )}
=======
import { Container, ListGroup } from 'react-bootstrap';

function UnsortedTasks() {
  return (
    <Container className="mt-4">
      <h2>Unsorted Tasks</h2>
      <ListGroup>
        <ListGroup.Item>Unsorted Task 1</ListGroup.Item>
        <ListGroup.Item>Unsorted Task 2</ListGroup.Item>
      </ListGroup>
>>>>>>> Stashed changes
    </Container>
  );
}

<<<<<<< Updated upstream
export default UnsortedTasks;
=======
export default UnsortedTasks;
>>>>>>> Stashed changes
