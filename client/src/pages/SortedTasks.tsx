import { Container } from "react-bootstrap";
import { Task } from "../types/Task";
import TaskCard from "../components/TaskCard";
//import { sampleTasks } from '../data/sampleTasks';
import { db } from "../firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useAuth } from "../AuthContext";
import { useEffect, useState } from "react";

const SortedTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const q = query(collection(db, "users", currentUser.uid, "tasks"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const taskList: Task[] = [];
      querySnapshot.forEach((doc) => {
        taskList.push({
          taskID: doc.id,
          ...(doc.data() as Omit<Task, "taskID">),
        });
      });
      setTasks(taskList);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    const pA = priorityOrder[a.priority ?? "low"];
    const pB = priorityOrder[b.priority ?? "low"];
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
