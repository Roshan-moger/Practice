// components/ExpenseChart/chartUtils.js

export const groupExpensesByWeek = (emails) => {
  const weeks = {};

  emails.forEach((email) => {
    const subject = email.subject.toLowerCase();
    if (!subject.includes('debited')) return;

    const amount = parseFloat(subject.match(/\b\d+(?:\.\d{1,2})?\b/)?.[0]);
    const date = new Date(email.date);
    if (isNaN(amount) || isNaN(date)) return;

    // Start of week (Monday)
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const key = start.toISOString(); // for sorting
    const label = `${start.toLocaleString('default', { month: 'short' })} ${start.getDate()}–${end.getDate()}`;

    if (!weeks[key]) weeks[key] = { name: label, amount: 0 };
    weeks[key].amount += amount;
  });

  return (
    Object.entries(weeks)
      .sort(([a], [b]) => new Date(a) - new Date(b)) // sort by week start
      .slice(-7) // last 7 weeks
      .map(([, value]) => value)
  );
};

export const groupExpensesByMonth = (emails) => {
  const months = {};

  emails.forEach((email) => {
    const subject = email.subject.toLowerCase();
    if (!subject.includes('debited')) return;

    const amount = parseFloat(subject.match(/\b\d+(?:\.\d{1,2})?\b/)?.[0]);
    const date = new Date(email.date);
    if (isNaN(amount) || isNaN(date)) return;

    const key = `${date.getFullYear()}-${date.getMonth()}`; // e.g. 2024-4
    const label = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

    if (!months[key]) months[key] = { name: label, amount: 0 };
    months[key].amount += amount;
  });

  return (
    Object.entries(months)
      .sort(([a], [b]) => new Date(a) - new Date(b)) // sort by month
      .slice(-9) // last 9 months
      .map(([, value]) => value)
  );
};

