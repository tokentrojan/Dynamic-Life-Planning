import { Container } from "react-bootstrap";
import { useTasks } from "../data/firebasetasks"; //added this instead of querying the db separately
import TaskCard from "../components/TaskCard";
import { useState } from "react";
import TaskModal from "../components/TaskModal";
import { Task } from "../types/Task";

const CompletedTasks = () => {
  const tasks = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <Container className="mt-4">
      <h2>Completed Tasks</h2>

      {completedTasks.length === 0 ? (
        <p>No completed tasks.</p>
      ) : (
        completedTasks.map((task) => (
          <div
            key={task.taskID}
            onClick={() => setSelectedTask(task)}
            style={{ cursor: "pointer" }}
          >
            <TaskCard task={task} />
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

export default CompletedTasks;
