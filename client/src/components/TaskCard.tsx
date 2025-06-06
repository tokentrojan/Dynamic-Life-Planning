import { Card, Badge, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Task } from "../types/Task";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

interface Props {
  task: Task;
  onEdit?: () => void;
  onToggleComplete?: () => void;
  onCategoryClick?: (label: string) => void;
  onPriorityClick?: (label: string) => void;
  onRecurringClick?: (label: string) => void;
  onAddSubtask?: (parentID: string) => void;
  expandedTasks?: Record<string, boolean>;
  onToggleExpand?: (taskID: string) => void;
  hasSubtasks?: boolean;
}

function TaskCard({
  task,
  onEdit,
  onCategoryClick,
  onPriorityClick,
  onRecurringClick,
  onAddSubtask,
  expandedTasks = {},
  onToggleExpand,
  hasSubtasks,
}: Props) {
  const [categories, setCategories] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    async function loadCats() {
      const uid = auth.currentUser?.uid;
      if (!uid || !task.colour) return;
      const ref = doc(db, "users", uid, "Category", "default");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setCategories(snap.data() as { [key: string]: string });
      }
    }
    loadCats();
  }, [task.colour]);

  const getBadgeColor = (priority?: string) => {
    switch (priority) {
      case "high": return "danger";
      case "medium": return "warning";
      case "low": return "success";
      default: return "secondary";
    }
  };

  const getTaskColour = (colour?: string) => {
    switch (colour) {
      case "cat1": return "danger";
      case "cat2": return "primary";
      case "cat3": return "success";
      case "cat4": return "warning";
      case "cat5": return "secondary";
      case "cat6": return "dark";
      default: return "dark";
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

  const isCompleted = task.completed;
  const isExpanded = expandedTasks?.[task.taskID] ?? false;

  return (
    <Card className="shadow-sm" style={{ marginBottom: 0 }}>
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
              Duration: {task.duration} min<br />
            </>
          )}

          {task.colour && (
            <>
              Category:{" "}
              <Badge
                bg={getTaskColour(task.colour)}
                className="me-2"
                style={{ cursor: "pointer" }}
                onClick={() => task.colour && onCategoryClick?.(task.colour)}
              >
                {categories[task.colour]?.toUpperCase() ?? task.colour.toUpperCase()}
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
                task.priority && onPriorityClick?.(task.priority);
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
                task.recurringDay && onRecurringClick?.(task.recurringDay);
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

        {task.completed && task.completedDate && (
          <div className="text-muted small mt-1">
            Completed on: {new Date(task.completedDate).toLocaleDateString('en-GB')}
          </div>
        )}

        {onEdit && (
          <Button variant="primary" size="sm" onClick={onEdit}>
            Edit
          </Button>
        )}

        {onAddSubtask && (
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddSubtask(task.taskID);
            }}
            className="ms-2"
          >
            Add Subtask
          </Button>
        )}

        {onToggleExpand && (
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (hasSubtasks) onToggleExpand(task.taskID);
            }}
            disabled={!hasSubtasks}
            style={{
              opacity: hasSubtasks ? 1 : 0.5,
              cursor: hasSubtasks ? "pointer" : "default",
            }}>
            {isExpanded ? "Collapse" : "Expand"}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default TaskCard;