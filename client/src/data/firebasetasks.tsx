import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useAuth } from '../AuthContext';
import { Task } from '../types/Task';

function TaskList() {
    const { currentUser } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);

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
            setTasks(tasksData);
        });

        return () => unsubscribe(); // cleanup listener
    }, [currentUser]);

    return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <h2>Your Tasks</h2>
            {tasks.length === 0 && <p>No tasks found.</p>}
            {tasks.map(task => (
                <div key={task.taskID} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                    <h4>{task.taskName}</h4>
                    <p>{task.taskDescription}</p>
                    <p><strong>Due:</strong> {new Date(task.dueDate).toLocaleString()}</p>
                    {task.priority && <p><strong>Priority:</strong> {task.priority}</p>}
                    {task.duration && <p><strong>Duration:</strong> {task.duration} mins</p>}
                    {task.recurring && <p><strong>Repeats on:</strong> {task.recurringDay}</p>}
                </div>
            ))}
        </div>
    );
}

export default TaskList;
