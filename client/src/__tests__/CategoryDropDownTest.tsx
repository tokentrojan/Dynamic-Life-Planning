import { render, screen } from "@testing-library/react";
import TaskModal from "../components/TaskModal";
import { Task } from "../types/Task";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

const mockTask: Task = {
  taskID: "1",
  taskName: "Test Task",
  taskDescription: "Just a test",
  dueDate: new Date().toISOString(),
  completed: false,
  userID: "test-user",
};

test("selecting a category updates the selected value", async () => {
  render(
    <TaskModal show={true} onClose={() => {}} task={mockTask} parentID={null} />
  );

  const select = screen.getByLabelText(/category/i);
  await userEvent.selectOptions(select, "cat2");

  expect((select as HTMLSelectElement).value).toBe("cat2");
});

test("shows selected category badge after saving", () => {
  const savedTask: Task = {
    ...mockTask,
    colour: "cat3", // Green
  };

  render(
    <TaskModal
      show={true}
      onClose={() => {}}
      task={savedTask}
      parentID={null}
    />
  );

  const badge = screen.getByText(/green/i);
  expect(badge).toBeInTheDocument();
});

/*
Stage one

## ✅ TDD Step 1 — RED Phase

**Test Name:** renders category dropdown with options  
**Test File:** `src/__tests__/CategoryDropDownTest.tsx`  
**Test Code:**
```tsx
render(<TaskModal show={true} onClose={() => {}} />);
const select = screen.getByLabelText(/category/i);
expect(select).toBeInTheDocument();


*/
