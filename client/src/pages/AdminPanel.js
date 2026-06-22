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
        // If not admin, redirect to dashboard
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
            setError('Failed to load admin data. Make sure you are logged in as admin.');
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">Loading admin panel...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="p-6 max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    Admin Panel 👑
                </h2>
                <p className="text-gray-500 mb-6">Platform overview and user management</p>

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-blue-500">
                            <p className="text-gray-500 text-sm">Total Users</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-green-500">
                            <p className="text-gray-500 text-sm">New This Week</p>
                            <p className="text-2xl font-bold text-green-600">{stats.newUsersThisWeek}</p>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-purple-500">
                            <p className="text-gray-500 text-sm">Total Transactions</p>
                            <p className="text-2xl font-bold text-purple-600">{stats.totalTransactions}</p>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-orange-500">
                            <p className="text-gray-500 text-sm">Total Habits</p>
                            <p className="text-2xl font-bold text-orange-600">{stats.totalHabits}</p>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-pink-500">
                            <p className="text-gray-500 text-sm">Total Goals</p>
                            <p className="text-2xl font-bold text-pink-600">{stats.totalGoals}</p>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-teal-500">
                            <p className="text-gray-500 text-sm">Platform Income</p>
                            <p className="text-2xl font-bold text-teal-600">
                                ₹{stats.totalIncomeAcrossPlatform?.toLocaleString()}
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-red-500">
                            <p className="text-gray-500 text-sm">Platform Expense</p>
                            <p className="text-2xl font-bold text-red-600">
                                ₹{stats.totalExpenseAcrossPlatform?.toLocaleString()}
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-gray-500">
                            <p className="text-gray-500 text-sm">Net Savings</p>
                            <p className="text-2xl font-bold text-gray-700">
                                ₹{(stats.totalIncomeAcrossPlatform - stats.totalExpenseAcrossPlatform)?.toLocaleString()}
                            </p>
                        </div>
                    </div>
                )}

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b">
                        <h3 className="font-semibold text-gray-800">All Registered Users</h3>
                        <p className="text-sm text-gray-400 mt-1">{users.length} users total</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left p-4 text-sm font-medium text-gray-500">Name</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-500">Email</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-500">Role</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-500">Monthly Income</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-500">Joined</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-500">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {users.map((u) => (
                                    <tr key={u._id} className="hover:bg-gray-50">
                                        <td className="p-4 font-medium text-gray-800">{u.name}</td>
                                        <td className="p-4 text-gray-600">{u.email}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                u.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-600'
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            ₹{u.monthlyIncome?.toLocaleString()}
                                        </td>
                                        <td className="p-4 text-gray-400 text-sm">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            {u.role !== 'admin' && (
                                                <button
                                                    onClick={() => handleDeleteUser(u._id, u.name)}
                                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                >
                                                    Delete
                                                </button>
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