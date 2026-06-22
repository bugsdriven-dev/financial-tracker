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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">Loading dashboard...</p>
            </div>
        );
    }

    // Net Worth = Balance (savings) + Investments
    const netWorth = summary.balance + totalInvestments;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="p-6 max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    Welcome back, {user?.name}! 👋
                </h2>
                <p className="text-gray-500 mb-6">Here's your financial overview</p>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
                        <p className="text-gray-500 text-sm">Total Income</p>
                        <p className="text-2xl font-bold text-green-600">
                            ₹{summary.totalIncome.toLocaleString()}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-red-500">
                        <p className="text-gray-500 text-sm">Total Expense</p>
                        <p className="text-2xl font-bold text-red-600">
                            ₹{summary.totalExpense.toLocaleString()}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
                        <p className="text-gray-500 text-sm">Investments</p>
                        <p className="text-2xl font-bold text-purple-600">
                            ₹{totalInvestments.toLocaleString()}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
                        <p className="text-gray-500 text-sm">Net Worth</p>
                        <p className="text-2xl font-bold text-blue-600">
                            ₹{netWorth.toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Habits Summary */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="font-semibold text-gray-800 mb-4">🔥 Active Habits</h3>
                        {habits.length === 0 ? (
                            <p className="text-gray-400 text-sm">No habits yet. Add one to get started!</p>
                        ) : (
                            <div className="space-y-3">
                                {habits.map((habit) => (
                                    <div key={habit._id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                        <span className="text-gray-700">{habit.name}</span>
                                        <span className="text-orange-500 font-medium">🔥 {habit.streak} days</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Goals Summary */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="font-semibold text-gray-800 mb-4">🎯 Savings Goals</h3>
                        {goals.length === 0 ? (
                            <p className="text-gray-400 text-sm">No goals yet. Set one to start saving!</p>
                        ) : (
                            <div className="space-y-4">
                                {goals.map((goal) => {
                                    const percent = Math.min(
                                        Math.round((goal.savedAmount / goal.targetAmount) * 100),
                                        100
                                    );
                                    return (
                                        <div key={goal._id}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-700">{goal.name}</span>
                                                <span className="text-gray-500">{percent}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${percent}%` }}
                                                ></div>
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