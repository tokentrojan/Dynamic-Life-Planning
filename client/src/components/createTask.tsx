import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { Task, Priority } from "../types/Task3";
import { Card, Badge, Form, Button, Alert } from "react-bootstrap";

interface Props {
  onCreatTask: (task: Task) => void;
}

function CreateTask({ onCreatTask }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [duration, setDuration] = useState(0);
  const [priority, setPriority] = useState("low");
  const [error, setError] = useState("");

  const priorityList = ["low", "medium", "high"];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !dueDate || !duration) {
      setError("Please fill in all required fields.");
      return;
    }

    const newTask: Task = {
      title,
      description,
      dueDate,
      duration,
      priority: priority as Priority,
    };

    onCreatTask(newTask);

    setError(""); // clear error after successful creation

    setTitle("");
    setDescription("");
    setDueDate("");
    setDuration(0);
    setPriority("low");
  };

  return (
    <Card
      className="p-4 rounded-4 shadow-sm"
      style={{ maxWidth: "500px", margin: "0 auto" }}
    >
      <Card.Title className="mb-3 text-center">Create Task</Card.Title>
      <Form onSubmit={handleSubmit}>
        {error && <div className="text-danger mb-3">{error}</div>}

        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Control
            type="number"
            placeholder="Duration (in minutes)"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </Form.Group>

        <h5>Priority</h5>
        {priorityList.map((p) => (
          <button
            key={p}
            type="button"
            className={
              priority === p
                ? "btn btn-primary m-1"
                : "btn btn-outline-primary m-1"
            }
            onClick={() => setPriority(p as Priority)}
          >
            {p.toUpperCase()}
          </button>
        ))}
        <Button type="submit" className="w-100" variant="primary">
          Create Task
        </Button>
      </Form>
    </Card>
  );
}

export default CreateTask;
