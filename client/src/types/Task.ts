export type Priority = 'low' | 'medium' | 'high';
export type Colour = 'red' | 'blue' | 'green' | 'yellow' | 'black' | 'grey';

export interface Task {
  userID: string;            // UID from Firebase Auth
  taskID: string;            // Unique task ID (e.g., uuid)
  taskName: string;          // Required
  taskDescription: string;   // Required
  dueDate: string;           // ISO string (e.g., '2025-05-10T14:00')
  doDate?: string;            // Same as dueDate, but used for calendat view. Optional (take due date if blank)
  completed: boolean;        // Required, default to false when adding tasks
  priority?: Priority;       // Optional
  colour?: Colour;           //optional
  duration?: number;         // Optional (minutes)
  recurring?: boolean;       // Optional toggle
  recurringDay?: string;     // Optional (only if recurring is true)
  completedDate?: string;
  nested?: boolean;         //Optional, is a boolean thing for if it needs to be nested or not
  parentID?: string;        //id for the parent task
  children?: Task[];        //array to hold any child tasks
}

export interface Category {

  color: Colour;       // 'red', 'blue', etc.
  label: string;       // 'Red', or renamed like 'Studying'
  userID: string;
}