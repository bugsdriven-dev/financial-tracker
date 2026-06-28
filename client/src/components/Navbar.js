import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => { logout(); navigate('/login'); };

    const navLinks = [
        { path: '/dashboard',    label: 'Dashboard',    icon: '⬡' },
        { path: '/transactions', label: 'Transactions', icon: '⇅' },
        { path: '/habits',       label: 'Habits',       icon: '◈' },
        { path: '/goals',        label: 'Goals',        icon: '◎' },
        { path: '/investments',  label: 'Investments',  icon: '◆' },
        { path: '/analytics',    label: 'Analytics',    icon: '▲' },
    ];

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="navbar-neo sticky top-0 z-50"
        >
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                <Link to="/dashboard" className="flex items-center gap-3 group">
                    <motion.div
                        whileHover={{ scale: 1.08, rotate: 8 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-9 h-9 rounded-xl flex items-center justify-center relative"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 0 20px rgba(99,102,241,0.5)' }}
                    >
                        <span className="text-base relative z-10">💎</span>
                        <div className="absolute inset-0 rounded-xl border border-indigo-400/30 spin-slow" />
                    </motion.div>
                    <div>
                        <span className="text-base font-bold grad-text" style={{ fontFamily: 'Syne, sans-serif' }}>WealthTracker</span>
                        <div className="text-[9px] text-indigo-400/60 uppercase tracking-widest -mt-0.5">Financial OS</div>
                    </div>
                </Link>

                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => {
                        const active = location.pathname === link.path;
                        return (
                            <Link key={link.path} to={link.path}>
                                <motion.div
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                    className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                        active ? 'nav-active text-indigo-300' : 'text-gray-500 hover:text-indigo-400 hover:bg-white/5'
                                    }`}
                                >
                                    <span className={`text-xs font-mono ${active ? 'text-indigo-400' : 'text-gray-600'}`}>{link.icon}</span>
                                    <span>{link.label}</span>
                                    {active && (
                                        <motion.div
                                            layoutId="navGlow"
                                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 rounded-full"
                                            style={{ background: 'linear-gradient(90deg, transparent, #818cf8, transparent)' }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                    {user?.role === 'admin' && (
                        <Link to="/admin">
                            <motion.div whileHover={{ scale: 1.04 }}
                                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                                    location.pathname === '/admin' ? 'nav-active text-purple-300' : 'text-gray-500 hover:text-purple-400 hover:bg-white/5'
                                }`}>
                                ♛ Admin
                            </motion.div>
                        </Link>
                    )}
                </div>

                <div className="hidden md:flex items-center gap-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
                            className="w-1.5 h-1.5 rounded-full bg-green-400"
                            style={{ boxShadow: '0 0 6px #10b981' }} />
                        <span className="text-green-400/70 font-medium" style={{ fontSize: '0.7rem' }}>LIVE</span>
                    </div>
                    <motion.div whileHover={{ scale: 1.03 }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                        style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black"
                            style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', boxShadow: '0 0 10px rgba(99,102,241,0.4)' }}>
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-300 font-semibold">{user?.name?.split(' ')[0]}</span>
                    </motion.div>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={handleLogout} className="btn-ghost px-4 py-2 text-sm font-semibold">
                        Exit ⎋
                    </motion.button>
                </div>

                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden btn-ghost w-10 h-10 flex items-center justify-center text-lg">
                    {menuOpen ? '✕' : '☰'}
                </motion.button>
            </div>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
                        className="md:hidden overflow-hidden" style={{ borderTop: '1px solid rgba(99,102,241,0.15)' }}>
                        <div className="px-4 py-4 space-y-1">
                            {navLinks.map(link => {
                                const active = location.pathname === link.path;
                                return (
                                    <Link key={link.path} to={link.path} onClick={() => setMenuOpen(false)}>
                                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                            active ? 'nav-active text-indigo-300' : 'text-gray-400 hover:bg-white/5'
                                        }`}>
                                            <span className="font-mono text-xs">{link.icon}</span>
                                            {link.label}
                                        </div>
                                    </Link>
                                );
                            })}
                            <div className="divider my-2" />
                            <button onClick={handleLogout} className="w-full btn-ghost px-4 py-3 text-sm text-left">Exit ⎋</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}

export default Navbar;