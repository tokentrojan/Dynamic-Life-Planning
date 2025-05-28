import { Container, Form } from "react-bootstrap";
import { useTasks } from "../data/firebasetasks";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal"; // new
import { Task } from "../types/Task"; // new
import { useState } from "react"; // new

const SortedTasks = () => {
  const tasks = useTasks();
  const [sortMethod, setSortMethod] = useState<"priority" | "dueDate">(
    "priority"
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // new

  const sortedTasks = tasks
    .filter((task) => !!task.priority && !task.completed)
    .sort((a, b) => {
      if (sortMethod === "priority") {
        const order = { high: 1, medium: 2, low: 3 };
        return (order[a.priority!] ?? 4) - (order[b.priority!] ?? 4);
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  return (
    <Container className="mt-4">
      <h2 className="mb-3">Sorted Tasks</h2>

      <Form.Group controlId="sortMethod" className="mb-3">
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

      {sortedTasks.length === 0 ? (
        <p>No sorted tasks found.</p>
      ) : (
        sortedTasks.map((task) => (
          <div
            key={task.taskID}
            onClick={() => setSelectedTask(task)}
            style={{ cursor: "pointer" }}
          >
            <TaskCard
              task={task}
              onEdit={() => setSelectedTask(task)}
            ></TaskCard>
          </div>
        ))
      )}

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          show={true}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </Container>
  );
};

export default SortedTasks;
