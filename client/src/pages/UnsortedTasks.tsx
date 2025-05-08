import { Container } from 'react-bootstrap';
import { useTasks } from '../data/firebasetasks';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal'; // NEW
import { Task } from '../types/Task'; // NEW
import { useState } from 'react'; // NEW

function UnsortedTasks() {
  const tasks = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // Track clicked task

  const unsortedTasks = tasks.filter(task => !task.priority); // Only tasks without priority

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
    </Container>
  );
}

export default UnsortedTasks;
