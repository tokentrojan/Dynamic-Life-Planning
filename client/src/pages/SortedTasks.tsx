import { Container } from 'react-bootstrap';
import { Task } from '../types/Task';
import TaskCard from '../components/TaskCard';
import { sampleTasks } from '../data/sampleTasks';

const SortedTasks = () => {
  // Example sort: by priority then due date
  const sortedTasks: Task[] = [...sampleTasks].sort((a, b) => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    const pA = priorityOrder[a.priority ?? 'low'];
    const pB = priorityOrder[b.priority ?? 'low'];
    if (pA !== pB) return pA - pB;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <Container className="mt-4">
      <h2 className="mb-3">Sorted Tasks</h2>
      {sortedTasks.map((task) => (
        <TaskCard key={task.taskID} task={task} />
      ))}
    </Container>
  );
};

export default SortedTasks;