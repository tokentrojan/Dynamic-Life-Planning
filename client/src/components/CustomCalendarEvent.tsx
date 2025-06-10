import React from "react";
import { Task } from "../types/Task";
import { BsFlagFill } from "react-icons/bs";

// Category background colors
const categoryColorMap: Record<string, string> = {
  cat1: "#dc3545", // Red
  cat2: "#0d6efd", // Blue
  cat3: "#198754", // Green
  cat4: "#ffc107", // Yellow
  cat5: "#6c757d", // Grey
  cat6: "#000000", // Black
};

const getPriorityColor = (priority?: string): string => {
  switch (priority) {
    case "high":
      return "red";
    case "medium":
      return "orange";
    case "low":
      return "lightgreen";
    default:
      return "gray";
  }
};

type Props = {
  event: Task;
};

const CustomCalendarEvent: React.FC<Props> = ({ event }) => {
  const categoryBg = categoryColorMap[event.colour ?? ""] || "#6c757d";
  

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        borderLeft: `6px solid ${categoryBg}`,
        padding: "4px 6px",
        fontSize: "0.85rem",
        fontWeight: 600,
        height: "100%",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        backgroundColor: "#ffff",
        borderRadius: "4px",
        color: categoryBg,
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
      <span style={{ textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis" }}>
        {event.taskName}
      </span>
    </div>
  );
};

export default CustomCalendarEvent;