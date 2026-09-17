import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestPermissions() {
  if (!Device.isDevice) return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  let final = existing;
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    final = status;
  }
  if (final !== 'granted') return false;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('tests', {
      name: 'Test Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6C5CE7',
    });
    await Notifications.setNotificationChannelAsync('general', {
      name: 'General',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
    await Notifications.setNotificationChannelAsync('daily', {
      name: 'Daily Study',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }
  return true;
}

export async function scheduleTestReminder(test, minutesBefore = 60) {
  const when = new Date(`${test.date}T${test.time}:00`);
  const triggerTime = new Date(when.getTime() - minutesBefore * 60 * 1000);
  if (triggerTime <= new Date()) return null;
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `📝 Test in ${minutesBefore} min`,
        body: `${test.name} (${test.subject}) — ${test.time}`,
        data: { testId: test.id },
        sound: true,
        channelId: 'tests',
      },
      trigger: { date: triggerTime },
    });
    return id;
  } catch (e) {
    return null;
  }
}

export async function scheduleDailyStudyReminder(hour = 19, minute = 0) {
  try {
    await Notifications.cancelScheduledNotificationAsync('daily-study').catch(() => {});
    const id = await Notifications.scheduleNotificationAsync({
      identifier: 'daily-study',
      content: {
        title: '📚 Padhai ka time!',
        body: 'Aaj ka goal complete karo. Streak banaye rakho! 🔥',
        sound: true,
        channelId: 'daily',
      },
      trigger: { hour, minute, repeats: true },
    });
    return id;
  } catch (e) {
    console.warn('daily reminder failed:', e);
    return null;
  }
}

export async function cancelDailyReminder() {
  try {
    await Notifications.cancelScheduledNotificationAsync('daily-study');
  } catch {}
}

export async function notifyNewContent(kind, count) {
  if (count <= 0) return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: kind === 'notes' ? '📖 New Notes' : '❓ New Questions',
      body: `${count} naye ${kind} add hue. Padhne chalo!`,
      sound: true,
      channelId: 'general',
    },
    trigger: null,
  });
}

export async function cancelAll() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
