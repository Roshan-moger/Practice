// components/ExpenseChart/chartUtils.js

export const groupExpensesByWeek = (emails) => {
  const weeks = {};

  emails.forEach((email) => {
    const subject = email.subject.toLowerCase();
    if (!subject.includes('debited')) return;

    const amount = parseFloat(subject.match(/\b\d+(?:\.\d{1,2})?\b/)?.[0]);
    const date = new Date(email.date);
    if (isNaN(amount) || isNaN(date)) return;

    // Calculate start of the week (Monday)
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // adjust when Sunday
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);

    // End of the week
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    // Format label like "May 6–12"
    const label = `${start.toLocaleString('default', { month: 'short' })} ${start.getDate()}–${end.getDate()}`;

    weeks[label] = (weeks[label] || 0) + amount;
  });

  return Object.entries(weeks).map(([label, amount]) => ({
    name: label,
    amount,
  }));
};

export const groupExpensesByMonth = (emails) => {
  const months = {};

  emails.forEach(email => {
    const subject = email.subject.toLowerCase();
    if (!subject.includes('debited')) return;

    const amount = parseFloat(subject.match(/\b\d+(?:\.\d{1,2})?\b/)?.[0]);
    const date = new Date(email.date);

    if (!isNaN(amount)) {
      const label = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      months[label] = (months[label] || 0) + amount;
    }
  });

  return Object.entries(months).map(([month, value]) => ({
    name: month,
    amount: value,
  }));
};
