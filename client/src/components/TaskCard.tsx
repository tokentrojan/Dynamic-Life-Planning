//there is a problem in here where you can update the completed checkbox without editing the task, so nothing is sent through TaskModal to the db. Need to fix that
import { Card, Badge, Button, Form } from "react-bootstrap";
import { Task } from "../types/Task";

interface Props {
  task: Task;
  onEdit?: () => void;
  onToggleComplete?: () => void;
}

function TaskCard({ task, onEdit, onToggleComplete }: Props) {
  const getBadgeColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "secondary";
    }
  };

  const getTaskColor = (colour?: string) => {
    const validColours = ["red", "blue", "green", "yellow", "purple", "orange"];
    return validColours.includes(colour || "") ? colour : "gray";
  };

  const formatDueDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${day}/${month}/${year} ${time}`;
  };

  // const isPastDue = new Date(task.dueDate) < new Date();
  const isCompleted = task.completed;

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Card.Title>{task.taskName}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Due: {formatDueDate(task.dueDate)}
        </Card.Subtitle>

        <Card.Text>
          {task.taskDescription}
          <br />
          {task.duration && (
            <>
              Duration: {task.duration} min
              <br />
            </>
          )}
          {task.priority && (
            <Badge bg={getBadgeColor(task.priority)} className="me-2">
              {task.priority.toUpperCase()}
            </Badge>
          )}
          {task.colour && (
            <Badge bg={getTaskColor(task.colour)} className="me-2">
              {task.colour.toUpperCase()}{" "}
            </Badge>
          )}
          {task.recurring && task.recurringDay && (
            <Badge bg="info">Repeats: {task.recurringDay}</Badge>
          )}
          {isCompleted && (
            <Badge bg="secondary" className="ms-2">
              Completed
            </Badge>
          )}
        </Card.Text>
        <Form.Check
          type="checkbox"
          label="Completed"
          checked={task.completed}
          onChange={onToggleComplete}
          className="ms-3"
        />
        {/* Only show edit button if onEdit was passed in */}
        {onEdit && (
          <Button variant="primary" size="sm" onClick={onEdit}>
            Edit
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default TaskCard;
