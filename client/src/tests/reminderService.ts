import { describe, it, expect } from 'vitest';
import { saveReminderSetting, shouldTriggerReminder } from '../services/reminderService';

describe('Reminder Service', () => {
  it('should save the reminder offset in the task', () => {
    const task = { taskName: 'Test', dueDate: '2025-06-04T10:00:00Z' };
    const updated = saveReminderSetting(task, 5);
    expect(updated.reminderOffsetMinutes).toBe(5);
  });

  
});








/*it('should return true if current time is within reminder window', () => {
    const taskTime = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 min from now
    const now = new Date().toISOString();
    const result = shouldTriggerReminder(taskTime, 5, now);
    expect(result).toBe(true);
  });

  it('should return false if current time is too early', () => {
    const taskTime = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min from now
    const now = new Date().toISOString();
    const result = shouldTriggerReminder(taskTime, 5, now);
    expect(result).toBe(false);
  }); */