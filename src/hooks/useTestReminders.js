import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { scheduleTestReminder, requestPermissions } from '../services/notificationService';

export function useTestReminders() {
  const tests = useSelector((s) => s.content.tests);
  const notifications = useSelector((s) => s.settings.notifications);
  const scheduled = useRef(new Set());

  useEffect(() => {
    (async () => {
      if (!notifications.master || !notifications.tests?.enabled) return;

      const granted = await requestPermissions();
      if (!granted) return;

      const upcoming = tests.filter((t) => {
        const when = new Date(`${t.date}T${t.time}:00`);
        return when > new Date() && !scheduled.current.has(t.id);
      });

      for (const t of upcoming) {
        const id = await scheduleTestReminder(
          t,
          notifications.tests.reminderBefore || 60
        );
        if (id) {
          scheduled.current.add(t.id);
          console.log(`[reminder] scheduled for ${t.name}`);
        }
      }
    })();
  }, [tests, notifications]);
}

export default useTestReminders;
