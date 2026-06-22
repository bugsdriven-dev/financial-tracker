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

    useEffect(() => {
        fetchHabits();
    }, []);

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
            setName('');
            setFrequency('daily');
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
            fetchHabits(); // refresh to show updated streak
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error completing habit');
        }
    };

    const handleDelete = async (id) => {
        try {
            await API.delete(`/habits/${id}`);
            fetchHabits();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="p-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Financial Habits 🔥</h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
                    >
                        {showForm ? 'Cancel' : '+ Add Habit'}
                    </button>
                </div>

                {message && (
                    <div className="bg-blue-100 text-blue-700 p-3 rounded-lg mb-4 text-sm">
                        {message}
                    </div>
                )}

                {/* Add Habit Form */}
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
                                placeholder="e.g. Save ₹100 daily, Track expenses"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <select
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
                            >
                                Add Habit
                            </button>
                        </form>
                    </div>
                )}

                {/* Habits List */}
                {loading ? (
                    <p className="text-gray-500 text-center">Loading...</p>
                ) : habits.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                        <p className="text-gray-400">No habits yet. Add your first financial habit!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {habits.map((habit) => (
                            <div key={habit._id} className="bg-white rounded-xl p-5 shadow-sm">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{habit.name}</h3>
                                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full capitalize">
                                            {habit.frequency}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(habit._id)}
                                        className="text-gray-400 hover:text-red-500 text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-orange-500 font-bold text-lg">
                                        🔥 {habit.streak} day streak
                                    </span>
                                    <button
                                        onClick={() => handleComplete(habit._id)}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                                    >
                                        Mark Done Today ✅
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Habits;