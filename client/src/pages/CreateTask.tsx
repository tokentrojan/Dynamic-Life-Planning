import { useState } from "react"; // for managing form input state
import { Form, Button, Container } from "react-bootstrap"; // UI components
import { useNavigate } from "react-router-dom"; // routes for navigation redirects
import { db } from "../firebase"; // firebase firestore tools for saving data
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../AuthContext"; // porvides current User
import { v4 as uuid } from "uuid"; // generates unique taskID for each task
import InstallButton from "../components/InstallButton";

function CreateTask() {
  const { currentUser } = useAuth();
  const userID = currentUser?.uid || localStorage.getItem("cachedUID");

  const navigate = useNavigate(); //for redirection

  /**Form State variables for user input**/
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [duration, setDuration] = useState<number | "">("");
  const [recurring, setRecurring] = useState(false);
  const [recurringDay, setRecurringDay] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("uuid:", uuid);
    e.preventDefault();
    if (!userID) return;

    const taskID = uuid();

    const newTask = {
      userID,
      taskID,
      taskName,
      taskDescription,
      dueDate,
      completed: false,
      ...(priority && { priority }),
      ...(duration && { duration: Number(duration) }),
      ...(recurring && { recurring: true, recurringDay }),
    };

    const taskRef = doc(db, "users", userID, "tasks", taskID);
    await setDoc(taskRef, newTask);

    navigate("/sorted"); // Redirect after creation
  };

  return (
    <Container className="mt-4" style={{ maxWidth: 600 }}>
      <h2>Create New Task</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Task Name *</Form.Label>
          <Form.Control
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
        </Form.Group>

        <InstallButton></InstallButton>

        <Form.Group className="mb-3">
          <Form.Label>Task Description *</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Due Date & Time *</Form.Label>
          <Form.Control
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Priority</Form.Label>
          <Form.Select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="">-- None --</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Duration (minutes)</Form.Label>
          <Form.Control
            type="number"
            value={duration}
            onChange={(e) =>
              setDuration(e.target.value === "" ? "" : Number(e.target.value))
            }
            min={1}
          />
        </Form.Group>

        <Form.Check
          type="checkbox"
          label="Recurring"
          checked={recurring}
          onChange={(e) => setRecurring(e.target.checked)}
        />

        {recurring && (
          <Form.Group className="mb-3 mt-2">
            <Form.Label>Recurring Day</Form.Label>
            <Form.Select
              value={recurringDay}
              onChange={(e) => setRecurringDay(e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </Form.Select>
          </Form.Group>
        )}

        <Button variant="primary" type="submit">
          Create Task
        </Button>
      </Form>
    </Container>
  );
}

export default CreateTask;
