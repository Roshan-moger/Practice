import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useSelector } from 'react-redux';
import { groupExpensesByWeek, groupExpensesByMonth } from './chartUtils';
import { useState } from 'react';
import { selectFilteredEmails } from '../../features/Email/EmailSelector';

const ExpenseChart = () => {
  const emails = useSelector(selectFilteredEmails);
  const [view, setView] = useState('weekly'); // 'weekly' or 'monthly'

  const chartData =
    view === 'weekly' ? groupExpensesByWeek(emails) : groupExpensesByMonth(emails);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl mt-6 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-700"> Spending Overview</h2>
        <select
          className="border border-gray-300 bg-gray-50 text-gray-700 rounded-md px-3 py-1 shadow-sm hover:border-gray-400 focus:outline-none"
          value={view}
          onChange={(e) => setView(e.target.value)}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="#000" strokeDasharray="4 4"  horizontal={false} vertical={true}  />
          <XAxis dataKey="name" stroke="#888" />
          <YAxis
            domain={[0, view === 'weekly' ? 10000 : 25000]}
            stroke="#888"
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: 6 }}
            labelStyle={{ fontWeight: 'bold', color: '#333' }}
            cursor={{ stroke: '#000', strokeWidth: 0.2 }}
          />
          {/* Shadow Line (black, behind main line) */}
          <Line
            type="linear"
            dataKey="amount"
            stroke="#000"
            strokeWidth={4}
            dot={false}
            strokeOpacity={0.2}
          />
          {/* Main Line (red) */}
          <Line
            type="linear"
            dataKey="amount"
            stroke="#000"
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
