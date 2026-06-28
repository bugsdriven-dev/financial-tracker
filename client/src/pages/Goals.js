import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Tilt from 'react-parallax-tilt';

const COLORS = [
    { grad:'linear-gradient(135deg,#6366f1,#818cf8)', glow:'rgba(99,102,241,0.5)',  text:'#818cf8' },
    { grad:'linear-gradient(135deg,#a855f7,#c084fc)', glow:'rgba(168,85,247,0.5)',  text:'#c084fc' },
    { grad:'linear-gradient(135deg,#06b6d4,#67e8f9)', glow:'rgba(6,182,212,0.5)',   text:'#67e8f9' },
    { grad:'linear-gradient(135deg,#10b981,#34d399)', glow:'rgba(16,185,129,0.5)',  text:'#34d399' },
    { grad:'linear-gradient(135deg,#f59e0b,#fbbf24)', glow:'rgba(245,158,11,0.5)',  text:'#fbbf24' },
];
const stagger  = { hidden:{opacity:0}, show:{opacity:1, transition:{staggerChildren:0.1}} };
const fadeUp   = { hidden:{opacity:0,y:24}, show:{opacity:1,y:0,transition:{duration:0.5,ease:[0.16,1,0.3,1]}} };
const GUIDE_KEY = 'wt_goals_guide_seen';

function Goals() {
    const [goals, setGoals]         = useState([]);
    const [loading, setLoading]     = useState(true);
    const [showForm, setShowForm]   = useState(false);
    const [name, setName]           = useState('');
    const [target, setTarget]       = useState('');
    const [deadline, setDeadline]   = useState('');
    const [error, setError]         = useState('');
    const [addingTo, setAddingTo]   = useState(null);
    const [money, setMoney]         = useState('');
    const [showGuide, setShowGuide] = useState(!sessionStorage.getItem(GUIDE_KEY));

    useEffect(() => { fetchGoals(); }, []);

    const fetchGoals = async () => {
        try { const r = await API.get('/goals'); setGoals(r.data); }
        catch (e) { console.log(e); } finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setError('');
        try {
            await API.post('/goals', { name, targetAmount:Number(target), deadline });
            setName(''); setTarget(''); setDeadline(''); setShowForm(false); fetchGoals();
        } catch (e) { setError(e.response?.data?.message || 'Failed'); }
    };

    const handleAddMoney = async (id) => {
        try { await API.put(`/goals/${id}/save`, { amount:Number(money) }); setMoney(''); setAddingTo(null); fetchGoals(); }
        catch (e) { console.log(e); }
    };

    const handleDelete = async (id) => {
        try { await API.delete(`/goals/${id}`); fetchGoals(); } catch (e) { console.log(e); }
    };

    const totalSaved  = goals.reduce((s,g)=>s+g.savedAmount,0);
    const totalTarget = goals.reduce((s,g)=>s+g.targetAmount,0);

    return (
        <div className="min-h-screen relative" style={{ background:'var(--bg)' }}>
            <div className="grid-bg" />
            <motion.div animate={{ y:[0,-22,0] }} transition={{ duration:9, repeat:Infinity }}
                className="orb w-80 h-80" style={{ top:-80, right:-60, background:'rgba(99,102,241,0.2)' }} />
            <motion.div animate={{ y:[0,18,0] }} transition={{ duration:7, repeat:Infinity, delay:1 }}
                className="orb w-64 h-64" style={{ bottom:-60, left:-60, background:'rgba(6,182,212,0.15)' }} />
            <Navbar />

            <AnimatePresence>
                {addingTo && (
                    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                        className="modal-overlay" onClick={() => setAddingTo(null)}>
                        <motion.div initial={{ scale:0.9, opacity:0, y:20 }} animate={{ scale:1, opacity:1, y:0 }}
                            exit={{ scale:0.9, opacity:0, y:20 }} transition={{ duration:0.3, ease:[0.16,1,0.3,1] }}
                            onClick={e=>e.stopPropagation()}
                            className="glass-bright rounded-3xl p-8 w-full max-w-sm"
                            style={{ border:'1px solid rgba(16,185,129,0.3)' }}>
                            <p className="section-eyebrow mb-1" style={{ color:'#10b981' }}>Add Savings</p>
                            <h3 className="text-white font-bold text-xl mb-6" style={{ fontFamily:'Syne,sans-serif' }}>How much did you save?</h3>
                            <div className="relative mb-5">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 font-bold">₹</span>
                                <input type="number" value={money} onChange={e=>setMoney(e.target.value)} required min="1"
                                    placeholder="Enter amount" className="neo-input pl-8" autoFocus />
                            </div>
                            <div className="flex gap-3">
                                <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                                    onClick={() => handleAddMoney(addingTo)}
                                    className="btn-neon flex-1 py-3 font-bold"
                                    style={{ background:'linear-gradient(135deg,#10b981,#059669)', boxShadow:'0 0 25px rgba(16,185,129,0.4)' }}>
                                    Save It ✓
                                </motion.button>
                                <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                                    onClick={() => setAddingTo(null)} className="btn-ghost flex-1 py-3 font-bold">
                                    Cancel
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-4xl mx-auto px-6 py-8 relative z-10">
                <AnimatePresence>
                    {showGuide && (
                        <motion.div initial={{ opacity:0, y:-15 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                            className="glass-bright rounded-2xl p-5 mb-6" style={{ border:'1px solid rgba(99,102,241,0.3)' }}>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="section-eyebrow mb-1">How Goals work</p>
                                    <h3 className="text-white font-bold" style={{ fontFamily:'Syne,sans-serif' }}>Set targets, track progress ◎</h3>
                                </div>
                                <button onClick={() => { sessionStorage.setItem(GUIDE_KEY,'1'); setShowGuide(false); }}
                                    className="text-gray-500 hover:text-white text-sm btn-ghost w-7 h-7 flex items-center justify-center rounded-lg">✕</button>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-2 text-xs text-gray-400">
                                <div className="guide-pill">🎯 Create a goal with a <strong className="text-white">name, target amount</strong> and <strong className="text-white">deadline</strong>.</div>
                                <div className="guide-pill">💰 Tap <strong className="text-white">+ Add Savings</strong> on any card whenever you set money aside for it.</div>
                                <div className="guide-pill">📊 The progress bar fills as you save. Watch it hit 100%!</div>
                                <div className="guide-pill">📅 The deadline keeps you accountable — you'll see days remaining.</div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
                    className="flex items-center justify-between mb-6">
                    <div>
                        <p className="section-eyebrow mb-1">Financial Milestones</p>
                        <h2 className="text-3xl font-black text-white" style={{ fontFamily:'Syne,sans-serif' }}>Savings Goals</h2>
                    </div>
                    <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                        onClick={() => setShowForm(!showForm)} className="btn-neon px-6 py-3 text-sm font-bold">
                        {showForm ? '✕ Cancel' : '+ New Goal'}
                    </motion.button>
                </motion.div>

                {goals.length > 0 && (
                    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}
                        className="glass-bright rounded-2xl p-5 mb-6" style={{ border:'1px solid rgba(99,102,241,0.2)' }}>
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-gray-400 text-sm font-semibold">Overall Progress</p>
                            <span className="text-indigo-400 font-black text-sm">
                                {totalTarget>0 ? Math.round((totalSaved/totalTarget)*100) : 0}%
                            </span>
                        </div>
                        <div className="progress-track">
                            <motion.div className="progress-fill" initial={{ width:0 }}
                                animate={{ width: totalTarget>0 ? `${Math.min((totalSaved/totalTarget)*100,100)}%` : '0%' }}
                                transition={{ duration:1.4, ease:[0.16,1,0.3,1] }}
                                style={{ background:'linear-gradient(90deg,#6366f1,#a855f7,#06b6d4)', boxShadow:'0 0 15px rgba(99,102,241,0.5)' }} />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>₹{totalSaved.toLocaleString()} saved across {goals.length} goal{goals.length!==1?'s':''}</span>
                            <span>₹{totalTarget.toLocaleString()} total target</span>
                        </div>
                    </motion.div>
                )}

                <AnimatePresence>
                    {showForm && (
                        <motion.div initial={{ opacity:0, scale:0.95, y:-10 }} animate={{ opacity:1, scale:1, y:0 }}
                            exit={{ opacity:0, scale:0.95, y:-10 }} transition={{ duration:0.3 }}
                            className="glass-bright rounded-2xl p-6 mb-6" style={{ border:'1px solid rgba(99,102,241,0.3)' }}>
                            <p className="section-eyebrow mb-1">New Target</p>
                            <h3 className="text-white font-bold text-lg mb-5" style={{ fontFamily:'Syne,sans-serif' }}>Create Goal</h3>
                            {error && (
                                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="mb-4 px-4 py-3 rounded-xl text-sm"
                                    style={{ background:'rgba(244,63,94,0.12)', border:'1px solid rgba(244,63,94,0.3)', color:'#fb7185' }}>
                                    ⚠ {error}
                                </motion.div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block section-eyebrow mb-2">Goal Name</label>
                                    <input type="text" value={name} onChange={e=>setName(e.target.value)} required
                                        placeholder="e.g. Emergency Fund, New Laptop, Vacation" className="neo-input" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block section-eyebrow mb-2">Target Amount (₹)</label>
                                        <input type="number" value={target} onChange={e=>setTarget(e.target.value)} required min="1"
                                            placeholder="50000" className="neo-input" />
                                    </div>
                                    <div>
                                        <label className="block section-eyebrow mb-2">Deadline</label>
                                        <input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)}
                                            className="neo-input" style={{ colorScheme:'dark' }} />
                                    </div>
                                </div>
                                <motion.button type="submit" whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                                    className="btn-neon w-full py-3.5 font-bold">Create Goal ◎</motion.button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{[...Array(4)].map((_,i)=><div key={i} className="skeleton-neo h-48 rounded-2xl"/>)}</div>
                ) : goals.length === 0 ? (
                    <div className="text-center py-16">
                        <motion.div animate={{ y:[0,-12,0] }} transition={{ duration:2.5, repeat:Infinity }} className="text-5xl mb-4 opacity-40">◎</motion.div>
                        <p className="text-gray-500 font-semibold">No goals yet</p>
                        <p className="text-gray-600 text-sm mt-1">Create your first savings goal and start building toward it.</p>
                    </div>
                ) : (
                    <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {goals.map((goal,i) => {
                            const pct  = Math.min(Math.round((goal.savedAmount/goal.targetAmount)*100),100);
                            const col  = COLORS[i%COLORS.length];
                            const days = goal.deadline ? Math.max(0,Math.ceil((new Date(goal.deadline)-new Date())/(1000*60*60*24))) : null;
                            const done = pct>=100;
                            return (
                                <motion.div key={goal._id} variants={fadeUp}>
                                    <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable glareMaxOpacity={0.06} scale={1.03}>
                                        <div className="neo-card p-6 cursor-default group h-full">
                                            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-15 pointer-events-none"
                                                style={{ background:col.glow, filter:'blur(25px)' }} />
                                            <div className="flex items-start justify-between mb-4 relative z-10">
                                                <div>
                                                    <h3 className="text-gray-100 font-bold text-base">{goal.name}</h3>
                                                    {days!==null && (
                                                        <p className="text-xs mt-1" style={{ color:days<7?'#f43f5e':'var(--muted)' }}>
                                                            {done?'🎉 Completed!':days===0?'⚠ Due today!':`${days} days left`}
                                                        </p>
                                                    )}
                                                </div>
                                                {done && (
                                                    <motion.div animate={{ scale:[1,1.2,1], rotate:[0,5,-5,0] }} transition={{ duration:1.5, repeat:Infinity }} className="text-2xl">🏆</motion.div>
                                                )}
                                            </div>
                                            <div className="flex items-baseline gap-1 mb-3 relative z-10">
                                                <span className="text-2xl font-black" style={{ color:col.text, fontFamily:'Syne,sans-serif' }}>
                                                    ₹{goal.savedAmount.toLocaleString()}
                                                </span>
                                                <span className="text-gray-500 text-sm">/ ₹{goal.targetAmount.toLocaleString()}</span>
                                            </div>
                                            <div className="progress-track mb-2 relative z-10">
                                                <motion.div className="progress-fill" initial={{ width:0 }}
                                                    animate={{ width:`${pct}%` }} transition={{ duration:1.2, delay:0.3, ease:[0.16,1,0.3,1] }}
                                                    style={{ background:col.grad, boxShadow:`0 0 10px ${col.glow}` }} />
                                            </div>
                                            <div className="flex justify-between text-xs mb-4 relative z-10">
                                                <span style={{ color:col.text }}>{pct}% funded</span>
                                                <span className="text-gray-500">₹{(goal.targetAmount-goal.savedAmount).toLocaleString()} to go</span>
                                            </div>
                                            <div className="flex gap-2 relative z-10">
                                                {!done && (
                                                    <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                                                        onClick={() => setAddingTo(goal._id)}
                                                        className="btn-neon flex-1 py-2.5 text-xs font-bold"
                                                        style={{ background:col.grad, boxShadow:`0 0 15px ${col.glow}` }}>
                                                        + Add Savings
                                                    </motion.button>
                                                )}
                                                <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.9 }}
                                                    onClick={() => handleDelete(goal._id)} className="btn-danger px-3 py-2 text-xs">
                                                    Delete
                                                </motion.button>
                                            </div>
                                        </div>
                                    </Tilt>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default Goals;