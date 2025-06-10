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

// Determine if light or dark text should be used
const getContrastingTextColor = (bgColor: string) => {
  const hex = bgColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150 ? "#212529" : "#ffffff";
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
  const categoryBg = categoryColorMap[event.colour ?? ""] || "#dee2e6";
  const textColor = getContrastingTextColor(categoryBg);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "4px 6px",
        fontSize: "0.85rem",
        fontWeight: 600,
        height: "100%",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        backgroundColor: categoryBg,
        borderRadius: "4px",
        color: textColor,
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