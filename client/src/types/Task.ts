export type Priority = 'low' | 'medium' | 'high';
export type Colour = 'red' | 'blue' | 'green' | 'yellow'| 'orange' | 'purple' |;

export interface Task {
  userID: string;            // UID from Firebase Auth
  taskID: string;            // Unique task ID (e.g., uuid)
  taskName: string;          // Required
  taskDescription: string;   // Required
  dueDate: string;           // ISO string (e.g., '2025-05-10T14:00')
  completed: boolean;        // Required, default to false when adding tasks
  priority?: Priority;       // Optional
  colour?: Colour;           //optional
  duration?: number;         // Optional (minutes)
  recurring?: boolean;       // Optional toggle
  recurringDay?: string;     // Optional (only if recurring is true)
}