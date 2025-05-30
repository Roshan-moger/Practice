import { useSelector, useDispatch } from 'react-redux';
import { selectFilteredEmails } from '../features/Email/EmailSelector';
import { addMonthlySaving, setSelectedMonth } from '../features/Email/EmailSlice';
import { useEffect } from 'react';
import ExpenseChart from './ExpenseChart/ExpenseChart';
import ExpensePieChart from './ExpenseChart/ExpensePieChart';
import RecentTransactions from './RecentTrancation/RecentTransactions';

const MainPage = ({ user }) => {
  const dispatch = useDispatch();
  const filteredEmails = useSelector(selectFilteredEmails);
  const months = useSelector(state => state.emails.availableMonths);
  const selectedMonth = useSelector(state => state.emails.selectedMonth);
  const saving = useSelector(state => state.emails.saving);
  const addedMonths = useSelector(state => state.emails.addedMonths);

  let income = 0;
  let expense = 0;

  filteredEmails.forEach(email => {
    const subject = email.subject.toLowerCase();
    const amount = parseFloat(email.subject.match(/\b\d+(?:\.\d{1,2})?\b/)?.[0]);
    if (!isNaN(amount)) {
      if (subject.includes("credited")) income += amount;
      else if (subject.includes("debited")) expense += amount;
    }
  });

  const net = income - expense;

  useEffect(() => {
    if (!selectedMonth) return;

    // Dispatch to add monthly saving if not already added
    if (!addedMonths.includes(selectedMonth)) {
      dispatch(addMonthlySaving({ month: selectedMonth, net }));
    }
  }, [selectedMonth, net, addedMonths, dispatch]);

  return (
    <div className="p-4 space-y-6">
      {/* Row 1: Select + Username */}
      <div className="flex justify-between items-center">
        <div className="text-right font-medium text-gray-700">
          Welcome, <span className="font-bold">{user.name}</span>
        </div>
        <div>
          <select
            id="monthSelect"
            value={selectedMonth}
            onChange={e => dispatch(setSelectedMonth(e.target.value))}
            className="px-2 py-1"
          >
            {months.map((monthStr) => {
              const [year, month] = monthStr.split("-");
              const date = new Date(year, month - 1);
              const label = `${date.toLocaleString("default", { month: "long" })} ${year}`;
              return (
                <option key={monthStr} value={monthStr}>{label}</option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Row 2: Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white shadow-lg rounded-lg p-4 flex">
          <div className="w-[2px] bg-black rounded-l"></div>
          <div className="pl-4 w-full">
            <h3 className="text-sm text-gray-500">Total Balance</h3>
            <p className="text-blue-600 text-xl font-semibold mt-1">₹{net.toFixed(2)}</p>
            <p className="text-xs text-right text-gray-400 mt-2">Available funds</p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-4 flex">
          <div className="w-[2px] bg-black rounded-l"></div>
          <div className="pl-4 w-full">
            <h3 className="text-sm text-gray-500">Income</h3>
            <p className="text-green-600 text-xl font-semibold mt-1">₹{income.toFixed(2)}</p>
            <p className="text-xs text-right text-gray-400 mt-2">This month</p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-4 flex">
          <div className="w-[2px] bg-black rounded-l"></div>
          <div className="pl-4 w-full">
            <h3 className="text-sm text-gray-500">Expense</h3>
            <p className="text-red-600 text-xl font-semibold mt-1">₹{expense.toFixed(2)}</p>
            <p className="text-xs text-right text-gray-400 mt-2">Spent</p>
          </div>
        </div>

        {/* New Saving Card */}
        <div className="bg-white shadow-lg rounded-lg p-4 flex">
          <div className="w-[2px] bg-black rounded-l"></div>
          <div className="pl-4 w-full">
            <h3 className="text-sm text-gray-500">Saving</h3>
            <p className="text-purple-600 text-xl font-semibold mt-1">₹{saving.toFixed(2)}</p>
            <p className="text-xs text-right text-gray-400 mt-2">Cumulative total</p>
          </div>
        </div>
      </div>


   {/* Main Grid Row for Chart + Sidebar */}
<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
  {/* Left Column */}
  <div className="md:col-span-7 flex flex-col h-full">
    <div className="flex-1">
      <ExpenseChart />
    </div>
  </div>

  {/* Right Column */}
  <div className="md:col-span-5 flex flex-col h-full">
    <div className="flex-1">
      <ExpensePieChart />
    </div>
  </div>
</div>

      {/* Recent Transactions */}
      <RecentTransactions/>
    </div>
  );
};

export default MainPage;
