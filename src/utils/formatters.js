export function formatTime(timeString) {
  if (!timeString) return '--:--';

  const [hourStr, minute] = String(timeString).split(':');
  let hour = Number(hourStr);

  const suffix = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;

  return `${hour}:${minute} ${suffix}`;
}

export function formatClock(date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);
}

export function formatDateTime(value) {
  if (!value) return '--';
  return new Date(value).toLocaleString();
}