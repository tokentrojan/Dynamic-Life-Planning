import { Container, Form } from 'react-bootstrap';
import { Task } from '../types/Task';
import TaskCard from '../components/TaskCard';
import { db } from '../firebase';
import { collection, onSnapshot, query, updateDoc, doc } from 'firebase/firestore';
import { useAuth } from '../AuthContext';
import { useEffect, useState } from 'react';
import TaskModal from '../components/TaskModal';



const SortedTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sortMethod, setSortMethod] = useState<'priority' | 'dueDate'>('priority');
  const { currentUser } = useAuth();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);


  useEffect(() => {
    if (!currentUser) return;

    const q = query(collection(db, 'users', currentUser.uid, 'tasks'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const taskList: Task[] = [];
      const today = new Date().toLocaleDateString('en-GB', { weekday: 'long' });
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data() as Omit<Task, 'taskID'>;
        const taskID = docSnapshot.id;

        const isRecurring = data.recurring && data.recurringDay;
        const isToday = data.recurringDay === today;

        // If it's a completed recurring task and today is the recurring day, reset it
        if (isRecurring && isToday && data.completed) {
          const ref = doc(db, 'users', currentUser.uid, 'tasks', taskID);
          updateDoc(ref, { completed: false });
          data.completed = false;
        }

        // Push only tasks that are not completed, or that are recurring and it's time to show again
        const shouldDisplay =
          !data.completed || (isRecurring && isToday);

        if (shouldDisplay) {
          taskList.push({ taskID, ...data });
        }
      });

      setTasks(taskList);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortMethod === 'priority') {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      const pA = priorityOrder[a.priority ?? 'low'];
      const pB = priorityOrder[b.priority ?? 'low'];
      if (pA !== pB) return pA - pB;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
  });
  const handleEventClick = (event: Task) => { // Click handler
    const clickedTask = tasks.find((task) => task.taskID === event.taskID);
    if (clickedTask) {
      setSelectedTask(clickedTask);
    }
  };
  
const handleToggleComplete = async (taskID: string, completed: boolean) => {
  if (!currentUser) return;
  const taskRef = doc(db, 'users', currentUser.uid, 'tasks', taskID);
  await updateDoc(taskRef, { completed });
};
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

      {sortedTasks.map((task) => (
        <TaskCard key={task.taskID} task={task} onEdit={() => handleEventClick(task)} onToggleComplete={handleToggleComplete}/>
      ))}

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
