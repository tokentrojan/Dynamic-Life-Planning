import { useState } from 'react';
import { Card, Badge, Form } from 'react-bootstrap';
import { Task } from '../types/Task';
import { useAuth } from '../AuthContext'; 
import { db } from '../firebase'; 
import { doc, setDoc } from 'firebase/firestore';



interface Props {
  task: Task;
}

function TaskCard({ task }: Props) {
  const { currentUser } = useAuth(); // Get user 
  const [isRecurring, setIsRecurring] = useState(task.recurring || false);
  const [recurringDay, setRecurringDay] = useState<string>('');
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const formatDueDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${day}/${month}/${year} ${time}`;
  }

  const handleRecurringChange = async () => {
    const newRecurring = !isRecurring;
    setIsRecurring(newRecurring);

    if (!newRecurring) {
      setRecurringDay('');
    }

    const updatedTask = {
      ...task,
      recurring: newRecurring,
      recurringDay: newRecurring ? recurringDay : '',
    };

    if (currentUser) {
      try {
        // Save updated task to Firestore under the current user
        const taskRef = doc(db, 'users', currentUser.uid, 'tasks', task.id);
        await setDoc(taskRef, updatedTask); // This updates or creates the task document
        console.log('Task updated in Firestore');
      } catch (err) {
        console.error('Error saving task:', err);
      }
    }
  };


  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Card.Title>{task.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Due: {formatDueDate(task.dueDate)}
        </Card.Subtitle>
        <Card.Text>
          Duration: {task.duration} min <br />
          <Badge bg={getPriorityVariant(task.priority)}>{task.priority.toUpperCase()}</Badge>
        </Card.Text>
        <Form.Check
          type="checkbox"
          label="Recurring"
          checked={isRecurring}
          onChange={handleRecurringChange}/>

        {isRecurring && (
          <Form.Group className="mt-2">
            <Form.Label>Select a day of the week:</Form.Label>
            <Form.Select
              value={recurringDay}
              onChange={(e) => setRecurringDay(e.target.value)}>
              <option value="">-- Select Day --</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </Form.Select>
          </Form.Group>
        )}
      </Card.Body>
    </Card>
  );
}

export default TaskCard;