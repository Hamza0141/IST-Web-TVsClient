export function getNextPrayer(prayers) {
  if (!Array.isArray(prayers) || prayers.length === 0) return null;

  const now = new Date();

  for (const prayer of prayers) {
    if (!prayer?.adhan_time) continue;

    const [h, m] = prayer.adhan_time.split(':').map(Number);
    const prayerDate = new Date();
    prayerDate.setHours(h, m, 0, 0);

    if (prayerDate > now) {
      return {
        ...prayer,
        prayerDate,
      };
    }
  }

  const firstPrayer = prayers.find((item) => item?.adhan_time);
  if (!firstPrayer) return null;

  const [h, m] = firstPrayer.adhan_time.split(':').map(Number);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(h, m, 0, 0);

  return {
    ...firstPrayer,
    prayerDate: tomorrow,
  };
}

export function getCountdown(targetDate) {
  if (!targetDate) return '--';

  const diff = targetDate.getTime() - Date.now();
  if (diff <= 0) return 'Now';

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}