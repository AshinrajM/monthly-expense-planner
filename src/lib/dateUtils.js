export const getCurrentMonthString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export const formatMonthString = (monthStr) => {
  if (!monthStr) return '';
  const [year, month] = monthStr.split('-');
  const date = new Date(year, parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export const addMonths = (monthStr, count) => {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1 + count);
  const newYear = date.getFullYear();
  const newMonth = String(date.getMonth() + 1).padStart(2, '0');
  return `${newYear}-${newMonth}`;
};

export const getSurroundingMonths = (currentMonthStr, pastCount = 6, futureCount = 5) => {
  const months = [];
  for (let i = -pastCount; i <= futureCount; i++) {
    months.push(addMonths(currentMonthStr, i));
  }
  return months;
};

export const parseMonthStr = (monthStr) => {
  const [year, month] = monthStr.split('-');
  return { year: parseInt(year), month: parseInt(month) };
};

export const isMonthInRange = (targetMonthStr, startMonthStr, durationMonths) => {
  if (!targetMonthStr || !startMonthStr) return true;
  const target = parseMonthStr(targetMonthStr);
  const start = parseMonthStr(startMonthStr);
  const targetAbsolute = target.year * 12 + target.month;
  const startAbsolute = start.year * 12 + start.month;

  const duration = parseInt(durationMonths);
  if (isNaN(duration) || duration <= 0 || duration >= 999) {
    return targetAbsolute >= startAbsolute;
  }
  
  return targetAbsolute >= startAbsolute && targetAbsolute < (startAbsolute + duration);
};
