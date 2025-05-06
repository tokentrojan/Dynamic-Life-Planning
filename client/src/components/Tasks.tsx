import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { Task, Priority } from "../types/Task3";
import { Card, Badge, Form, Button, Alert } from "react-bootstrap";
import CreateTask from "./createTask";

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);

  const handleCreateTask = (newTask: Task) => {
    console.log("New Task Created:", newTask);
    setTasks([...tasks, newTask]);

    setShowForm(false);
  };

  return (
    <div className="text-end">
      <button
        className="btn btn-primary"
        onClick={() =>
          showForm === false ? setShowForm(true) : setShowForm(false)
        }
      >
        Creat Task
      </button>

      {showForm && <CreateTask onCreatTask={handleCreateTask}></CreateTask>}
    </div>
  );
}

export default Tasks;
