import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Task } from '../types/Task';

export const checkAndRescheduleRecurringTasks = async (userID: string) => {
  const tasksRef = collection(db, 'users', userID, 'tasks');
  const snapshot = await getDocs(tasksRef);

  const today = new Date();
  const todayDay = today.toLocaleString('en-AU', { weekday: 'long' });

  snapshot.forEach(async (docSnap) => {
    const task = docSnap.data() as Task;

    if (
      task.recurring &&
      task.completed &&
      task.recurringDay === todayDay
    ) {
      const taskRef = doc(db, 'users', userID, 'tasks', task.taskID);
      const newDueDate = new Date();
      newDueDate.setHours(9, 0, 0, 0);

      await updateDoc(taskRef, {
        dueDate: newDueDate.toISOString(),
        completed: false,
      });
    }
  });
};
