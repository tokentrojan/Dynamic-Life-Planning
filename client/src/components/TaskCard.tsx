import { Card, Badge, Button, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Task } from "../types/Task";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  BsClock,
  BsRepeat,
  BsFlag,
  BsTag,
  BsCheckCircle,
  BsChevronDown,
  BsChevronUp,
  BsPlus,
} from "react-icons/bs";
import { useTheme } from '../ThemeContext';
import { darkenColor } from '../utils/themeUtils';


interface Props {
  task: Task;
  onCategoryClick?: (label: string) => void;
  onPriorityClick?: (label: string) => void;
  onRecurringClick?: (label: string) => void;
  onAddSubtask?: (parentID: string) => void;
  expandedTasks?: Record<string, boolean>;
  onToggleExpand?: (taskID: string) => void;
  hasSubtasks?: boolean;
  isSubtask?: boolean; // Controls spacing
}

function TaskCard({
  task,
  onCategoryClick,
  onPriorityClick,
  onRecurringClick,
  onAddSubtask,
  expandedTasks = {},
  onToggleExpand,
  hasSubtasks,
  isSubtask = false,
}: Props) {
  const [categories, setCategories] = useState<{ [key: string]: string }>({});

  // Load category label mapping from Firestore
  useEffect(() => {
    async function loadCategories() {
      const uid = auth.currentUser?.uid;
      if (!uid || !task.colour) return;
      const ref = doc(db, "users", uid, "Category", "default");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setCategories(snap.data() as { [key: string]: string });
      }
    }
    loadCategories();
  }, [task.colour]);

  const { backgroundColor } = useTheme();
  const darkenedTitleColor = darkenColor(backgroundColor, 41); // 35% darker

  // Map priority to Bootstrap color
  const getBadgeColor = (priority?: string) => {
    switch (priority) {
      case "high": return "danger";
      case "medium": return "warning";
      case "low": return "success";
      default: return "secondary";
    }
  };

  // Map category to Bootstrap color
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

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString("en-GB")} ${d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const isExpanded = expandedTasks?.[task.taskID] ?? false;

  return (
    <div className={isSubtask ? "" : "mb-1"}>
    <Card
      className="shadow-sm px-3 py-2"
      style={{
        marginLeft: isSubtask ? "1.5rem" : "0",
        transition: "box-shadow 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 0 8px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 0 4px rgba(0,0,0,0.05)";
      }}
    >
      <Card.Body>
        <Row className="justify-content-between align-items-start">
          {/* Task Name and Description (left side) */}
          <Col xs={12} md={8}>
            <h3
              className="mb-3"
              style={{
                fontSize: "1.75rem",
                fontWeight: 800,
                color: darkenedTitleColor,
                textTransform: "uppercase",
              }}
            >
              {task.taskName}
            </h3>
            <p className="mb-4">{task.taskDescription}</p>
          </Col>

          {/* Badges (top right) */}
          <Col xs="auto" className="d-flex flex-wrap justify-content-end gap-2">
            {task.priority && (
              <Badge
                bg={getBadgeColor(task.priority)}
                onClick={(e) => {
                  e.stopPropagation();
                  onPriorityClick?.(task.priority!);
                }}
                style={{ cursor: "pointer" }}
              >
                <BsFlag className="me-1" />
                {task.priority.toUpperCase()}
              </Badge>
            )}

            {task.colour && (
              <Badge
                bg={getTaskColour(task.colour)}
                onClick={(e) => {
                  e.stopPropagation();
                  onCategoryClick?.(task.colour!);
                }}
                style={{ cursor: "pointer" }}
              >
                <BsTag className="me-1" />
                {categories[task.colour]?.toUpperCase() ?? task.colour.toUpperCase()}
              </Badge>
            )}

            {task.recurring && task.recurringDay && (
              <Badge
                bg="info"
                onClick={(e) => {
                  e.stopPropagation();
                  onRecurringClick?.(task.recurringDay!);
                }}
                style={{ cursor: "pointer" }}
              >
                <BsRepeat className="me-1" />
                {task.recurringDay}
              </Badge>
            )}

            {task.completed && (
              <Badge bg="secondary">
                <BsCheckCircle className="me-1" />
                Completed
              </Badge>
            )}
          </Col>
        </Row>

        <Row className="justify-content-between align-items-end mt-3">
          {/* Bottom left: Due and Do Dates */}
          <Col xs={12} md="auto" className="text-muted small">
            <div><BsClock className="me-1" />Due: {formatDate(task.dueDate)}</div>
            {task.doDate && (
              <div><BsClock className="me-1" />Do: {formatDate(task.doDate)}</div>
            )}
            {task.completed && task.completedDate && (
              <div className="mt-1">Completed on: {new Date(task.completedDate).toLocaleDateString('en-GB')}</div>
            )}
          </Col>

          {/* Bottom right: Subtask and Expand buttons */}
          <Col xs="auto" className="d-flex gap-2">
            {onAddSubtask && (
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddSubtask(task.taskID);
                }}
              >
                <BsPlus className="me-1" />
                Subtask
              </Button>
            )}
            {onToggleExpand && (
              <Button
                variant="outline-info"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasSubtasks) onToggleExpand(task.taskID);
                }}
                disabled={!hasSubtasks}
                style={{
                  opacity: hasSubtasks ? 1 : 0.5,
                  cursor: hasSubtasks ? "pointer" : "not-allowed",
                }}
              >
                {isExpanded ? <><BsChevronUp className="me-1" />Collapse</> : <><BsChevronDown className="me-1" />Expand</>}
              </Button>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
    </div>
  );
}

export default TaskCard;
