import { Card, Badge } from "react-bootstrap";
import { Task } from "../types/Task";

interface Props {
  task: Task;
}

function TaskCard({ task }: Props) {
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

  const isPastDue = new Date(task.dueDate) < new Date();

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
          {task.recurring && task.recurringDay && (
            <Badge bg="info">Repeats: {task.recurringDay}</Badge>
          )}
          {task.completed && isPastDue && (
            <Badge bg="secondary" className="ms-2">
              Completed
            </Badge>
          )}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default TaskCard;
