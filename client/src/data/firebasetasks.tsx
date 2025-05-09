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

    return tasks;
}