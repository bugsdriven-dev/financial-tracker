import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

function AdminPanel() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user?.role !== 'admin') {
            navigate('/dashboard');
            return;
        }
        fetchAdminData();
    }, [user, navigate]);

    const fetchAdminData = async () => {
        try {
            const [statsRes, usersRes] = await Promise.all([
                API.get('/admin/stats'),
                API.get('/admin/users')
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
        } catch (err) {
            setError('Failed to load admin data.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
        try {
            await API.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    const statCards = stats ? [
        { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'from-blue-400 to-indigo-500' },
        { label: 'New This Week', value: stats.newUsersThisWeek, icon: '🆕', color: 'from-green-400 to-emerald-500' },
        { label: 'Transactions', value: stats.totalTransactions, icon: '💳', color: 'from-purple-400 to-violet-500' },
        { label: 'Habits Tracked', value: stats.totalHabits, icon: '🔥', color: 'from-orange-400 to-amber-500' },
        { label: 'Goals Set', value: stats.totalGoals, icon: '🎯', color: 'from-pink-400 to-rose-500' },
        { label: 'Platform Income', value: `₹${stats.totalIncomeAcrossPlatform?.toLocaleString()}`, icon: '📈', color: 'from-teal-400 to-cyan-500' },
        { label: 'Platform Expense', value: `₹${stats.totalExpenseAcrossPlatform?.toLocaleString()}`, icon: '📉', color: 'from-red-400 to-rose-500' },
        { label: 'Net Savings', value: `₹${(stats.totalIncomeAcrossPlatform - stats.totalExpenseAcrossPlatform)?.toLocaleString()}`, icon: '💰', color: 'from-indigo-400 to-purple-500' },
    ] : [];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F0F4FF]">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500 font-medium">Loading admin panel...</p>
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
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                            👑
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">Admin Panel</h2>
                            <p className="text-gray-500">Platform overview and user management</p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
                        ⚠️ {error}
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {statCards.map((card, i) => (
                        <div
                            key={card.label}
                            className={`bg-gradient-to-br ${card.color} rounded-2xl p-5 text-white shadow-lg card-hover animate-fadeInUp`}
                            style={{ animationDelay: `${i * 0.06}s` }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-white/80 text-xs font-medium">{card.label}</p>
                                <span className="text-xl">{card.icon}</span>
                            </div>
                            <p className="text-2xl font-bold">{card.value}</p>
                        </div>
                    ))}
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-indigo-50 overflow-hidden animate-fadeInUp delay-4">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg">All Registered Users</h3>
                            <p className="text-sm text-gray-400 mt-0.5">{users.length} users on the platform</p>
                        </div>
                        <div className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-xl text-sm font-semibold">
                            {users.length} Total
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Monthly Income</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users.map((u, i) => (
                                    <tr
                                        key={u._id}
                                        className="hover:bg-indigo-50/30 transition-all animate-fadeInUp"
                                        style={{ animationDelay: `${i * 0.05}s` }}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                                                    {u.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-semibold text-gray-800">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                u.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'bg-indigo-50 text-indigo-600'
                                            }`}>
                                                {u.role === 'admin' ? '👑 Admin' : '👤 User'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-700">
                                            ₹{u.monthlyIncome?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">
                                            {new Date(u.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            {u.role !== 'admin' ? (
                                                <button
                                                    onClick={() => handleDeleteUser(u._id, u.name)}
                                                    className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                                                >
                                                    🗑️ Delete
                                                </button>
                                            ) : (
                                                <span className="text-gray-300 text-xs">Protected</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;