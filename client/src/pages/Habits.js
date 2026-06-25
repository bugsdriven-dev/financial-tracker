import { useState, useEffect } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';

function Habits() {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [frequency, setFrequency] = useState('daily');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => { fetchHabits(); }, []);

    const fetchHabits = async () => {
        try {
            const res = await API.get('/habits');
            setHabits(res.data);
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
            await API.post('/habits', { name, frequency });
            setName(''); setFrequency('daily');
            setShowForm(false);
            fetchHabits();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add habit');
        }
    };

    const handleComplete = async (id) => {
        setMessage('');
        try {
            const res = await API.put(`/habits/${id}/complete`);
            setMessage(res.data.message);
            fetchHabits();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleDelete = async (id) => {
        try {
            await API.delete(`/habits/${id}`);
            fetchHabits();
        } catch (err) { console.log(err); }
    };

    const frequencyColors = {
        daily: 'bg-blue-100 text-blue-600',
        weekly: 'bg-purple-100 text-purple-600',
        monthly: 'bg-green-100 text-green-600'
    };

    return (
        <div className="min-h-screen bg-[#F0F4FF]">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-6 animate-fadeInUp">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Financial Habits</h2>
                        <p className="text-gray-500 mt-1">Build consistent money habits daily</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg btn-primary"
                    >
                        {showForm ? '✕ Cancel' : '+ Add Habit'}
                    </button>
                </div>

                {/* Message Toast */}
                {message && (
                    <div className="bg-gradient-to-r from-orange-400 to-amber-500 text-white px-5 py-3 rounded-xl mb-5 text-sm font-medium shadow-md animate-scaleIn flex items-center gap-2">
                        🔥 {message}
                    </div>
                )}

                {/* Add Form */}
                {showForm && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-50 mb-6 animate-scaleIn">
                        <h3 className="font-bold text-gray-800 mb-4">Create New Habit</h3>
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
                                placeholder="e.g. Save ₹100 daily, Track expenses every night"
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 hover:bg-white transition-all"
                            />
                            <div className="flex gap-3">
                                {['daily', 'weekly', 'monthly'].map((freq) => (
                                    <button
                                        key={freq}
                                        type="button"
                                        onClick={() => setFrequency(freq)}
                                        className={`flex-1 py-2.5 rounded-xl font-medium capitalize transition-all ${
                                            frequency === freq
                                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                        }`}
                                    >
                                        {freq}
                                    </button>
                                ))}
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md btn-primary"
                            >
                                Create Habit 🔥
                            </button>
                        </form>
                    </div>
                )}

                {/* Habits Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : habits.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-indigo-50">
                        <p className="text-5xl mb-3">🌱</p>
                        <p className="text-gray-500 font-medium">No habits yet. Start building your first one!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {habits.map((habit, i) => (
                            <div
                                key={habit._id}
                                className="bg-white rounded-2xl p-5 shadow-sm border border-indigo-50 card-hover animate-fadeInUp"
                                style={{ animationDelay: `${i * 0.08}s` }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-800 mb-2">{habit.name}</h3>
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${frequencyColors[habit.frequency]}`}>
                                            {habit.frequency}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(habit._id)}
                                        className="text-gray-300 hover:text-red-400 transition-colors ml-2"
                                    >
                                        🗑️
                                    </button>
                                </div>

                                {/* Streak */}
                                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-3 mb-4 flex items-center justify-between border border-orange-100">
                                    <span className="text-gray-600 text-sm font-medium">Current Streak</span>
                                    <span className="text-orange-500 font-bold text-lg">🔥 {habit.streak} days</span>
                                </div>

                                <button
                                    onClick={() => handleComplete(habit._id)}
                                    className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white py-2.5 rounded-xl font-semibold hover:from-green-500 hover:to-emerald-600 transition-all shadow-sm btn-primary"
                                >
                                    ✅ Mark Done Today
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Habits;