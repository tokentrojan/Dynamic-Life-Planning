export type Priority = 'low' | 'medium' |'high';

export interface Task{

  //  id: number;
    title: string;
    description: string;
    dueDate: string;
    duration: number; 
    priority: Priority;
}
