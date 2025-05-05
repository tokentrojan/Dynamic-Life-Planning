import { useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format } from 'date-fns';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { enAU } from 'date-fns/locale'; // For dd/mm/yyyy style
import { Container } from 'react-bootstrap';
import { sampleTasks } from '../data/sampleTasks';
import { Task } from '../types/Task';

// Setup for date-fns localization (dd/mm/yyyy)
const locales = { 'en-AU': enAU };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Task type used for calendar events
type TaskEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  priority: 'low' | 'medium' | 'high';
};



// Custom task display inside calendar
const EventCard = ({ event }: { event: TaskEvent }) => {
  // Returns the Bootstrap badge class based on priority
  const getBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  // Display short info inside the calendar block
  return (
    <div className="p-1">
      <strong>{event.title}</strong>
      <br />
      <span className={`badge bg-${getBadgeColor(event.priority)}`}>
        {event.priority}
      </span>
    </div>
  );
};

// Main Planner Component
function Planner() {
  const convertTasksToEvents = (tasks: Task[]): TaskEvent[] => {
    return tasks.map(task => {
      const start = new Date(task.dueDate);
      const end = new Date(start.getTime() + task.duration * 60000); // add duration in minutes
      return {
        id: task.id,
        title: task.title,
        start,
        end,
        priority: task.priority,
      };
    });
  };
  
  const [events] = useState<TaskEvent[]>(convertTasksToEvents(sampleTasks));

  return (
    <Container className = "mt-4">
      <h2 className="mb-3">Planner View</h2>

      <Calendar
        localizer={localizer}             // Formats date and time
        events={events}                   // Your tasks go here
        startAccessor="start"             // Field used for start time
        endAccessor="end"                 // Field used for end time
        views={[Views.DAY, Views.WEEK, Views.MONTH]} // Toggle between views
        //defaultView={Views.DAY}          // Start on week view
        style={{ height: 600 }}           // Height of the calendar
        components={{
          event: EventCard               // Custom renderer for each task
        }}
      />
    </Container>
  );
}

export default Planner;