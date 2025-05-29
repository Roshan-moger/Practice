import { createSelector } from '@reduxjs/toolkit';

export const selectAllEmails = state => state.emails.data;
export const selectSelectedMonth = state => state.emails.selectedMonth;

export const selectFilteredEmails = createSelector(
  [selectAllEmails, selectSelectedMonth],
  (emails, selectedMonth) => {
    if (!selectedMonth) return emails;

    return emails.filter(email => {
      const date = new Date(email.date);
      const emailMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return emailMonth === selectedMonth;
    });
  }
);
