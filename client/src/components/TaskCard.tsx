//there is a problem in here where you can update the completed checkbox without editing the task, so nothing is sent through TaskModal to the db. Need to fix that
import { Card, Badge, Button, Form } from "react-bootstrap";
import { Task } from "../types/Task";

interface Props {
  task: Task;
  onEdit?: () => void;
  onToggleComplete?: () => void;
  onCategoryClick?: () => void;
  onPriorityClick?: () => void;
  onRepeatClick?: () => void;
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

  const getTaskColour = (colour?: string) => {
    switch (colour) {
      case "blue":
        return "primary";
      case "red":
        return "danger";
      case "green":
        return "success";
      case "yellow":
        return "warning";
      case "black":
        return "dark";
      case "gary":
        return "secondary";

      default:
        return "light";
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

  // const isPastDue = new Date(task.dueDate) < new Date();
  const isCompleted = task.completed;

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Card.Title>{task.taskName}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Due: {formatDueDate(task.dueDate)}
        </Card.Subtitle>
        <Card.Subtitle className="mb-2 text-muted">
          Do: {formatDueDate(task.doDate ?? task.dueDate)}
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

          {task.colour && (
            <>
              Catgeory: <> </>
              <Badge bg={getTaskColour(task.colour)} className="me-2" onClick={(e) => {
                e.stopPropagation();
                console.log("Category clicked:", task.colour);
                //call onclick here
              }}
                style={{ cursor: "pointer" }}>
                {task.colour.toUpperCase() ?? "Non"}
              </Badge>
            </>
          )}
          <br />
          {task.priority && (
            <Badge
              bg={getBadgeColor(task.priority)}
              className="me-2"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Priority clicked:", task.priority);
                // Optional: call a prop like onPriorityClick(task.priority);
              }}
              style={{ cursor: "pointer" }}
            >
              {task.priority.toUpperCase()}
            </Badge>
          )}
          <br />

          {task.recurring && task.recurringDay && (
            <Badge
              bg="info"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Recurring day clicked:", task.recurringDay);
                // Optional: call a prop like onRecurringClick(task.recurringDay);
              }}
              style={{ cursor: "pointer" }}
            >Repeats: {task.recurringDay}</Badge>
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
