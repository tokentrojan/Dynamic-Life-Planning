import { Container, Form, Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { useTasks } from "../data/firebasetasks";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import { Task } from "../types/Task";
import CreateTaskButton from "../components/CreateTaskButton";
import CategoryManagerButton from "../components/CategoryManagerButton";
import { ButtonGroup, ToggleButton } from "react-bootstrap";

const Tasks = () => {
  const tasks = useTasks();

  // Filter state
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

  const clearAllFilters = () => {
    setFilters({ sorted: true, unsorted: true, completed: false });
    setLabelFilter({});
    setShowLabelFilterModal(false);
    // Optionally reset sort too:
    setSortField("dueDate");
    setSortOrderAsc(true);
  };

  const shownTasks = tasks.filter((task) => {
    return (
      (!labelFilter.colour || task.colour === labelFilter.colour) &&
      (!labelFilter.priority || task.priority === labelFilter.priority) &&
      (!labelFilter.recurringDay ||
        task.recurringDay === labelFilter.recurringDay)
    );
  });

  // Sorting state
  const [sortField, setSortField] = useState<
    "priority" | "dueDate" | "doDate" | "duration" | "colour" | "completedDate"
  >("dueDate");
  const [sortOrderAsc, setSortOrderAsc] = useState(true);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [creatingSubtaskFor, setCreatingSubtaskFor] = useState<string | null>(
    null
  );

  const handleAddSubtask = (parentID: string) => {
    setCreatingSubtaskFor(parentID);
    setSelectedTask(null); // open modal in "create" mode
  };

  const handleFilterToggle = (key: keyof typeof filters) => {
    setFilters((prev) => {
      if (key === "completed") {
        const newCompleted = !prev.completed;
        return {
          sorted: !newCompleted,
          unsorted: !newCompleted,
          completed: newCompleted,
        };
      }

      // If sorted or unsorted are toggled, disable completed
      return {
        ...prev,
        [key]: !prev[key],
        completed: false,
      };
    });
  };
  const isSorted = (task: Task) => task.priority && !task.completed;
  const isUnsorted = (task: Task) => !task.priority && !task.completed;
  const isCompleted = (task: Task) => task.completed;

  const filteredTasks = tasks.filter((task) => { //changed to return the tasks including parent (and child) tasks of completed tasks. 
    const matchesFilters =
      (filters.sorted && isSorted(task)) ||
      (filters.unsorted && isUnsorted(task)) ||
      (filters.completed && isCompleted(task));

    const isParentOfVisibleSubtask = tasks.some(
      (t) => t.parentID === task.taskID && (
        (filters.sorted && isSorted(t)) ||
        (filters.unsorted && isUnsorted(t)) ||
        (filters.completed && isCompleted(t))
      )
    );
    return matchesFilters || isParentOfVisibleSubtask;
  });

  // Apply sorting based on selected field and order
  const getSortedTasks = () => {
    const sorted = [...filteredTasks].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      // Handle missing values
      if (aVal === undefined) return 1;
      if (bVal === undefined) return -1;

      // Handle special cases
      if (sortField === "priority") {
        const map: Record<string, number> = { high: 3, medium: 2, low: 1 };
        aVal = map[aVal] || 0;
        bVal = map[bVal] || 0;
      }

      if (sortField === "doDate") {
        aVal = a.doDate
          ? new Date(a.doDate).getTime()
          : new Date(a.dueDate).getTime();
        bVal = b.doDate
          ? new Date(b.doDate).getTime()
          : new Date(b.dueDate).getTime();
      } else if (sortField === "dueDate") {
        aVal = new Date(a.dueDate).getTime();
        bVal = new Date(b.dueDate).getTime();
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrderAsc
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (sortField === "completedDate") {
        aVal = a.completedDate ? new Date(a.completedDate).getTime() : 0;
        bVal = b.completedDate ? new Date(b.completedDate).getTime() : 0;
      }

      return sortOrderAsc ? aVal - bVal : bVal - aVal;
    });

    return sorted;
  };

  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>(
    {}
  );
  const toggleExpanded = (taskID: string) => {
    setExpandedTasks((prev) => {
      const newState = {
        ...prev,
        [taskID]: !prev[taskID],
      };
      return newState;
    });
  };

  const renderTaskWithSubtasks = (task: Task, level = 0) => {
    const subtasks = filteredTasks.filter((t) => t.parentID === task.taskID);
    const isExpanded = expandedTasks[task.taskID] ?? false;
    const hasSubtasks = subtasks.length > 0; //true if there are subtasks

    return (
      <div
        key={task.taskID}
        style={{
          paddingLeft: level * 20,
          marginBottom: level === 0 ? 20 : 0, // Space only between top-level tasks
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{ flex: 1, cursor: "pointer" }}
            onClick={() => setSelectedTask(task)}
          >
            <TaskCard
              task={task}
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
        {isExpanded &&
          subtasks.map((subtask) => renderTaskWithSubtasks(subtask, level + 1))}
      </div>
    );
  };

  return (
    <Container className="mt-4">
      <h2 
        className="mb-3"
        style={{
          textAlign: "center",
        }} >Tasks</h2>

      {/* Filter checkboxes */}
      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
        <ButtonGroup>
          {["Sorted", "Unsorted", "Completed"].map((label, idx) => {
            const key = label.toLowerCase() as keyof typeof filters;
            return (
              <ToggleButton
                key={idx}
                id={`filter-${key}`}
                type="checkbox"
                variant={filters[key] ? "primary" : "outline-primary"}
                checked={filters[key]}
                value={label}
                onChange={() => handleFilterToggle(key)}
              >
                {label}
              </ToggleButton>
            );
          })}
        </ButtonGroup>

        <Button
          variant="outline-danger"
          onClick={clearAllFilters}
          size="sm"
          className="ms-auto"
        >
          Clear Filters
        </Button>
      </div>

      {/* Sort field and order controls */}
      <div className="d-flex flex-wrap align-items-center gap-6 mb-5">
        <Form.Label className="mb-0 me-2 fw-semibold">Sort By:</Form.Label>

        <Form.Select
          value={sortField}
          onChange={(e) => setSortField(e.target.value as any)}
          size="sm"
          style={{ width: "200px" }}
        >
          <option value="priority">🚩 Priority</option>
          <option value="dueDate">📅 Due Date</option>
          <option value="doDate">⏰ Do Date</option>
          <option value="duration">⏳ Duration</option>
          <option value="colour">🎨 Colour</option>
          {filters.completed && (
            <option value="completedDate">Completed Date</option>
          )}
        </Form.Select>

        <Button
          variant="outline-secondary"
          onClick={() => setSortOrderAsc(!sortOrderAsc)}
          size="sm"
        >
          {sortOrderAsc ? "⬆ Asc" : "⬇ Desc"}
        </Button>
      </div>

      {/* Render tasks */}
      {getSortedTasks().filter((task) => !task.parentID).length === 0 ? ( // only top-level tasks
        <p>No tasks match the selected filters.</p>
      ) : (
        getSortedTasks()
          .filter((task) => !task.parentID)
          .map((task) => renderTaskWithSubtasks(task))
      )}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          show={true}
          onClose={() => setSelectedTask(null)}
        />
      )}
      {/* Subtask creation modal */}
      {creatingSubtaskFor && (
        <TaskModal
          parentID={creatingSubtaskFor} // Pass the parent task ID
          show={true}
          onClose={() => setCreatingSubtaskFor(null)}
        />
      )}

      {/* Filtered label modal */}
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
