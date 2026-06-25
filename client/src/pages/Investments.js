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

    const investmentTypes = ['Mutual Fund', 'Stocks', 'Gold', 'Fixed Deposit', 'PPF', 'Crypto', 'Real Estate', 'Other'];

    const typeIcons = {
        'Mutual Fund': '📊',
        'Stocks': '📈',
        'Gold': '🥇',
        'Fixed Deposit': '🏦',
        'PPF': '🛡️',
        'Crypto': '₿',
        'Real Estate': '🏠',
        'Other': '💼',
    };

    useEffect(() => { fetchInvestments(); }, []);

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
            await API.post('/investments', { type, amount: Number(amount), description });
            setType(''); setAmount(''); setDescription('');
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
        } catch (err) { console.log(err); }
    };

    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);

    // Group by type
    const byType = {};
    investments.forEach(inv => {
        byType[inv.type] = (byType[inv.type] || 0) + inv.amount;
    });

    return (
        <div className="min-h-screen bg-[#F0F4FF]">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-6 animate-fadeInUp">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Investments</h2>
                        <p className="text-gray-500 mt-1">Track your wealth portfolio</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg btn-primary"
                    >
                        {showForm ? '✕ Cancel' : '+ Add Investment'}
                    </button>
                </div>

                {/* Total Card */}
                <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-6 text-white shadow-lg mb-6 animate-fadeInUp delay-1 card-hover">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/80 text-sm font-medium mb-1">Total Portfolio Value</p>
                            <p className="text-4xl font-bold">₹{totalInvested.toLocaleString()}</p>
                            <p className="text-white/70 text-sm mt-1">{investments.length} investments tracked</p>
                        </div>
                        <div className="text-6xl opacity-30">💹</div>
                    </div>
                </div>

                {/* Breakdown by type */}
                {Object.keys(byType).length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 animate-fadeInUp delay-2">
                        {Object.entries(byType).map(([t, val]) => (
                            <div key={t} className="bg-white rounded-xl p-4 shadow-sm border border-indigo-50 card-hover">
                                <div className="text-2xl mb-1">{typeIcons[t] || '💼'}</div>
                                <p className="text-xs text-gray-500 font-medium">{t}</p>
                                <p className="text-lg font-bold text-purple-600">₹{val.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Form */}
                {showForm && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-50 mb-6 animate-scaleIn">
                        <h3 className="font-bold text-gray-800 mb-4">Add New Investment</h3>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
                                ⚠️ {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 hover:bg-white transition-all"
                            >
                                <option value="">Select Investment Type</option>
                                {investmentTypes.map(t => (
                                    <option key={t} value={t}>{typeIcons[t]} {t}</option>
                                ))}
                            </select>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Amount Invested"
                                    required
                                    className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 hover:bg-white transition-all"
                                />
                            </div>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description (optional)"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 hover:bg-white transition-all"
                            />
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-violet-700 transition-all shadow-md btn-primary"
                            >
                                Add Investment 💹
                            </button>
                        </form>
                    </div>
                )}

                {/* Investment List */}
                <div className="bg-white rounded-2xl shadow-sm border border-indigo-50 overflow-hidden animate-fadeInUp delay-3">
                    <div className="p-5 border-b border-gray-50">
                        <h3 className="font-bold text-gray-800">Investment History</h3>
                    </div>
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : investments.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-4xl mb-3">💹</p>
                            <p className="text-gray-400">No investments yet. Start building your portfolio!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {investments.map((inv, i) => (
                                <div
                                    key={inv._id}
                                    className="p-4 flex items-center justify-between hover:bg-purple-50/30 transition-all animate-fadeInUp"
                                    style={{ animationDelay: `${i * 0.04}s` }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-lg">
                                            {typeIcons[inv.type] || '💼'}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{inv.type}</p>
                                            <p className="text-sm text-gray-400">
                                                {inv.description || 'No description'} · {new Date(inv.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-lg text-purple-600">
                                            ₹{inv.amount.toLocaleString()}
                                        </span>
                                        <button
                                            onClick={() => handleDelete(inv._id)}
                                            className="text-gray-300 hover:text-red-400 transition-colors"
                                        >
                                            🗑️
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