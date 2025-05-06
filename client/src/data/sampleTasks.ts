import { Task } from '../types/Task';

export const sampleTasks: Task[] = [
  {
    userID: 'demoUser',
    taskID: 'task-001',
    taskName: 'Finish Assignment',
    taskDescription: 'Complete the React frontend assignment.',
    dueDate: '2025-05-10T17:00:00',
    priority: 'high',
    duration: 120,
    recurring: false,
    completed: false
  },
  {
    userID: 'demoUser',
    taskID: 'task-002',
    taskName: 'Weekly Team Meeting',
    taskDescription: 'Join the weekly sync-up with the team.',
    dueDate: '2025-05-11T10:00:00',
    priority: 'medium',
    duration: 60,
    recurring: true,
    recurringDay: 'Wednesday',
    completed: false
  },
  {
    userID: 'demoUser',
    taskID: 'task-003',
    taskName: 'Read 10 pages of a book',
    taskDescription: 'Part of morning routine reading.',
    dueDate: '2025-05-09T13:00:00',
    duration: 20,
    recurring: true,
    recurringDay: 'Daily',
    completed: false
  },
  {
    userID: 'demoUser',
    taskID: 'task-004',
    taskName: 'Grocery Shopping',
    taskDescription: 'Buy food and essentials.',
    dueDate: '2025-05-08T18:30:00',
    completed: false
  }
];