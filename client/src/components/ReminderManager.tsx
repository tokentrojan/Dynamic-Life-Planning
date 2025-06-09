import { useEffect, useRef, useState } from "react";
import { Task } from "../types/Task"; // Update if your Task type is in a different file

interface ReminderManagerProps {
  tasks: Task[];
}

// This component runs in the background to check if any task reminders need to be triggered.
export const ReminderManager: React.FC<ReminderManagerProps> = ({ tasks }) => {
  // Keep track of which task IDs have already triggered a reminder during this session
  const remindedTaskIDs = useRef<Set<string>>(new Set());
  const [visibleReminders, setVisibleReminders] = useState<Task[]>([]);

  useEffect(() => {
    // Ask the user for permission to show system notifications, if not already granted
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission !== "granted") {
          alert("Please allow notifications to receive task reminders.");
        }
      });
    }

    // Check for due tasks once every 60 seconds
    const interval = setInterval(() => {
      const now = new Date();

      tasks.forEach((task) => {
        // Determine the time when the reminder should trigger
        const taskTime = new Date(task.doDate ?? task.dueDate);
        const offsetMinutes = task.reminderOffsetMinutes ?? 5; // Default to 5 minutes if not set
        const reminderTime = new Date(taskTime.getTime() - offsetMinutes * 60000);
        const timeDiff = now.getTime() - reminderTime.getTime();

        // Check if the reminder for this task has already been triggered
        const alreadyReminded = remindedTaskIDs.current.has(task.taskID);

        // If the current time is within 1 minute of the reminder time and it hasn't been triggered yet
        if (timeDiff >= 0 && timeDiff < 60000 && !alreadyReminded) {
          // Show a browser notification if permission is granted
          if (Notification.permission === "granted") {
            new Notification("Task Reminder", {
              body: `"${task.taskName}" is due in ${offsetMinutes} minutes.`,
              icon: "/icons/reminder-icon.png", // Optional: replace with your own icon
            });
          }

          // Play a reminder sound from the public folder
          new Audio("/reminder.wav").play().catch(console.error);

          // Mark this task as reminded to prevent repeated notifications
          remindedTaskIDs.current.add(task.taskID);

          // Add to visible reminders
          setVisibleReminders((prev) => [...prev, task]);
        }
      });
    }, 60000); // Run the check every minute

    // Cleanup the interval timer when the component is unmounted
    return () => clearInterval(interval);
  }, [tasks]);

  // serves to dismiss reminder when finished viewing
  const dismissReminder = (taskID: string) => {
    setVisibleReminders((prev) => prev.filter((task) => task.taskID !== taskID));
  };

  // This component does not render anything visually
  return (
    <>
      {visibleReminders.map((task) => (
        <div
          key={task.taskID}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "#333",
            color: "#fff",
            padding: "12px 18px",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.4)",
            marginTop: "10px",
            zIndex: 9999,
            minWidth: "250px",
          }}
        >
          <strong>Reminder</strong>
          <div style={{ marginTop: "4px" }}>{task.taskName} is due soon!</div>
          <button
            onClick={() => dismissReminder(task.taskID)}
            style={{
              marginTop: "8px",
              background: "#555",
              color: "#fff",
              border: "none",
              padding: "4px 8px",
              cursor: "pointer",
              borderRadius: "4px",
              float: "right",
            }}
          >
            Dismiss
          </button>
        </div>
      ))}
    </>
  );
};