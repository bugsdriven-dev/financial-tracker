import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const freqConfig = {
    daily:   { grad:'linear-gradient(135deg,#6366f1,#4f46e5)', glow:'rgba(99,102,241,0.4)',  badge:'badge-blue',   label:'Daily'   },
    weekly:  { grad:'linear-gradient(135deg,#a855f7,#7c3aed)', glow:'rgba(168,85,247,0.4)',  badge:'badge-purple', label:'Weekly'  },
    monthly: { grad:'linear-gradient(135deg,#10b981,#059669)', glow:'rgba(16,185,129,0.4)',  badge:'badge-green',  label:'Monthly' },
};
const stagger  = { hidden:{opacity:0}, show:{opacity:1, transition:{staggerChildren:0.08}} };
const fadeUp   = { hidden:{opacity:0,y:20}, show:{opacity:1,y:0,transition:{duration:0.4,ease:[0.16,1,0.3,1]}} };
const GUIDE_KEY = 'wt_habits_guide_seen';

function Habits() {
    const [habits, setHabits]       = useState([]);
    const [loading, setLoading]     = useState(true);
    const [showForm, setShowForm]   = useState(false);
    const [name, setName]           = useState('');
    const [freq, setFreq]           = useState('daily');
    const [error, setError]         = useState('');
    const [toast, setToast]         = useState('');
    const [showGuide, setShowGuide] = useState(!sessionStorage.getItem(GUIDE_KEY));

    useEffect(() => { fetchHabits(); }, []);

    const fetchHabits = async () => {
        try { const r = await API.get('/habits'); setHabits(r.data); }
        catch (e) { console.log(e); } finally { setLoading(false); }
    };

    const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(''),3000); };

    const handleSubmit = async (e) => {
        e.preventDefault(); setError('');
        try {
            await API.post('/habits', { name, frequency:freq });
            setName(''); setFreq('daily'); setShowForm(false); fetchHabits();
        } catch (e) { setError(e.response?.data?.message || 'Failed'); }
    };

    const handleComplete = async (id) => {
        try { const r = await API.put(`/habits/${id}/complete`); showToast(r.data.message); fetchHabits(); }
        catch (e) { showToast(e.response?.data?.message || 'Error'); }
    };

    const handleDelete = async (id) => {
        try { await API.delete(`/habits/${id}`); fetchHabits(); } catch (e) { console.log(e); }
    };

    const totalStreak = habits.reduce((s,h)=>s+h.streak,0);
    const maxStreak   = habits.reduce((max,h)=>Math.max(max,h.streak),0);

    return (
        <div className="min-h-screen relative" style={{ background:'var(--bg)' }}>
            <div className="grid-bg" />
            <motion.div animate={{ y:[0,-20,0] }} transition={{ duration:8, repeat:Infinity }}
                className="orb w-80 h-80" style={{ top:-80, right:-60, background:'rgba(245,158,11,0.18)' }} />
            <motion.div animate={{ y:[0,18,0] }} transition={{ duration:7, repeat:Infinity, delay:1 }}
                className="orb w-64 h-64" style={{ bottom:-60, left:-60, background:'rgba(99,102,241,0.18)' }} />
            <Navbar />

            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity:0, y:-20, x:'-50%' }} animate={{ opacity:1, y:0, x:'-50%' }}
                        exit={{ opacity:0, y:-20, x:'-50%' }}
                        className="fixed top-20 left-1/2 z-50 px-6 py-3 rounded-2xl text-sm font-bold text-white"
                        style={{ background:'linear-gradient(135deg,#6366f1,#a855f7)', boxShadow:'0 0 30px rgba(99,102,241,0.5)' }}>
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-4xl mx-auto px-6 py-8 relative z-10">
                <AnimatePresence>
                    {showGuide && (
                        <motion.div initial={{ opacity:0, y:-15 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                            className="glass-bright rounded-2xl p-5 mb-6" style={{ border:'1px solid rgba(245,158,11,0.25)' }}>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="section-eyebrow mb-1" style={{ color:'#f59e0b' }}>How Habits work</p>
                                    <h3 className="text-white font-bold" style={{ fontFamily:'Syne,sans-serif' }}>Build streaks, build wealth 🔥</h3>
                                </div>
                                <button onClick={() => { sessionStorage.setItem(GUIDE_KEY,'1'); setShowGuide(false); }}
                                    className="text-gray-500 hover:text-white text-sm btn-ghost w-7 h-7 flex items-center justify-center rounded-lg">✕</button>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-2 text-xs text-gray-400">
                                <div className="guide-pill">🌱 Add a financial habit — e.g. <strong className="text-white">"Save ₹100 daily"</strong> or <strong className="text-white">"Review expenses weekly"</strong>.</div>
                                <div className="guide-pill">✅ Hit <strong className="text-white">Mark Complete</strong> each time you do it. Your streak goes up!</div>
                                <div className="guide-pill">🔥 Streaks reset if you miss the day/week/month. Stay consistent!</div>
                                <div className="guide-pill">📅 Set the right <strong className="text-white">frequency</strong> — Daily for small actions, Monthly for big goals.</div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
                    className="flex items-center justify-between mb-6">
                    <div>
                        <p className="section-eyebrow mb-1">Consistency Engine</p>
                        <h2 className="text-3xl font-black text-white" style={{ fontFamily:'Syne,sans-serif' }}>Habits</h2>
                    </div>
                    <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                        onClick={() => setShowForm(!showForm)} className="btn-neon px-6 py-3 text-sm font-bold">
                        {showForm ? '✕ Cancel' : '+ New Habit'}
                    </motion.button>
                </motion.div>

                {habits.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {[
                            { label:'Total Habits',    value:habits.length,    icon:'◈', glow:'rgba(99,102,241,0.4)',  grad:'linear-gradient(135deg,#6366f1,#a855f7)' },
                            { label:'Combined Streak', value:`${totalStreak}d`, icon:'🔥', glow:'rgba(245,158,11,0.4)', grad:'linear-gradient(135deg,#f59e0b,#d97706)' },
                            { label:'Best Streak',     value:`${maxStreak}d`,  icon:'★', glow:'rgba(16,185,129,0.4)', grad:'linear-gradient(135deg,#10b981,#059669)' },
                        ].map(s => (
                            <div key={s.label} className="neo-card p-4 text-center cursor-default">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base mx-auto mb-2"
                                    style={{ background:s.grad, boxShadow:`0 0 15px ${s.glow}` }}>{s.icon}</div>
                                <p className="text-lg font-black text-white ticker" style={{ fontFamily:'Syne,sans-serif' }}>{s.value}</p>
                                <p className="section-eyebrow mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>
                )}

                <AnimatePresence>
                    {showForm && (
                        <motion.div initial={{ opacity:0, scale:0.95, y:-10 }} animate={{ opacity:1, scale:1, y:0 }}
                            exit={{ opacity:0, scale:0.95, y:-10 }} transition={{ duration:0.3 }}
                            className="glass-bright rounded-2xl p-6 mb-6" style={{ border:'1px solid rgba(245,158,11,0.25)' }}>
                            <p className="section-eyebrow mb-1" style={{ color:'#f59e0b' }}>New Routine</p>
                            <h3 className="text-white font-bold text-lg mb-5" style={{ fontFamily:'Syne,sans-serif' }}>Add a Habit</h3>
                            {error && (
                                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="mb-4 px-4 py-3 rounded-xl text-sm"
                                    style={{ background:'rgba(244,63,94,0.12)', border:'1px solid rgba(244,63,94,0.3)', color:'#fb7185' }}>
                                    ⚠ {error}
                                </motion.div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block section-eyebrow mb-2">Habit Name</label>
                                    <input type="text" value={name} onChange={e=>setName(e.target.value)} required
                                        placeholder="e.g. Save ₹200 today, Review expenses" className="neo-input" />
                                </div>
                                <div>
                                    <label className="block section-eyebrow mb-3">Frequency</label>
                                    <div className="flex gap-3">
                                        {Object.entries(freqConfig).map(([key,cfg]) => (
                                            <motion.button key={key} type="button" whileTap={{ scale:0.95 }}
                                                onClick={() => setFreq(key)}
                                                className="flex-1 py-3 rounded-xl font-bold text-sm transition-all"
                                                style={{
                                                    background: freq===key ? cfg.grad : 'rgba(255,255,255,0.04)',
                                                    border: freq===key ? 'none' : '1px solid rgba(255,255,255,0.08)',
                                                    color: freq===key ? 'white' : 'var(--muted)',
                                                    boxShadow: freq===key ? `0 0 20px ${cfg.glow}` : 'none',
                                                }}>
                                                {cfg.label}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                                <motion.button type="submit" whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                                    className="btn-neon w-full py-3.5 font-bold"
                                    style={{ background:'linear-gradient(135deg,#f59e0b,#d97706)', boxShadow:'0 8px 30px rgba(245,158,11,0.35)' }}>
                                    Start Habit 🔥
                                </motion.button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {loading ? (
                    <div className="space-y-4">{[...Array(3)].map((_,i) => <div key={i} className="skeleton-neo h-24 rounded-2xl" />)}</div>
                ) : habits.length === 0 ? (
                    <div className="text-center py-16">
                        <motion.div animate={{ y:[0,-12,0], rotate:[0,5,-5,0] }} transition={{ duration:3, repeat:Infinity }} className="text-5xl mb-4 opacity-40">◈</motion.div>
                        <p className="text-gray-500 font-semibold">No habits yet</p>
                        <p className="text-gray-600 text-sm mt-1">Add your first financial habit to start your streak.</p>
                    </div>
                ) : (
                    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
                        {habits.map((h,i) => {
                            const cfg = freqConfig[h.frequency] || freqConfig.daily;
                            return (
                                <motion.div key={h._id} variants={fadeUp} whileHover={{ scale:1.01, x:3 }}
                                    className="neo-card p-5 flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <motion.div animate={{ scale:[1,1.1,1] }} transition={{ duration:2.5+i*0.3, repeat:Infinity }}
                                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                                            style={{ background:cfg.grad, boxShadow:`0 0 20px ${cfg.glow}` }}>
                                            🔥
                                        </motion.div>
                                        <div>
                                            <p className="text-gray-100 font-bold text-base">{h.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className={`${cfg.badge} px-2 py-0.5 rounded-lg text-xs font-bold`}>{cfg.label}</div>
                                                <span className="text-gray-500 text-xs">{h.streak>0?`${h.streak}-day streak 🔥`:'No streak yet'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                                            onClick={() => handleComplete(h._id)}
                                            className="btn-neon px-4 py-2 text-xs font-bold"
                                            style={{ background:cfg.grad, boxShadow:`0 0 15px ${cfg.glow}` }}>
                                            ✓ Done
                                        </motion.button>
                                        <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
                                            onClick={() => handleDelete(h._id)}
                                            className="btn-danger px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                                            Delete
                                        </motion.button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default Habits;