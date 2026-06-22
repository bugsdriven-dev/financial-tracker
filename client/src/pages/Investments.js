import { useState, useEffect } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';

function Investments() {
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [type, setType] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchInvestments();
    }, []);

    const fetchInvestments = async () => {
        try {
            const res = await API.get('/investments');
            setInvestments(res.data);
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
            await API.post('/investments', {
                type, amount: Number(amount), description
            });
            setType('');
            setAmount('');
            setDescription('');
            setShowForm(false);
            fetchInvestments();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add investment');
        }
    };

    const handleDelete = async (id) => {
        try {
            await API.delete(`/investments/${id}`);
            fetchInvestments();
        } catch (err) {
            console.log(err);
        }
    };

    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="p-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Investments 💹</h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
                    >
                        {showForm ? 'Cancel' : '+ Add Investment'}
                    </button>
                </div>

                {/* Total Invested Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm mb-6 border-l-4 border-purple-500">
                    <p className="text-gray-500 text-sm">Total Invested</p>
                    <p className="text-2xl font-bold text-purple-600">
                        ₹{totalInvested.toLocaleString()}
                    </p>
                </div>

                {/* Add Investment Form */}
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
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                placeholder="Type (e.g. Mutual Fund, Gold, Stocks, FD)"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Amount (₹)"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description (optional)"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
                            >
                                Add Investment
                            </button>
                        </form>
                    </div>
                )}

                {/* Investments List */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {loading ? (
                        <p className="p-6 text-gray-500 text-center">Loading...</p>
                    ) : investments.length === 0 ? (
                        <p className="p-6 text-gray-400 text-center">No investments yet. Add your first one!</p>
                    ) : (
                        <div className="divide-y">
                            {investments.map((inv) => (
                                <div key={inv._id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                    <div>
                                        <p className="font-medium text-gray-800">{inv.type}</p>
                                        <p className="text-sm text-gray-400">
                                            {inv.description || 'No description'} • {new Date(inv.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-semibold text-purple-600">
                                            ₹{inv.amount.toLocaleString()}
                                        </span>
                                        <button
                                            onClick={() => handleDelete(inv._id)}
                                            className="text-gray-400 hover:text-red-500 text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Investments;