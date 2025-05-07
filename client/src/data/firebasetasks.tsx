import { useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useAuth } from '../AuthContext';
import { Task } from '../types/Task';

function TaskList() {
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, 'users', currentUser.uid, 'tasks')
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tasksData: Task[] = [];
            querySnapshot.forEach((doc) => {
                tasksData.push({ taskID: doc.id, ...(doc.data() as Omit<Task, 'taskID'>) });
            });
        });

        return () => unsubscribe(); // cleanup listener
    }, [currentUser]);
}

export default TaskList;
