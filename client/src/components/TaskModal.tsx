import { useState, useEffect } from 'react'; // NEW: add useEffect
import { Modal, Button, Form, Badge, Card } from 'react-bootstrap';
import { Task } from '../types/Task';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface TaskModalProps {
  task: Task;
  show: boolean;
  onClose: () => void;
}

function TaskModal({ task, show, onClose }: TaskModalProps) {
  const [isEditing, setIsEditing] = useState(false);

  // CHANGED: initialize state from task prop
  const [taskName, setTaskName] = useState(task.taskName);
  const [taskDescription, setTaskDescription] = useState(task.taskDescription);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [priority, setPriority] = useState(task.priority ?? '');
  const [duration, setDuration] = useState(task.duration ?? '');
  const [recurring, setRecurring] = useState(task.recurring ?? false);
  const [recurringDay, setRecurringDay] = useState(task.recurringDay ?? '');
  const [completed, setCompleted] = useState(task.completed ?? false);

  // ✅ NEW: resync state if task changes
  useEffect(() => {
    setTaskName(task.taskName);
    setTaskDescription(task.taskDescription);
    setDueDate(task.dueDate);
    setPriority(task.priority ?? '');
    setDuration(task.duration ?? '');
    setRecurring(task.recurring ?? false);
    setRecurringDay(task.recurringDay ?? '');
    setCompleted(task.completed ?? false);
  }, [task]);

  const handleSave = async () => {
    const ref = doc(db, 'users', task.userID, 'tasks', task.taskID);
    await updateDoc(ref, {
      taskName,
      taskDescription,
      dueDate,
      priority,
      duration,
      recurring,
      recurringDay,
      completed,
    });
    setIsEditing(false);
    onClose();
  };

  // NEW: helper to format due date nicely
  const formatDueDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  // NEW: badge renderer
  const getPriorityBadge = (p?: string) => {
    const color = p === 'high' ? 'danger' : p === 'medium' ? 'warning' : 'success';
    return <Badge bg={color}>{p?.toUpperCase()}</Badge>;
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Edit Task' : 'Task Details'}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!isEditing ? ( // NEW: Read-only card view
          <Card className="p-3 shadow-sm">
            <h4>{taskName}</h4>
            <p className="text-muted">Due: {formatDueDate(dueDate)}</p>
            <p>{taskDescription}</p>
            {priority && <p>Priority: {getPriorityBadge(priority)}</p>}
            {duration && <p>Duration: {duration} min</p>}
            {recurring && recurringDay && <p>Repeats every: {recurringDay}</p>}
          </Card>
        ) : (
          // CHANGED: editable form shown in edit mode
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Task Name</Form.Label>
              <Form.Control
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
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
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            </Form.Group>

            <Form.Check
              type="checkbox"
              label="Completed"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="mt-3"
            />

            <Form.Check
              type="checkbox"
              label="Recurring"
              checked={recurring}
              onChange={(e) => setRecurring(e.target.checked)}
            />

            {recurring && (
              <Form.Group className="mb-3 mt-2">
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
        {!isEditing ? (
          <Button variant="primary" onClick={() => setIsEditing(true)}> {/* NEW */}
            Edit
          </Button>
        ) : (
          <>
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleSave}>
              Save
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default TaskModal;