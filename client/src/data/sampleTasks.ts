import { Task } from "../types/Task";

export const sampleTasks: Task[] = [
    {
      id: '1',
      title: 'WebDev Quiz',
      dueDate: '2025-05-10T08:00:00',
      duration: 45,
      priority: 'high',
      recurring: false,
    },
    {
      id: '2',
      title: 'Touching Grass',
      dueDate: '2025-05-13T18:00:00',
      duration: 30,
      priority: 'low',
      recurring: true,
    },
    {
      id: '3',
      title: 'TFT double-up Comp',
      dueDate: '2025-05-23T14:00:00',
      duration: 240,
      priority: 'medium',
      recurring: true,
    },
  ];