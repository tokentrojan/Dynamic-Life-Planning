import { Container } from 'react-bootstrap';
import { useTasks } from '../data/firebasetasks';
import TaskCard from '../components/TaskCard';

function UnsortedTasks() {
  const tasks = useTasks();
  const unsortedTasks = tasks.filter((task) => !task.priority);

  return (
    <Container className="mt-4">
      <h2 className="mb-3">Unsorted Tasks</h2>

      {unsortedTasks.length === 0 ? (
        <p>No unsorted tasks found.</p>
      ) : (
        unsortedTasks.map((task) => (
          <TaskCard key={task.taskID} task={task} />
        ))
      )}
    </Container>
  );
}

export default UnsortedTasks;