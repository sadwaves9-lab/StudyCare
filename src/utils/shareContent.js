import { Share, Alert, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';

function stripMarkdown(text) {
  return String(text || '')
    .replace(/## /g, '■ ')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .trim();
}

export async function shareNote(note) {
  if (!note) return false;
  const text =
    `📖 ${note.title}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `${note.subject ? `Subject: ${note.subject}\n` : ''}` +
    `${note.chapter ? `Chapter: ${note.chapter}\n` : ''}` +
    `${note.class ? `Class: ${note.class}\n` : ''}` +
    `\n${stripMarkdown(note.body)}\n\n` +
    `— via StudyCare`;

  try {
    await Share.share({
      message: text,
      title: note.title,
    });
    return true;
  } catch (e) {
    return false;
  }
}

export async function copyNote(note) {
  if (!note) return false;
  const text = `📖 ${note.title}\n\n${stripMarkdown(note.body)}`;
  await Clipboard.setStringAsync(text);
  return true;
}

export async function shareQuestion(q) {
  if (!q) return false;
  const options = (q.options || [])
    .map((o, i) => `${'ABCD'[i]}. ${o}`)
    .join('\n');
  const text =
    `❓ ${q.question}\n\n` +
    `${options}\n\n` +
    `✅ Answer: ${q.answer}\n` +
    `${q.explanation ? `\n💡 ${q.explanation}\n` : ''}\n` +
    `— via StudyCare`;
  try {
    await Share.share({ message: text });
    return true;
  } catch {
    return false;
  }
}

export async function copyQuestion(q) {
  if (!q) return false;
  const options = (q.options || []).map((o, i) => `${'ABCD'[i]}. ${o}`).join('\n');
  const text = `❓ ${q.question}\n\n${options}\n\n✅ Answer: ${q.answer}`;
  await Clipboard.setStringAsync(text);
  return true;
}

export async function shareTestResult({ testName, pct, correct, total, timeTaken }) {
  const mm = Math.floor((timeTaken || 0) / 60);
  const ss = (timeTaken || 0) % 60;
  const text =
    `🎯 ${testName || 'Test'} Result\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `Score: ${pct}%\n` +
    `Correct: ${correct}/${total}\n` +
    `Time: ${mm}m ${ss}s\n\n` +
    `— via StudyCare`;
  try {
    await Share.share({ message: text });
    return true;
  } catch {
    return false;
  }
}

export function showShareSuccess() {
  if (Platform.OS === 'android') return;
  Alert.alert('Ho gaya ✅', 'Content copy ho gaya / share ho gaya.');
}

export default {
  shareNote, copyNote,
  shareQuestion, copyQuestion,
  shareTestResult,
};
