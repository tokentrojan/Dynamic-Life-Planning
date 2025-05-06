export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  userID: string;            // UID from Firebase Auth
  taskID: string;            // Unique task ID (e.g., uuid)
  taskName: string;          // Required
  taskDescription: string;   // Required
  dueDate: string;           // ISO string (e.g., '2025-05-10T14:00')
  priority?: Priority;       // Optional
  duration?: number;         // Optional (minutes)
  recurring?: boolean;       // Optional toggle
  recurringDay?: string;     // Optional (only if recurring is true)
  completed?: boolean;       // Optional (used only when dueDate is in the past)
}