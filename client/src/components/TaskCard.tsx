import { Card, Badge, Button } from "react-bootstrap";
import { Task } from "../types/Task";

interface Props {
  task: Task;
  onEdit?: () => void;
  onToggleComplete?: () => void;
  onCategoryClick?: (label: string) => void;
  onPriorityClick?: (label: string) => void;
  onRecurringClick?: (label: string) => void;
}

function TaskCard({
  task,
  onEdit,
  onCategoryClick,
  onPriorityClick,
  onRecurringClick,
}: Props) {
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
      case "cat1":
        return "primary";
      case "cat2":
        return "danger";
      case "cat3":
        return "success";
      case "cat4":
        return "warning";
      case "cat5":
        return "secondary";
      case "cat6":
        return "dark";

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
              <Badge
                bg={getTaskColour(task.colour)}
                className="me-2"
                onClick={(e) => {
                  e.stopPropagation();
                  if (task.colour) {
                    onCategoryClick?.(task.colour); // only call if task.colour is defined
                  }
                }}
                style={{ cursor: "pointer" }}
              >
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
                if (task.priority) {
                  onPriorityClick?.(task.priority); // only call if task.priority is defined
                  console.log("priotity click");
                }
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
                if (task.recurringDay) {
                  // only call if task.recurringDay is defined
                  onRecurringClick?.(task.recurringDay);
                  console.log("recurringDay");
                }
              }}
              style={{ cursor: "pointer" }}
            >
              Repeats: {task.recurringDay}
            </Badge>
          )}
          {isCompleted && (
            <Badge bg="secondary" className="ms-2">
              Completed
            </Badge>
          )}
        </Card.Text>
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
