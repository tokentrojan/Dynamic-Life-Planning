export function saveReminderSetting(task: any, minutesBefore: number): any {
  return { ...task, reminderOffsetMinutes: minutesBefore };
}

export function shouldTriggerReminder(
  taskDate: string,
  reminderOffsetMinutes: number,
  currentTime: string
): boolean {
  const taskTime = new Date(taskDate).getTime();
  const now = new Date(currentTime).getTime();
  const reminderTime = taskTime - reminderOffsetMinutes * 60 * 1000;
  return now >= reminderTime && now < taskTime;
}









