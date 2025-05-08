import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
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

  const [taskName, setTaskName] = useState(task.taskName);
  const [taskDescription, setTaskDescription] = useState(task.taskDescription);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [priority, setPriority] = useState(task.priority ?? '');
  const [duration, setDuration] = useState(task.duration ?? '');
  const [recurring, setRecurring] = useState(task.recurring ?? false);
  const [recurringDay, setRecurringDay] = useState(task.recurringDay ?? '');

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
    });
    setIsEditing(false);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Edit Task' : 'Task Details'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Task Name</Form.Label>
            <Form.Control
              type="text"
              readOnly={!isEditing}
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              readOnly={!isEditing}
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="datetime-local"
              readOnly={!isEditing}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Priority</Form.Label>
            <Form.Select
              disabled={!isEditing}
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
              readOnly={!isEditing}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </Form.Group>

          <Form.Check
            className="mb-2"
            type="checkbox"
            label="Recurring"
            disabled={!isEditing}
            checked={recurring}
            onChange={(e) => setRecurring(e.target.checked)}
          />

          {recurring && (
            <Form.Group className="mb-3">
              <Form.Label>Recurring Day</Form.Label>
              <Form.Select
                disabled={!isEditing}
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
      </Modal.Body>
      <Modal.Footer>
        {!isEditing ? (
          <Button variant="primary" onClick={() => setIsEditing(true)}>
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