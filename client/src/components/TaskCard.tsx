import React from 'react';
import { Task } from '../types/Task'; // Adjust import path as needed

type TaskCardProps = {
  task: Task;
  onPriorityClick?: (priority: string) => void;
  onEditClick?: () => void;
  onCompleteToggle?: (completed: boolean) => void;
};

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPriorityClick,
  onEditClick,
  onCompleteToggle,
}) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title">{task.taskName}</h5>
          {onEditClick && (
            <button className="btn btn-sm btn-outline-secondary" onClick={onEditClick}>
              Edit
            </button>
          )}
        </div>
        <p className="card-text">{task.taskDescription}</p>

        <div className="d-flex flex-wrap gap-2 align-items-center">
          {/* Priority Badge (Clickable) */}
          {task.priority && (
            <span
              className="badge bg-primary text-light cursor-pointer"
              style={{ cursor: 'pointer' }}
              onClick={() => onPriorityClick?.(task.priority!)}
              title="Click to filter by this priority"
            >
              {task.priority}
            </span>
          )}

          {/* Colour Badge */}
          {task.colour && (
            <span className={`badge bg-${task.colour}`}>{task.colour}</span>
          )}

          {/* Recurring Badge */}
          {task.recurring && task.recurringDay && (
            <span className="badge bg-info text-dark">
              Recurs: {task.recurringDay}
            </span>
          )}

          {/* Completed Badge */}
          {task.completed && (
            <span className="badge bg-success">Completed</span>
          )}

          {/* Completion Toggle */}
          {typeof task.completed === 'boolean' && onCompleteToggle && (
            <div className="form-check ms-auto">
              <input
                className="form-check-input"
                type="checkbox"
                checked={task.completed}
                onChange={(e) => onCompleteToggle(e.target.checked)}
              />
              <label className="form-check-label">Done</label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
