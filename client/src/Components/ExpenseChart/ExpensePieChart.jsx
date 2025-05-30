import React from 'react';
import { useSelector } from 'react-redux';
import { PieChart } from '@mui/x-charts/PieChart';
import { selectFilteredEmails } from '../../features/Email/EmailSelector';

const ExpensePieChart = () => {
  const emails = useSelector(selectFilteredEmails);

  let totalIncome = 0;
  let totalExpense = 0;

  emails.forEach(email => {
    const subject = email.subject.toLowerCase();
    const amountMatch = email.subject.match(/\b\d+(?:\.\d{1,2})?\b/);
    const amount = parseFloat(amountMatch?.[0]);

    if (!isNaN(amount)) {
      if (subject.includes('debited')) {
        totalExpense += amount;
      } else if (subject.includes('credited')) {
        totalIncome += amount;
      }
    }
  });

  const totalSavings = totalIncome - totalExpense;

  const chartData = [
    { id: 0, value: totalIncome,  color: '#00C49F' },
    { id: 1, value: totalExpense,  color: '#FF6384' },
    { id: 2, value: totalSavings, color: '#FFCE56' },
  ];

  return (
<div className="bg-white rounded shadow-md p-6 flex items-right justify-between mt-6">
      {/* Pie Chart with center savings */}
      <div className="relative w-3/4">
        <PieChart
          series={[
            {
              data: chartData,
              innerRadius: 60,
              outerRadius: 140,
              paddingAngle: 5,
              cornerRadius: 5,
              startAngle: -55,
              endAngle: 225,
              cx: 150,
              cy: 150,
            },
          ]}
          width={300}
          height={300}
        />

        {/* Center savings text */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-lg font-semibold text-green-600">
            ₹{totalSavings.toFixed(0)}
          </div>
        </div>
      </div>

      {/* Static Labels */}
      <div className="w-1/2 pl-6 space-y-3 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00C49F' }} />
          <span className="text-gray-700 font-medium"> Income: ₹{totalIncome.toFixed(0)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF6384' }} />
          <span className="text-gray-700 font-medium"> Expense: ₹{totalExpense.toFixed(0)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFCE56' }} />
          <span className="text-gray-700 font-medium">Savings: ₹{totalSavings.toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
};

export default ExpensePieChart;
