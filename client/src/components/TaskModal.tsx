import { useState, useEffect } from 'react'; // NEW: add useEffect
import { Modal, Button, Form, Badge, Card } from 'react-bootstrap';
import { Task } from '../types/Task';
import { db, auth } from '../firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';


interface TaskModalProps {
  task?: Task;
  show: boolean;
  onClose: () => void;
}

function TaskModal({ task, show, onClose }: TaskModalProps) {
  const isExistingTask = !!task; // true if editing/viewing, false if creating
  const [isEditing, setIsEditing] = useState(!task); // if no task, we're creating

  // Form state
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [doDate, setDoDate] = useState('');
  const [priority, setPriority] = useState('');
  const [duration, setDuration] = useState<number | ''>('');
  const [recurring, setRecurring] = useState(false);
  const [recurringDay, setRecurringDay] = useState('');
  const [completed, setCompleted] = useState(false);
  const [colour, setColour] = useState(''); // ✅ Category field

  // Populate form state when task changes OR reset when creating
  useEffect(() => {
    if (task) {
      setTaskName(task.taskName);
      setTaskDescription(task.taskDescription);
      setDueDate(task.dueDate);
      setDoDate(task.doDate ?? '');
      setPriority(task.priority ?? '');
      setDuration(task.duration ?? '');
      setRecurring(task.recurring ?? false);
      setRecurringDay(task.recurringDay ?? '');
      setCompleted(task.completed ?? false);
      setColour(task.colour ?? '');
      setIsEditing(false); // Start in view mode
    } else {
      setTaskName('');
      setTaskDescription('');
      setDueDate('');
      setDoDate('');
      setPriority('');
      setDuration('');
      setRecurring(false);
      setRecurringDay('');
      setCompleted(false);
      setColour('');
      setIsEditing(true); // Start in form mode for new task
    }
  }, [task, show]);

  // Save or create task
  const handleSave = async () => {
    const userID = auth.currentUser?.uid || localStorage.getItem("cachedUID");
    if (!userID) return;

    if (isEditing && task) {
      // Update existing task
      const ref = doc(db, 'users', userID, 'tasks', task.taskID);
      await updateDoc(ref, {
        taskName,
        taskDescription,
        dueDate,
        ...(doDate && { doDate }),
        priority,
        duration,
        recurring,
        recurringDay,
        completed,
        colour,
      });
    } else {
      // Create new task
      const taskID = uuid();
      const ref = doc(db, 'users', userID, 'tasks', taskID);
      await setDoc(ref, {
        userID,
        taskID,
        taskName,
        taskDescription,
        dueDate,
        ...(doDate && { doDate }),
        completed,
        ...(priority && { priority }),
        ...(duration && { duration }),
        ...(recurring && { recurring: true, recurringDay }),
        ...(colour && { colour }),
      });
    }

    onClose(); // Close modal after save
  };

  const getPriorityBadgeColor = (p?: string) => {
    switch (p) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const getColourBadgeColor = (c?: string) => {
    switch (c) {
      case 'red': return 'danger';
      case 'blue': return 'primary';
      case 'green': return 'success';
      case 'yellow': return 'warning';
      case 'gray': return 'secondary';
      case 'black': return 'dark';
      default: return 'light';
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Edit Task' : 'Create Task'}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!isEditing ? (
          // View Mode Card
          <Card className="p-3 shadow-sm">
            <h4>{taskName}</h4>
            <p className="text-muted">Due: {formatDate(dueDate)}</p>
            {doDate && <p className="text-muted">Do: {formatDate(doDate)}</p>}
            <p>{taskDescription}</p>
            {priority && (
              <Badge bg={getPriorityBadgeColor(priority)} className="me-2">
                {priority.toUpperCase()}
              </Badge>
            )}
            {colour && (
              <Badge bg={getColourBadgeColor(colour)} className="me-2">
                {colour.toUpperCase()}
              </Badge>
            )}
            {recurring && recurringDay && (
              <Badge bg="info" className="me-2">Repeats: {recurringDay}</Badge>
            )}
            {completed && (
              <Badge bg="secondary">Completed</Badge>
            )}
          </Card>
        ) : (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Task Name *</Form.Label>
              <Form.Control
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Due Date *</Form.Label>
              <Form.Control
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Do Date</Form.Label>
              <Form.Control
                type="datetime-local"
                value={doDate}
                onChange={(e) => setDoDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="">-- None --</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Duration (minutes)</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={duration}
                onChange={(e) =>
                  setDuration(e.target.value === '' ? '' : Number(e.target.value))
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select value={colour} onChange={(e) => setColour(e.target.value)}>
                <option value="">-- None --</option>
                <option value="red">Red</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="yellow">Yellow</option>
                <option value="gray">Gray</option>
                <option value="black">Black</option>
              </Form.Select>
            </Form.Group>

            <Form.Check
              type="checkbox"
              label="Completed"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="mb-3"
            />

            <Form.Check
              type="checkbox"
              label="Recurring"
              checked={recurring}
              onChange={(e) => setRecurring(e.target.checked)}
              className="mb-2"
            />

            {recurring && (
              <Form.Group className="mb-3">
                <Form.Label>Recurring Day</Form.Label>
                <Form.Select
                  value={recurringDay}
                  onChange={(e) => setRecurringDay(e.target.value)}
                >
                  <option value="">-- Select --</option>
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
          </Form>
        )}
      </Modal.Body>

      <Modal.Footer>
        {isExistingTask && !isEditing ? (
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        ) : (
          <>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant={isExistingTask ? 'success' : 'primary'} onClick={handleSave}>
              {isExistingTask ? 'Save Changes' : 'Create Task'}
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default TaskModal;