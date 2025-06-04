import { Container, Form, Row, Col, Modal } from "react-bootstrap";
import { useState } from "react";
import { useTasks } from "../data/firebasetasks"; // Custom hook to load tasks from Firestore
import TaskCard from "../components/TaskCard"; // Reusable card to show a task
import TaskModal from "../components/TaskModal"; // Modal to view/edit a task
import { Task } from "../types/Task"; // Task type definition
import CreateTaskButton from "../components/CreateTaskButton";
import CategoryManagerButton from "../components/CategoryManagerButton";

const Tasks = () => {
  // Load tasks from Firestore
  const tasks = useTasks();

  // UI state for which task filters are active
  const [filters, setFilters] = useState({
    sorted: true,
    unsorted: true,
    completed: false,
  });

  const [labelFilter, setLabelFilter] = useState<{
    colour?: string;
    priority?: string;
    recurringDay?: string;
  }>({});
  const [showLabelFilterModal, setShowLabelFilterModal] = useState(false);

  const handleCategoryClick = (label: string) => {
    setLabelFilter({ colour: label });
    setShowLabelFilterModal(true);
  };

  const handlePriorityClick = (label: string) => {
    setLabelFilter({ priority: label });
    setShowLabelFilterModal(true);
  };
  const handleRecurringClick = (label: string) => {
    setLabelFilter({ recurringDay: label });
    setShowLabelFilterModal(true);
  };

  const shownTasks = tasks.filter((task) => {
    return (
      (!labelFilter.colour || task.colour === labelFilter.colour) &&
      (!labelFilter.priority || task.priority === labelFilter.priority) &&
      (!labelFilter.recurringDay ||
        task.recurringDay === labelFilter.recurringDay)
    );
  });

  // UI state for how tasks should be sorted
  const [sortMethod, setSortMethod] = useState<"priority" | "dueDate">(
    "priority"
  );

  // UI state to track which task (if any) is currently opened in a modal
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [creatingSubtaskFor, setCreatingSubtaskFor] = useState<string | null>(null);

  const handleAddSubtask = (parentID: string) => {
    setCreatingSubtaskFor(parentID);
    setSelectedTask(null);  // open modal in "create" mode
  };


  // Toggle a filter checkbox (sorted, unsorted, completed)
  const handleFilterToggle = (key: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter logic helpers
  const isSorted = (task: Task) => task.priority && !task.completed;
  const isUnsorted = (task: Task) => !task.priority && !task.completed;
  const isCompleted = (task: Task) => task.completed;

  // Apply filters and sorting to the task list
  const filteredTasks = tasks
    .filter((task) => {
      return (
        (filters.sorted && isSorted(task)) ||
        (filters.unsorted && isUnsorted(task)) ||
        (filters.completed && isCompleted(task))
      );
    })
    .sort((a, b) => {
      if (sortMethod === "priority") {
        const order = { high: 1, medium: 2, low: 3 };
        const aPriority = a.priority ?? "low";
        const bPriority = b.priority ?? "low";
        return (order[aPriority] ?? 4) - (order[bPriority] ?? 4);
      }

      // Sort by due date
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
  const toggleExpanded = (taskID: string) => {
    setExpandedTasks(prev => {
      const newState = {
        ...prev,
        [taskID]: !prev[taskID],
      };
      return newState;
    });
  };


  const renderTaskWithSubtasks = (task: Task, level = 0) => {
    const subtasks = filteredTasks.filter(t => t.parentID === task.taskID);
    const isExpanded = expandedTasks[task.taskID] ?? false;
    const hasSubtasks = subtasks.length > 0; //true if there are subtasks

    return (
      <div key={task.taskID} style={{
        paddingLeft: level * 20,
        marginBottom: level === 0 ? 20 : 0, // Space only between top-level tasks
      }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{ flex: 1, cursor: "pointer" }}
            onClick={() => setSelectedTask(task)}
          >
            <TaskCard
              task={task}
              onEdit={() => setSelectedTask(task)}
              onCategoryClick={handleCategoryClick}
              onPriorityClick={handlePriorityClick}
              onRecurringClick={handleRecurringClick}
              onAddSubtask={handleAddSubtask}
              expandedTasks={expandedTasks}
              onToggleExpand={toggleExpanded}
              hasSubtasks={hasSubtasks}
            />
          </div>
        </div>
        {isExpanded && subtasks.map(subtask => renderTaskWithSubtasks(subtask, level + 1))}
      </div>
    );
  };



  return (
    <Container className="mt-4">
      <h2 className="mb-3">Tasks</h2>

      {/* Filter checkboxes: sorted, unsorted, completed */}
      <Form className="mb-3">
        <Row>
          <Col xs={12} md={4}>
            <Form.Check
              type="checkbox"
              label="Sorted"
              checked={filters.sorted}
              onChange={() => handleFilterToggle("sorted")}
            />
          </Col>
          <Col xs={12} md={4}>
            <Form.Check
              type="checkbox"
              label="Unsorted"
              checked={filters.unsorted}
              onChange={() => handleFilterToggle("unsorted")}
            />
          </Col>
          <Col xs={12} md={4}>
            <Form.Check
              type="checkbox"
              label="Completed"
              checked={filters.completed}
              onChange={() => handleFilterToggle("completed")}
            />
          </Col>
        </Row>
      </Form>

      {/* Sort method dropdown: Priority or Due Date */}
      <Form.Group controlId="sortMethod" className="mb-4">
        <Form.Label>Sort by:</Form.Label>
        <Form.Select
          value={sortMethod}
          onChange={(e) =>
            setSortMethod(e.target.value as "priority" | "dueDate")
          }
        >
          <option value="priority">Priority</option>
          <option value="dueDate">Due Date</option>
        </Form.Select>
      </Form.Group>

      {filteredTasks.length === 0 ? (
        <p>No tasks match the selected filters.</p>
      ) : (
        filteredTasks
          .filter(task => !task.parentID) // only top-level tasks
          .map(task => renderTaskWithSubtasks(task))
      )}


      {/* Task modal for viewing/editing a single task */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          show={true}
          onClose={() => setSelectedTask(null)} // Close modal
        />
      )}
      {creatingSubtaskFor && (
        <TaskModal
          parentID={creatingSubtaskFor}   // Pass the parent task ID
          show={true}
          onClose={() => setCreatingSubtaskFor(null)}
        />
      )}

      {/* Modal for viewing tasks by label */}
      <Modal
        show={showLabelFilterModal}
        onHide={() => setShowLabelFilterModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Showing tasks by filter:
            {" " +
              (
                labelFilter.colour ||
                labelFilter.priority ||
                labelFilter.recurringDay
              )?.toUpperCase()}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {shownTasks.length > 0 ? (
            shownTasks.map((task) => (
              <TaskCard
                key={task.taskID}
                task={task}
                onEdit={() => setSelectedTask(task)}
                onCategoryClick={handleCategoryClick}
                onPriorityClick={handlePriorityClick}
                onRecurringClick={handleRecurringClick}
              />
            ))
          ) : (
            <p>No tasks with this label.</p>
          )}
        </Modal.Body>
      </Modal>

      <CreateTaskButton />
      <CategoryManagerButton />
    </Container>
  );
};

export default Tasks;
