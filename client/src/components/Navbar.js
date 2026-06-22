import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-blue-600">💰 Wealth Tracker</h1>

            <div className="flex items-center gap-6">
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
                <Link to="/transactions" className="text-gray-600 hover:text-blue-600">Transactions</Link>
                <Link to="/habits" className="text-gray-600 hover:text-blue-600">Habits</Link>
                <Link to="/goals" className="text-gray-600 hover:text-blue-600">Goals</Link>
                <Link to="/investments" className="text-gray-600 hover:text-blue-600">Investments</Link>
                <Link to="/analytics" className="text-gray-600 hover:text-blue-600">Analytics</Link>

                {user?.role === 'admin' && (
                    <Link to="/admin" className="text-purple-600 font-medium hover:text-purple-800">
                        Admin Panel 👑
                    </Link>
                )}

                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">Hi, {user?.name}</span>
                    <button
                        onClick={handleLogout}
                        className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-sm hover:bg-red-100"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;