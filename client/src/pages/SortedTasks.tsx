import { Container, DropdownButton, Dropdown } from 'react-bootstrap';
import { useState } from 'react';
import TaskCard from '../components/TaskCard';
import { useTasks } from '../data/firebasetasks'; 

const SortedTasks = () => {
  // Get tasks using the useTasks hook
  const tasks = useTasks(); // This will return an array of tasks from Firestore

  // State for sorting option (dueDate or priority)
  const [sortOption, setSortOption] = useState<'dueDate' | 'priority'>('dueDate');

  // Function to handle sorting based on the selected option
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortOption === 'priority') {
      // Sort by priority
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      const pA = priorityOrder[a.priority ?? 'low'];
      const pB = priorityOrder[b.priority ?? 'low'];
      return pA - pB;
    }

    // Default: Sort by due date
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <Container className="mt-4">
      <h2 className="mb-3">Sorted Tasks</h2>

      {/* Dropdown to select sort option */}
      <DropdownButton
        id="sortDropdown"
        title={`Sort by: ${sortOption === 'dueDate' ? 'Due Date' : 'Priority'}`}
        onSelect={(selected) => setSortOption(selected as 'dueDate' | 'priority')}
        className="mb-3">
        <Dropdown.Item eventKey="dueDate">Due Date</Dropdown.Item>
        <Dropdown.Item eventKey="priority">Priority</Dropdown.Item>
      </DropdownButton>

      {/* Render the sorted tasks */}
      {sortedTasks.map((task) => (
        <TaskCard key={task.taskID} task={task} />
      ))}
    </Container>
  );
};

export default SortedTasks;
