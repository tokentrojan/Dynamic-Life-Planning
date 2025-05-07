import { useState } from 'react';
import { Calendar, dateFnsLocalizer, Views, View } from 'react-big-calendar'; //added View import to try and fix bug
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enAU } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Container } from 'react-bootstrap';
import { useTasks } from '../data/firebasetasks';

// Setup for date-fns
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'en-AU': enAU },
});

// Calendar display format, this is the simplified version for calendar view.
type TaskEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  priority?: string;
};

const Planner = () => {
  const tasks = useTasks(); // ✅ call the hook at the top level
  const [view, setView] = useState<View>(Views.WEEK);
  const [date, setDate] = useState(new Date());

  const events: TaskEvent[] = tasks.map((task) => {
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

  return (
    <Container className="mt-4">
      <h2 className="mb-3">Planner View</h2>
      <Calendar
        localizer={localizer}
        events={events} 
        date = {date}         //controls current visible date
        onNavigate={setDate}  // updates when user clicks "Today", "Back" or "Next"
        startAccessor="start"
        endAccessor="end"
        views={[Views.DAY, Views.WEEK, Views.MONTH]}
        view={view}       // control view state
        onView={setView}  //update when changed
        style={{ height: 600 }}
      />
    </Container>
  );
};

export default Planner;