export type Priority = 'low' | 'medium' | 'high';


export interface Task {
  id: string;
  title: string;
  dueDate: string; // ISO string format
  duration: number; // in minutes or hours
  priority: Priority;
}