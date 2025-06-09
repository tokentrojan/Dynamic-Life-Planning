import React from "react";
import { Task } from "../types/Task";
import { BsFlagFill } from "react-icons/bs";

// Maps internal category keys (cat1…cat6) to Bootstrap theme colors.
const categoryColorMap: Record<string, string> = {
  cat1: "#dc3545", // Red
  cat2: "#0d6efd", // Blue
  cat3: "#198754", // Green
  cat4: "#ffc107", // Yellow
  cat5: "#6c757d", // Grey
  cat6: "#000000", // Black
};

// Priority colors for flag icon
const getPriorityColor = (priority?: string): string => {
  switch (priority) {
    case "high":
      return "red";
    case "medium":
      return "orange";
    case "low":
      return "green";
    default:
      return "gray";
  }
};

type Props = {
  event: Task;
};

const CustomCalendarEvent: React.FC<Props> = ({ event }) => {
  const categoryBorder = categoryColorMap[event.colour ?? ""] || "#dee2e6"; // fallback to light grey

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        borderLeft: `4px solid ${categoryBorder}`,
        padding: "4px 6px",
        fontSize: "0.85rem",
        height: "100%", // Makes vertical height match duration
        overflow: "hidden",
        backgroundColor: "white",
        borderRadius: "4px",
      }}
    >
      {event.priority && (
        <BsFlagFill
          style={{
            color: getPriorityColor(event.priority),
            marginRight: "6px",
            fontSize: "1rem",
            flexShrink: 0,
          }}
        />
      )}
      <span style={{ fontWeight: 600, textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {event.taskName}
      </span>
    </div>
  );
};

export default CustomCalendarEvent;