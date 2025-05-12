import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Task } from '../types/Task';
import { useAuth } from '../AuthContext';

export function useTasks(): Task[] {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { currentUser } = useAuth();

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

        // Push all tasks in the list, filter them in UI
        taskList.push({ taskID, ...data });
      });

      setTasks(taskList);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return tasks;
}