import { useState } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enAU } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Container } from 'react-bootstrap';
import { sampleTasks } from '../data/sampleTasks';
import { Task } from '../types/Task';

// Setup for date-fns
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'en-AU': enAU },
});

// Calendar display format
type TaskEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  priority?: string;
};

const Planner = () => {
  const convertTasksToEvents = (tasks: Task[]): TaskEvent[] =>
    tasks.map((task) => {
      const start = new Date(task.dueDate);
      const end = new Date(start.getTime() + (task.duration ?? 30) * 60000);
      return {
        id: task.taskID,
        title: task.taskName,
        start,
        end,
        priority: task.priority,
      };
    });

  const [events] = useState<TaskEvent[]>(convertTasksToEvents(sampleTasks));

  return (
    <Container className="mt-4">
      <h2 className="mb-3">Planner View</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={[Views.DAY, Views.WEEK, Views.MONTH]}
        defaultView={Views.WEEK}
        style={{ height: 600 }}
      />
    </Container>
  );
};

export default Planner;