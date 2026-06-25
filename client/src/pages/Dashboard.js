import { useState, useEffect } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
    const { user } = useAuth();
    const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
    const [habits, setHabits] = useState([]);
    const [goals, setGoals] = useState([]);
    const [totalInvestments, setTotalInvestments] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [summaryRes, habitsRes, goalsRes, investmentsRes] = await Promise.all([
                API.get('/transactions/summary'),
                API.get('/habits'),
                API.get('/goals'),
                API.get('/investments')
            ]);
            setSummary(summaryRes.data);
            setHabits(habitsRes.data);
            setGoals(goalsRes.data);
            const investTotal = investmentsRes.data.reduce((sum, inv) => sum + inv.amount, 0);
            setTotalInvestments(investTotal);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const netWorth = summary.balance + totalInvestments;

    const cards = [
        { label: 'Total Income', value: summary.totalIncome, color: 'from-green-400 to-emerald-500', icon: '📈', delay: 'delay-1' },
        { label: 'Total Expense', value: summary.totalExpense, color: 'from-red-400 to-rose-500', icon: '📉', delay: 'delay-2' },
        { label: 'Investments', value: totalInvestments, color: 'from-purple-400 to-violet-500', icon: '💹', delay: 'delay-3' },
        { label: 'Net Worth', value: netWorth, color: 'from-indigo-400 to-blue-500', icon: '🏆', delay: 'delay-4' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F0F4FF]">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500 font-medium">Loading your dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F0F4FF]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Header */}
                <div className="mb-8 animate-fadeInUp">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Welcome back, <span className="text-indigo-600">{user?.name?.split(' ')[0]}</span>! 👋
                    </h2>
                    <p className="text-gray-500 mt-1">Here's your financial overview for today</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {cards.map((card) => (
                        <div
                            key={card.label}
                            className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 text-white shadow-lg card-hover animate-fadeInUp ${card.delay}`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-white/80 text-sm font-medium">{card.label}</p>
                                <span className="text-2xl">{card.icon}</span>
                            </div>
                            <p className="text-3xl font-bold">
                                ₹{card.value.toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Bottom Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Habits */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-50 animate-fadeInUp delay-3">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-gray-800">🔥 Active Habits</h3>
                            <span className="text-xs bg-orange-50 text-orange-500 px-2 py-1 rounded-full font-medium">
                                {habits.length} active
                            </span>
                        </div>
                        {habits.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-4xl mb-2">🌱</p>
                                <p className="text-gray-400 text-sm">No habits yet. Start building one!</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {habits.slice(0, 4).map((habit) => (
                                    <div key={habit._id} className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50 p-3 rounded-xl border border-orange-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-sm">
                                                🔥
                                            </div>
                                            <span className="text-gray-700 font-medium text-sm">{habit.name}</span>
                                        </div>
                                        <span className="text-orange-500 font-bold text-sm bg-white px-2 py-1 rounded-lg shadow-sm">
                                            {habit.streak} days
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Goals */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-50 animate-fadeInUp delay-4">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-gray-800">🎯 Savings Goals</h3>
                            <span className="text-xs bg-indigo-50 text-indigo-500 px-2 py-1 rounded-full font-medium">
                                {goals.length} goals
                            </span>
                        </div>
                        {goals.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-4xl mb-2">🎯</p>
                                <p className="text-gray-400 text-sm">No goals yet. Set your first goal!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {goals.slice(0, 3).map((goal) => {
                                    const percent = Math.min(
                                        Math.round((goal.savedAmount / goal.targetAmount) * 100), 100
                                    );
                                    return (
                                        <div key={goal._id}>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-700 font-medium">{goal.name}</span>
                                                <span className="text-indigo-600 font-bold">{percent}%</span>
                                            </div>
                                            <div className="w-full bg-indigo-50 rounded-full h-2.5">
                                                <div
                                                    className="bg-gradient-to-r from-indigo-400 to-purple-500 h-2.5 rounded-full transition-all duration-700"
                                                    style={{ width: `${percent}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                                <span>₹{goal.savedAmount.toLocaleString()} saved</span>
                                                <span>₹{goal.targetAmount.toLocaleString()} goal</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;