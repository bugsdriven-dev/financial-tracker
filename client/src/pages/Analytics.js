import { useState, useEffect } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar
} from 'recharts';

const COLORS = ['#6366F1', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];

function Analytics() {
    const [transactions, setTransactions] = useState([]);
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, []);

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

    const expensesByCategory = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
    });
    const pieData = Object.keys(expensesByCategory).map(cat => ({
        name: cat, value: expensesByCategory[cat]
    }));

    const monthlyData = {};
    transactions.forEach(t => {
        const month = new Date(t.date).toLocaleString('default', { month: 'short', year: '2-digit' });
        if (!monthlyData[month]) monthlyData[month] = { month, income: 0, expense: 0 };
        if (t.type === 'income') monthlyData[month].income += t.amount;
        else monthlyData[month].expense += t.amount;
    });
    const lineData = Object.values(monthlyData).map(m => ({
        ...m, netSavings: m.income - m.expense
    }));

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const totalInvestments = investments.reduce((s, inv) => s + inv.amount, 0);
    const netWorth = (totalIncome - totalExpense) + totalInvestments;
    const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

    const summaryCards = [
        { label: 'Net Worth', value: netWorth, color: 'from-indigo-500 to-blue-600', icon: '🏆' },
        { label: 'Total Income', value: totalIncome, color: 'from-green-400 to-emerald-500', icon: '📈' },
        { label: 'Total Expense', value: totalExpense, color: 'from-red-400 to-rose-500', icon: '📉' },
        { label: 'Savings Rate', value: null, rate: savingsRate, color: 'from-purple-400 to-violet-500', icon: '💰' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F0F4FF]">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F0F4FF]">
            <Navbar />
            <div className="max-w-6xl mx-auto px-6 py-8">

                {/* Header */}
                <div className="mb-8 animate-fadeInUp">
                    <h2 className="text-3xl font-bold text-gray-800">Wealth Analytics</h2>
                    <p className="text-gray-500 mt-1">Visualize your complete financial picture</p>
                </div>

                {transactions.length === 0 ? (
                    <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-indigo-50">
                        <p className="text-5xl mb-4">📊</p>
                        <p className="text-gray-500 font-medium text-lg">No data yet. Add some transactions to see your analytics!</p>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {summaryCards.map((card, i) => (
                                <div
                                    key={card.label}
                                    className={`bg-gradient-to-br ${card.color} rounded-2xl p-5 text-white shadow-lg card-hover animate-fadeInUp`}
                                    style={{ animationDelay: `${i * 0.08}s` }}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-white/80 text-xs font-medium">{card.label}</p>
                                        <span className="text-xl">{card.icon}</span>
                                    </div>
                                    {card.value !== null ? (
                                        <p className="text-2xl font-bold">₹{card.value.toLocaleString()}</p>
                                    ) : (
                                        <p className="text-2xl font-bold">{card.rate}%</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Charts Row 1 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                            {/* Pie Chart */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-50 animate-fadeInUp delay-2">
                                <h3 className="font-bold text-gray-800 mb-1">Expense Breakdown</h3>
                                <p className="text-sm text-gray-400 mb-4">Where your money is going</p>
                                {pieData.length === 0 ? (
                                    <div className="flex items-center justify-center h-48 text-gray-400">
                                        No expenses recorded yet
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height={280}>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={90}
                                                innerRadius={40}
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                labelLine={false}
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

                            {/* Bar Chart */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-50 animate-fadeInUp delay-3">
                                <h3 className="font-bold text-gray-800 mb-1">Income vs Expense</h3>
                                <p className="text-sm text-gray-400 mb-4">Monthly comparison</p>
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={lineData} barSize={20}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#F0F4FF" />
                                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                        <Legend />
                                        <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Line Chart */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-50 animate-fadeInUp delay-4">
                            <h3 className="font-bold text-gray-800 mb-1">Net Savings Trend</h3>
                            <p className="text-sm text-gray-400 mb-4">Your savings growth over time</p>
                            <ResponsiveContainer width="100%" height={260}>
                                <LineChart data={lineData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F4FF" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                    <Legend />
                                    <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} name="Income" />
                                    <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 4 }} name="Expense" />
                                    <Line type="monotone" dataKey="netSavings" stroke="#6366F1" strokeWidth={2.5} dot={{ r: 4 }} name="Net Savings" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Analytics;