import { useState, useEffect } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';

function Goals() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [deadline, setDeadline] = useState('');
    const [error, setError] = useState('');
    const [addingMoneyTo, setAddingMoneyTo] = useState(null);
    const [moneyAmount, setMoneyAmount] = useState('');

    useEffect(() => { fetchGoals(); }, []);

    const fetchGoals = async () => {
        try {
            const res = await API.get('/goals');
            setGoals(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await API.post('/goals', { name, targetAmount: Number(targetAmount), deadline });
            setName(''); setTargetAmount(''); setDeadline('');
            setShowForm(false);
            fetchGoals();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add goal');
        }
    };

    const handleAddMoney = async (id) => {
        try {
            await API.put(`/goals/${id}/save`, { amount: Number(moneyAmount) });
            setMoneyAmount('');
            setAddingMoneyTo(null);
            fetchGoals();
        } catch (err) { console.log(err); }
    };

    const handleDelete = async (id) => {
        try {
            await API.delete(`/goals/${id}`);
            fetchGoals();
        } catch (err) { console.log(err); }
    };

    const goalColors = [
        'from-indigo-400 to-blue-500',
        'from-purple-400 to-violet-500',
        'from-pink-400 to-rose-500',
        'from-teal-400 to-cyan-500',
        'from-amber-400 to-orange-500',
    ];

    return (
        <div className="min-h-screen bg-[#F0F4FF]">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-6 animate-fadeInUp">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Savings Goals</h2>
                        <p className="text-gray-500 mt-1">Track your progress towards financial goals</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg btn-primary"
                    >
                        {showForm ? '✕ Cancel' : '+ Add Goal'}
                    </button>
                </div>

                {/* Add Form */}
                {showForm && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-50 mb-6 animate-scaleIn">
                        <h3 className="font-bold text-gray-800 mb-4">Create New Goal</h3>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
                                ⚠️ {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Goal name (e.g. Buy Laptop, Emergency Fund)"
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 hover:bg-white transition-all"
                            />
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                <input
                                    type="number"
                                    value={targetAmount}
                                    onChange={(e) => setTargetAmount(e.target.value)}
                                    placeholder="Target Amount"
                                    required
                                    className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 hover:bg-white transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">Target Deadline</label>
                                <input
                                    type="date"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 hover:bg-white transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md btn-primary"
                            >
                                Create Goal 🎯
                            </button>
                        </form>
                    </div>
                )}

                {/* Goals List */}
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : goals.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-indigo-50">
                        <p className="text-5xl mb-3">🎯</p>
                        <p className="text-gray-500 font-medium">No goals yet. Set your first savings goal!</p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {goals.map((goal, i) => {
                            const percent = Math.min(
                                Math.round((goal.savedAmount / goal.targetAmount) * 100), 100
                            );
                            const colorClass = goalColors[i % goalColors.length];
                            return (
                                <div
                                    key={goal._id}
                                    className="bg-white rounded-2xl shadow-sm border border-indigo-50 overflow-hidden card-hover animate-fadeInUp"
                                    style={{ animationDelay: `${i * 0.08}s` }}
                                >
                                    {/* Top gradient bar */}
                                    <div className={`h-1.5 bg-gradient-to-r ${colorClass}`}></div>

                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="font-bold text-gray-800 text-lg">
                                                    {goal.name} {goal.isCompleted && '🎉'}
                                                </h3>
                                                <p className="text-sm text-gray-400 mt-0.5">
                                                    🗓️ Target: {new Date(goal.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-2xl font-bold bg-gradient-to-r ${colorClass} bg-clip-text text-transparent`}>
                                                    {percent}%
                                                </span>
                                                <button
                                                    onClick={() => handleDelete(goal._id)}
                                                    className="text-gray-300 hover:text-red-400 transition-colors"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-3">
                                            <div className="w-full bg-gray-100 rounded-full h-3">
                                                <div
                                                    className={`bg-gradient-to-r ${colorClass} h-3 rounded-full transition-all duration-700`}
                                                    style={{ width: `${percent}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between text-sm mb-4">
                                            <span className="text-gray-500">
                                                Saved: <span className="font-bold text-gray-800">₹{goal.savedAmount.toLocaleString()}</span>
                                            </span>
                                            <span className="text-gray-500">
                                                Goal: <span className="font-bold text-gray-800">₹{goal.targetAmount.toLocaleString()}</span>
                                            </span>
                                        </div>

                                        {!goal.isCompleted && (
                                            addingMoneyTo === goal._id ? (
                                                <div className="flex gap-2">
                                                    <div className="relative flex-1">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                                                        <input
                                                            type="number"
                                                            value={moneyAmount}
                                                            onChange={(e) => setMoneyAmount(e.target.value)}
                                                            placeholder="Amount to add"
                                                            className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 text-sm"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => handleAddMoney(goal._id)}
                                                        className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:from-green-500 hover:to-emerald-600 transition-all"
                                                    >
                                                        Add
                                                    </button>
                                                    <button
                                                        onClick={() => setAddingMoneyTo(null)}
                                                        className="bg-gray-100 text-gray-600 px-4 py-2.5 rounded-xl text-sm hover:bg-gray-200 transition-all"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setAddingMoneyTo(goal._id)}
                                                    className={`w-full bg-gradient-to-r ${colorClass} text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition-all shadow-sm btn-primary`}
                                                >
                                                    + Add Savings
                                                </button>
                                            )
                                        )}

                                        {goal.isCompleted && (
                                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 rounded-xl text-sm font-semibold text-center">
                                                🎉 Goal Completed! Congratulations!
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Goals;