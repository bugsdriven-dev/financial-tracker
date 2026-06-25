import { useState, useEffect } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [type, setType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const incomeCategories = ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'];
    const expenseCategories = ['Food', 'Transport', 'Rent', 'Shopping', 'Entertainment', 'Health', 'Education', 'Other'];

    useEffect(() => { fetchTransactions(); }, []);

    const fetchTransactions = async () => {
        try {
            const res = await API.get('/transactions');
            setTransactions(res.data);
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
            await API.post('/transactions', { type, amount: Number(amount), category, description });
            setAmount(''); setCategory(''); setDescription('');
            setShowForm(false);
            fetchTransactions();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add transaction');
        }
    };

    const handleDelete = async (id) => {
        try {
            await API.delete(`/transactions/${id}`);
            fetchTransactions();
        } catch (err) { console.log(err); }
    };

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    return (
        <div className="min-h-screen bg-[#F0F4FF]">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-6 animate-fadeInUp">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Transactions</h2>
                        <p className="text-gray-500 mt-1">Track your income and expenses</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg btn-primary"
                    >
                        {showForm ? '✕ Cancel' : '+ Add Transaction'}
                    </button>
                </div>

                {/* Summary Pills */}
                <div className="grid grid-cols-2 gap-4 mb-6 animate-fadeInUp delay-1">
                    <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-4 text-white shadow-md">
                        <p className="text-white/80 text-sm">Total Income</p>
                        <p className="text-2xl font-bold">₹{totalIncome.toLocaleString()}</p>
                    </div>
                    <div className="bg-gradient-to-br from-red-400 to-rose-500 rounded-2xl p-4 text-white shadow-md">
                        <p className="text-white/80 text-sm">Total Expense</p>
                        <p className="text-2xl font-bold">₹{totalExpense.toLocaleString()}</p>
                    </div>
                </div>

                {/* Add Form */}
                {showForm && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-50 mb-6 animate-scaleIn">
                        <h3 className="font-bold text-gray-800 mb-4">Add New Transaction</h3>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
                                ⚠️ {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Type Toggle */}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setType('income')}
                                    className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                                        type === 'income'
                                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                                >
                                    📈 Income
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType('expense')}
                                    className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                                        type === 'expense'
                                            ? 'bg-gradient-to-r from-red-400 to-rose-500 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                                >
                                    📉 Expense
                                </button>
                            </div>

                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Amount"
                                    required
                                    className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 hover:bg-white transition-all"
                                />
                            </div>

                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 hover:bg-white transition-all"
                            >
                                <option value="">Select Category</option>
                                {(type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description (optional)"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 hover:bg-white transition-all"
                            />

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md btn-primary"
                            >
                                Add Transaction
                            </button>
                        </form>
                    </div>
                )}

                {/* Transaction List */}
                <div className="bg-white rounded-2xl shadow-sm border border-indigo-50 overflow-hidden animate-fadeInUp delay-2">
                    <div className="p-5 border-b border-gray-50">
                        <h3 className="font-bold text-gray-800">Transaction History</h3>
                        <p className="text-sm text-gray-400">{transactions.length} transactions total</p>
                    </div>
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-4xl mb-3">💸</p>
                            <p className="text-gray-400">No transactions yet. Add your first one!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {transactions.map((t, i) => (
                                <div key={t._id} className={`p-4 flex items-center justify-between hover:bg-indigo-50/30 transition-all animate-fadeInUp`} style={{ animationDelay: `${i * 0.04}s` }}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                                            t.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                                        }`}>
                                            {t.type === 'income' ? '📈' : '📉'}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{t.category}</p>
                                            <p className="text-sm text-gray-400">
                                                {t.description || 'No description'} · {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`font-bold text-lg ${
                                            t.type === 'income' ? 'text-green-500' : 'text-red-500'
                                        }`}>
                                            {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                                        </span>
                                        <button
                                            onClick={() => handleDelete(t._id)}
                                            className="text-gray-300 hover:text-red-400 transition-colors text-lg"
                                            title="Delete"
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

export default Transactions;