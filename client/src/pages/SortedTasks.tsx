<<<<<<< HEAD
import { Container } from "react-bootstrap";
import { Task } from "../types/Task";
import TaskCard from "../components/TaskCard";
//import { sampleTasks } from '../data/sampleTasks';
import { db } from "../firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useAuth } from "../AuthContext";
import { useEffect, useState } from "react";
=======
import { Container, Form } from 'react-bootstrap';
import { useTasks } from '../data/firebasetasks';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal'; // new
import { Task } from '../types/Task'; // new
import { useState } from 'react'; // new
>>>>>>> main

const SortedTasks = () => {
  const tasks = useTasks();
  const [sortMethod, setSortMethod] = useState<'priority' | 'dueDate'>('priority');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // new

<<<<<<< HEAD
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

=======
  const sortedTasks = tasks
    .filter(task => !!task.priority && !task.completed)
    .sort((a, b) => {
      if (sortMethod === 'priority') {
        const order = { high: 1, medium: 2, low: 3 };
        return (order[a.priority!] ?? 4) - (order[b.priority!] ?? 4);
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

>>>>>>> main
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
          <div key={task.taskID} onClick={() => setSelectedTask(task)} style={{ cursor: 'pointer' }}>
            <TaskCard task={task} onEdit={() => setSelectedTask(task)}></TaskCard>
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
