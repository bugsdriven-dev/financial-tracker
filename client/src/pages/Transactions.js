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

    useEffect(() => {
        fetchTransactions();
    }, []);

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
            await API.post('/transactions', {
                type, amount: Number(amount), category, description
            });
            setAmount('');
            setCategory('');
            setDescription('');
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
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="p-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Transactions</h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
                    >
                        {showForm ? 'Cancel' : '+ Add Transaction'}
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                        {error && (
                            <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setType('income')}
                                    className={`flex-1 py-2 rounded-lg font-medium ${
                                        type === 'income'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    Income
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType('expense')}
                                    className={`flex-1 py-2 rounded-lg font-medium ${
                                        type === 'expense'
                                            ? 'bg-red-600 text-white'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    Expense
                                </button>
                            </div>

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
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="Category (e.g. Food, Salary, Rent)"
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
                                Add Transaction
                            </button>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {loading ? (
                        <p className="p-6 text-gray-500 text-center">Loading...</p>
                    ) : transactions.length === 0 ? (
                        <p className="p-6 text-gray-400 text-center">No transactions yet. Add your first one!</p>
                    ) : (
                        <div className="divide-y">
                            {transactions.map((t) => (
                                <div key={t._id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-2 h-2 rounded-full ${
                                            t.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                                        }`}></span>
                                        <div>
                                            <p className="font-medium text-gray-800">{t.category}</p>
                                            <p className="text-sm text-gray-400">
                                                {t.description || 'No description'} • {new Date(t.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`font-semibold ${
                                            t.type === 'income' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                                        </span>
                                        <button
                                            onClick={() => handleDelete(t._id)}
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

export default Transactions;
