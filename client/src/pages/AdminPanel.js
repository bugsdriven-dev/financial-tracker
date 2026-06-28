import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const stagger = { hidden:{opacity:0}, show:{opacity:1, transition:{staggerChildren:0.07}} };
const fadeUp  = { hidden:{opacity:0,y:20,scale:0.95}, show:{opacity:1,y:0,scale:1,transition:{duration:0.4,ease:[0.16,1,0.3,1]}} };

function AdminPanel() {
    const { user } = useAuth();
    const navigate  = useNavigate();
    const [stats, setStats]     = useState(null);
    const [users, setUsers]     = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState('');

    useEffect(() => {
        if (user?.role !== 'admin') { navigate('/dashboard'); return; }
        fetchAdminData();
    }, [user, navigate]);

    const fetchAdminData = async () => {
        try {
            const [s, u] = await Promise.all([API.get('/admin/stats'), API.get('/admin/users')]);
            setStats(s.data); setUsers(u.data);
        } catch (e) { setError('Failed to load admin data.'); }
        finally { setLoading(false); }
    };

    const handleDeleteUser = async (id, name) => {
        if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
        try { await API.delete(`/admin/users/${id}`); setUsers(users.filter(u=>u._id!==id)); }
        catch (e) { alert('Failed to delete user'); }
    };

    const statCards = stats ? [
        { label:'Total Users',      value:stats.totalUsers,             grad:'linear-gradient(135deg,#6366f1,#4f46e5)', glow:'rgba(99,102,241,0.5)',  icon:'👥' },
        { label:'New This Week',    value:stats.newUsersThisWeek,       grad:'linear-gradient(135deg,#10b981,#059669)', glow:'rgba(16,185,129,0.5)',  icon:'🆕' },
        { label:'Transactions',     value:stats.totalTransactions,      grad:'linear-gradient(135deg,#a855f7,#7c3aed)', glow:'rgba(168,85,247,0.5)',  icon:'⇅'  },
        { label:'Habits Tracked',   value:stats.totalHabits,            grad:'linear-gradient(135deg,#f59e0b,#d97706)', glow:'rgba(245,158,11,0.5)',  icon:'🔥' },
        { label:'Goals Set',        value:stats.totalGoals,             grad:'linear-gradient(135deg,#f43f5e,#e11d48)', glow:'rgba(244,63,94,0.5)',   icon:'◎'  },
        { label:'Platform Income',  value:`₹${stats.totalIncomeAcrossPlatform?.toLocaleString()}`,  grad:'linear-gradient(135deg,#06b6d4,#0891b2)', glow:'rgba(6,182,212,0.5)',   icon:'↑'  },
        { label:'Platform Expense', value:`₹${stats.totalExpenseAcrossPlatform?.toLocaleString()}`, grad:'linear-gradient(135deg,#f97316,#ea580c)', glow:'rgba(249,115,22,0.5)',  icon:'↓'  },
        { label:'Net Savings',      value:`₹${((stats.totalIncomeAcrossPlatform||0)-(stats.totalExpenseAcrossPlatform||0)).toLocaleString()}`, grad:'linear-gradient(135deg,#6366f1,#a855f7)', glow:'rgba(99,102,241,0.5)', icon:'◆' },
    ] : [];

    if (loading) return (
        <div className="min-h-screen" style={{ background:'var(--bg)' }}>
            <div className="grid-bg" /><Navbar />
            <div className="flex items-center justify-center h-96 relative z-10">
                <div className="text-center">
                    <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}
                        className="w-14 h-14 rounded-full mx-auto mb-4"
                        style={{ border:'2px solid rgba(168,85,247,0.2)', borderTop:'2px solid #a855f7', boxShadow:'0 0 20px rgba(168,85,247,0.3)' }} />
                    <motion.p animate={{ opacity:[0.4,1,0.4] }} transition={{ duration:1.5, repeat:Infinity }}
                        className="text-purple-400 font-semibold text-sm tracking-widest uppercase">Loading admin panel...</motion.p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen relative" style={{ background:'var(--bg)' }}>
            <div className="grid-bg" />
            <motion.div animate={{ y:[0,-25,0] }} transition={{ duration:10, repeat:Infinity }}
                className="orb w-96 h-96" style={{ top:-150, right:-100, background:'rgba(168,85,247,0.22)' }} />
            <motion.div animate={{ y:[0,20,0] }} transition={{ duration:8, repeat:Infinity, delay:2 }}
                className="orb w-72 h-72" style={{ bottom:-80, left:-80, background:'rgba(99,102,241,0.18)' }} />
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
                <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
                    className="flex items-center gap-4 mb-8">
                    <Tilt tiltMaxAngleX={12} tiltMaxAngleY={12} scale={1.06}>
                        <motion.div whileHover={{ rotate:8 }}
                            className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl relative pulse-neo"
                            style={{ background:'linear-gradient(135deg,#a855f7,#6366f1)', boxShadow:'0 0 40px rgba(168,85,247,0.5)' }}>
                            ♛
                            <div className="absolute inset-0 rounded-3xl border border-purple-400/30 spin-slow" />
                        </motion.div>
                    </Tilt>
                    <div>
                        <p className="section-eyebrow mb-1" style={{ color:'#a855f7' }}>Superuser Access</p>
                        <h2 className="text-3xl font-black text-white" style={{ fontFamily:'Syne,sans-serif' }}>Admin Panel</h2>
                    </div>
                </motion.div>

                {error && (
                    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="mb-6 px-4 py-3 rounded-xl text-sm"
                        style={{ background:'rgba(244,63,94,0.12)', border:'1px solid rgba(244,63,94,0.3)', color:'#fb7185' }}>
                        ⚠ {error}
                    </motion.div>
                )}

                <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {statCards.map(c => (
                        <Tilt key={c.label} tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable glareMaxOpacity={0.07} scale={1.03}>
                            <motion.div variants={fadeUp} className="neo-card p-5 cursor-default">
                                <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full opacity-15 pointer-events-none"
                                    style={{ background:c.glow, filter:'blur(18px)' }} />
                                <div className="flex items-center justify-between mb-3 relative z-10">
                                    <p className="section-eyebrow text-xs">{c.label}</p>
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                                        style={{ background:c.grad, boxShadow:`0 0 12px ${c.glow}` }}>{c.icon}</div>
                                </div>
                                <p className="text-xl font-black text-white ticker relative z-10" style={{ fontFamily:'Syne,sans-serif' }}>{c.value}</p>
                            </motion.div>
                        </Tilt>
                    ))}
                </motion.div>

                <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5, duration:0.6 }}
                    className="glass-bright rounded-2xl overflow-hidden" style={{ border:'1px solid rgba(168,85,247,0.2)' }}>
                    <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                        <div>
                            <p className="section-eyebrow mb-1" style={{ color:'#a855f7' }}>User Management</p>
                            <h3 className="text-white font-bold text-xl" style={{ fontFamily:'Syne,sans-serif' }}>All Registered Users</h3>
                        </div>
                        <div className="badge-purple px-3 py-1.5 rounded-xl text-sm font-bold">{users.length} users</div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.05)', background:'rgba(255,255,255,0.02)' }}>
                                    {['User','Email','Role','Monthly Income','Joined','Action'].map(h => (
                                        <th key={h} className="text-left px-6 py-4 section-eyebrow text-xs">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u,i) => (
                                    <motion.tr key={u._id}
                                        initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.05 }}
                                        whileHover={{ backgroundColor:'rgba(99,102,241,0.04)' }}
                                        className="transition-all" style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <motion.div whileHover={{ scale:1.1, rotate:5 }}
                                                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black"
                                                    style={{ background:'linear-gradient(135deg,#6366f1,#a855f7)', boxShadow:'0 0 10px rgba(99,102,241,0.4)' }}>
                                                    {u.name?.charAt(0).toUpperCase()}
                                                </motion.div>
                                                <span className="font-semibold text-gray-200 text-sm">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${u.role==='admin'?'badge-purple':'badge-blue'}`}>
                                                {u.role==='admin'?'♛ Admin':'◉ User'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-300 text-sm">₹{u.monthlyIncome?.toLocaleString()||'—'}</td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {new Date(u.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                                        </td>
                                        <td className="px-6 py-4">
                                            {u.role!=='admin' ? (
                                                <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:0.93 }}
                                                    onClick={() => handleDeleteUser(u._id,u.name)}
                                                    className="btn-danger px-4 py-2 text-xs font-semibold">Delete</motion.button>
                                            ) : (
                                                <span className="text-gray-600 text-xs font-medium">Protected</span>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default AdminPanel;