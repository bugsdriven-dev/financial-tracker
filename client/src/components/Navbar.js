import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/transactions', label: 'Transactions' },
        { path: '/habits', label: 'Habits' },
        { path: '/goals', label: 'Goals' },
        { path: '/investments', label: 'Investments' },
        { path: '/analytics', label: 'Analytics' },
    ];

    return (
        <nav className="bg-white border-b border-indigo-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                {/* Brand */}
                <Link to="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow">
                        💰
                    </div>
                    <span className="text-lg font-bold text-indigo-700 tracking-tight">
                        Wealth Tracker
                    </span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                location.pathname === link.path
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {user?.role === 'admin' && (
                        <Link
                            to="/admin"
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                location.pathname === '/admin'
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'text-purple-500 hover:text-purple-700 hover:bg-purple-50'
                            }`}
                        >
                            👑 Admin
                        </Link>
                    )}
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                            {user?.name?.split(' ')[0]}
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="hidden md:block bg-red-50 text-red-500 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-100 transition-all duration-200"
                    >
                        Logout
                    </button>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                    >
                        <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
                        <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
                        <div className="w-5 h-0.5 bg-gray-600"></div>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-2 animate-slideInDown">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setMenuOpen(false)}
                            className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                                location.pathname === link.path
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {user?.role === 'admin' && (
                        <Link
                            to="/admin"
                            onClick={() => setMenuOpen(false)}
                            className="block px-3 py-2 rounded-lg text-sm font-medium text-purple-600 hover:bg-purple-50"
                        >
                            👑 Admin Panel
                        </Link>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
}

export default Navbar;