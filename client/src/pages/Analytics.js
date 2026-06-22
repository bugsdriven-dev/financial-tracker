import { useState, useEffect } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];

function Analytics() {
    const [transactions, setTransactions] = useState([]);
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [transRes, investRes] = await Promise.all([
                API.get('/transactions'),
                API.get('/investments')
            ]);
            setTransactions(transRes.data);
            setInvestments(investRes.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    // Build expense category breakdown for Pie Chart
    const expensesByCategory = {};
    transactions
        .filter((t) => t.type === 'expense')
        .forEach((t) => {
            expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
        });

    const pieData = Object.keys(expensesByCategory).map((category) => ({
        name: category,
        value: expensesByCategory[category]
    }));

    // Build month-wise net worth growth for Line Chart
    const monthlyData = {};
    transactions.forEach((t) => {
        const month = new Date(t.date).toLocaleString('default', { month: 'short', year: '2-digit' });
        if (!monthlyData[month]) monthlyData[month] = { month, income: 0, expense: 0 };
        if (t.type === 'income') monthlyData[month].income += t.amount;
        else monthlyData[month].expense += t.amount;
    });

    const lineData = Object.values(monthlyData).map((m) => ({
        ...m,
        netSavings: m.income - m.expense
    }));

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const totalInvestments = investments.reduce((s, inv) => s + inv.amount, 0);
    const netWorth = (totalIncome - totalExpense) + totalInvestments;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="p-6 max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Wealth Analytics 📈</h2>
                <p className="text-gray-500 mb-6">Visualize your financial growth</p>

                {loading ? (
                    <p className="text-gray-500 text-center">Loading charts...</p>
                ) : transactions.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                        <p className="text-gray-400">No data yet. Add some transactions to see your analytics!</p>
                    </div>
                ) : (
                    <>
                        {/* Net Worth Highlight */}
                        <div className="bg-white rounded-xl p-6 shadow-sm mb-6 border-l-4 border-blue-500">
                            <p className="text-gray-500 text-sm">Current Net Worth</p>
                            <p className="text-3xl font-bold text-blue-600">
                                ₹{netWorth.toLocaleString()}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Pie Chart - Expense by Category */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-semibold text-gray-800 mb-4">
                                    Expense Breakdown by Category
                                </h3>
                                {pieData.length === 0 ? (
                                    <p className="text-gray-400 text-sm text-center py-10">
                                        No expenses recorded yet
                                    </p>
                                ) : (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                label={(entry) => entry.name}
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </div>

                            {/* Line Chart - Net Savings Over Time */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-semibold text-gray-800 mb-4">
                                    Monthly Net Savings Trend
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={lineData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="income"
                                            stroke="#10B981"
                                            strokeWidth={2}
                                            name="Income"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="expense"
                                            stroke="#EF4444"
                                            strokeWidth={2}
                                            name="Expense"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="netSavings"
                                            stroke="#3B82F6"
                                            strokeWidth={2}
                                            name="Net Savings"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Analytics;