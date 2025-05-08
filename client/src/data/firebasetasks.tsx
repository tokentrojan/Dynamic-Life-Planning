import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { Task } from '../types/Task';
import { useAuth } from '../AuthContext';

export function useTasks(): Task[] {
    const [tasks, setTasks] = useState<Task[]>([]);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser) return;

        const q = query(collection(db, 'users', currentUser.uid, 'tasks'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tasksData: Task[] = [];

            querySnapshot.forEach((doc) => {
                const rawData = doc.data();
                const task = { taskID: doc.id, ...(rawData as Omit<Task, 'taskID'>) };

                //  Recurring task logic

                const showTaskHelper = (task: Task, currentDate: Date): boolean => {
                    const today = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
                    if (task.recurring === false) return true; //return task if it is not recurring
                    if (task.completed) {
                        return today === task.recurringDay;//task is completed, but it is recurring today
                    }
                    return true;
                }
            });

            setTasks(tasksData);
        });

        return () => unsubscribe();
    }, [currentUser]);

    return tasks;
}
