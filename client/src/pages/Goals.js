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

    useEffect(() => {
        fetchGoals();
    }, []);

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
            await API.post('/goals', {
                name, targetAmount: Number(targetAmount), deadline
            });
            setName('');
            setTargetAmount('');
            setDeadline('');
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
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await API.delete(`/goals/${id}`);
            fetchGoals();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="p-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Savings Goals 🎯</h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
                    >
                        {showForm ? 'Cancel' : '+ Add Goal'}
                    </button>
                </div>

                {/* Add Goal Form */}
                {showForm && (
                    <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                        {error && (
                            <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Goal name (e.g. Buy Laptop, Emergency Fund)"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <input
                                type="number"
                                value={targetAmount}
                                onChange={(e) => setTargetAmount(e.target.value)}
                                placeholder="Target Amount (₹)"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Deadline</label>
                                <input
                                    type="date"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
                            >
                                Add Goal
                            </button>
                        </form>
                    </div>
                )}

                {/* Goals List */}
                {loading ? (
                    <p className="text-gray-500 text-center">Loading...</p>
                ) : goals.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                        <p className="text-gray-400">No goals yet. Set your first savings goal!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {goals.map((goal) => {
                            const percent = Math.min(
                                Math.round((goal.savedAmount / goal.targetAmount) * 100),
                                100
                            );
                            return (
                                <div key={goal._id} className="bg-white rounded-xl p-6 shadow-sm">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-800 text-lg">
                                                {goal.name} {goal.isCompleted && '🎉'}
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                Target date: {new Date(goal.deadline).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(goal._id)}
                                            className="text-gray-400 hover:text-red-500 text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>

                                    <div className="mb-3">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">
                                                ₹{goal.savedAmount.toLocaleString()} of ₹{goal.targetAmount.toLocaleString()}
                                            </span>
                                            <span className="font-medium text-blue-600">{percent}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-blue-600 h-3 rounded-full transition-all"
                                                style={{ width: `${percent}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {!goal.isCompleted && (
                                        addingMoneyTo === goal._id ? (
                                            <div className="flex gap-2 mt-3">
                                                <input
                                                    type="number"
                                                    value={moneyAmount}
                                                    onChange={(e) => setMoneyAmount(e.target.value)}
                                                    placeholder="Amount to add"
                                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <button
                                                    onClick={() => handleAddMoney(goal._id)}
                                                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                                                >
                                                    Add
                                                </button>
                                                <button
                                                    onClick={() => setAddingMoneyTo(null)}
                                                    className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setAddingMoneyTo(goal._id)}
                                                className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 mt-2"
                                            >
                                                + Add Savings
                                            </button>
                                        )
                                    )}
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