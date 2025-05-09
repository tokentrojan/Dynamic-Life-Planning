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
                tasksData.push({
                    taskID: doc.id,
                    ...(doc.data() as Omit<Task, 'taskID'>),
                });
            });
            setTasks(tasksData);
        });

        return () => unsubscribe();
    }, [currentUser]);

    return tasks;
}