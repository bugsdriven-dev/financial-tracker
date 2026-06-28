import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Tilt from 'react-parallax-tilt';

const typeConfig = {
    'Mutual Fund':   { icon:'📊', grad:'linear-gradient(135deg,#6366f1,#818cf8)',  glow:'rgba(99,102,241,0.4)',  badge:'badge-blue'   },
    'Stocks':        { icon:'📈', grad:'linear-gradient(135deg,#10b981,#34d399)',  glow:'rgba(16,185,129,0.4)', badge:'badge-green'  },
    'Gold':          { icon:'🥇', grad:'linear-gradient(135deg,#f59e0b,#fbbf24)',  glow:'rgba(245,158,11,0.4)', badge:'badge-gold'   },
    'Fixed Deposit': { icon:'🏦', grad:'linear-gradient(135deg,#06b6d4,#67e8f9)',  glow:'rgba(6,182,212,0.4)',  badge:'badge-cyan'   },
    'PPF':           { icon:'🛡️', grad:'linear-gradient(135deg,#a855f7,#c084fc)', glow:'rgba(168,85,247,0.4)', badge:'badge-purple' },
    'Crypto':        { icon:'₿',  grad:'linear-gradient(135deg,#f97316,#fb923c)',  glow:'rgba(249,115,22,0.4)', badge:'badge-gold'   },
    'Real Estate':   { icon:'🏠', grad:'linear-gradient(135deg,#f43f5e,#fb7185)',  glow:'rgba(244,63,94,0.4)',  badge:'badge-red'    },
    'Other':         { icon:'💼', grad:'linear-gradient(135deg,#6b7280,#9ca3af)',  glow:'rgba(107,114,128,0.4)', badge:'badge-blue'  },
};
const investmentTypes = Object.keys(typeConfig);
const stagger  = { hidden:{opacity:0}, show:{opacity:1, transition:{staggerChildren:0.09}} };
const fadeUp   = { hidden:{opacity:0,y:20}, show:{opacity:1,y:0,transition:{duration:0.4,ease:[0.16,1,0.3,1]}} };
const GUIDE_KEY = 'wt_invest_guide_seen';

function Investments() {
    const [investments, setInv] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShow]   = useState(false);
    const [type, setType]       = useState('');
    const [amount, setAmount]   = useState('');
    const [description, setDesc]= useState('');
    const [error, setError]     = useState('');
    const [showGuide, setShowGuide] = useState(!sessionStorage.getItem(GUIDE_KEY));

    useEffect(() => { fetchInv(); }, []);

    const fetchInv = async () => {
        try { const r = await API.get('/investments'); setInv(r.data); }
        catch (e) { console.log(e); } finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setError('');
        try {
            await API.post('/investments', { type, amount:Number(amount), description });
            setType(''); setAmount(''); setDesc(''); setShow(false); fetchInv();
        } catch (e) { setError(e.response?.data?.message || 'Failed'); }
    };

    const handleDelete = async (id) => {
        try { await API.delete(`/investments/${id}`); fetchInv(); } catch (e) { console.log(e); }
    };

    const total = investments.reduce((s,i)=>s+i.amount,0);
    const byType = {};
    investments.forEach(inv => { byType[inv.type]=(byType[inv.type]||0)+inv.amount; });

    return (
        <div className="min-h-screen relative" style={{ background:'var(--bg)' }}>
            <div className="grid-bg" />
            <motion.div animate={{ y:[0,-20,0] }} transition={{ duration:9, repeat:Infinity }}
                className="orb w-80 h-80" style={{ top:-80, right:-60, background:'rgba(168,85,247,0.2)' }} />
            <motion.div animate={{ y:[0,18,0] }} transition={{ duration:7, repeat:Infinity, delay:1 }}
                className="orb w-64 h-64" style={{ bottom:-60, left:-60, background:'rgba(99,102,241,0.18)' }} />
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-8 relative z-10">
                <AnimatePresence>
                    {showGuide && (
                        <motion.div initial={{ opacity:0, y:-15 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                            className="glass-bright rounded-2xl p-5 mb-6" style={{ border:'1px solid rgba(168,85,247,0.3)' }}>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="section-eyebrow mb-1" style={{ color:'#a855f7' }}>How Investments work</p>
                                    <h3 className="text-white font-bold" style={{ fontFamily:'Syne,sans-serif' }}>Record what you own ◆</h3>
                                </div>
                                <button onClick={() => { sessionStorage.setItem(GUIDE_KEY,'1'); setShowGuide(false); }}
                                    className="text-gray-500 hover:text-white text-sm btn-ghost w-7 h-7 flex items-center justify-center rounded-lg">✕</button>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-2 text-xs text-gray-400">
                                <div className="guide-pill">📊 Log investments — stocks, mutual funds, FDs, crypto, gold, real estate, PPF.</div>
                                <div className="guide-pill">💡 Each entry is a <strong className="text-white">snapshot</strong> of how much you put in (not live market value).</div>
                                <div className="guide-pill">🥧 The allocation bars show which asset class you're most invested in.</div>
                                <div className="guide-pill">📈 Your total investments feed into <strong className="text-white">Net Worth</strong> on your Dashboard.</div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
                    className="flex items-center justify-between mb-6">
                    <div>
                        <p className="section-eyebrow mb-1">Portfolio Tracker</p>
                        <h2 className="text-3xl font-black text-white" style={{ fontFamily:'Syne,sans-serif' }}>Investments</h2>
                    </div>
                    <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                        onClick={() => setShow(!showForm)} className="btn-neon px-6 py-3 text-sm font-bold"
                        style={{ background:'linear-gradient(135deg,#a855f7,#6366f1)' }}>
                        {showForm ? '✕ Cancel' : '+ Add Investment'}
                    </motion.button>
                </motion.div>

                {investments.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.03}>
                            <div className="neo-card p-5 cursor-default">
                                <div className="absolute -top-5 -right-5 w-24 h-24 rounded-full opacity-15 pointer-events-none"
                                    style={{ background:'rgba(168,85,247,0.6)', filter:'blur(20px)' }} />
                                <p className="section-eyebrow mb-3 relative z-10" style={{ color:'#a855f7' }}>Total Portfolio</p>
                                <p className="text-3xl font-black grad-text ticker relative z-10" style={{ fontFamily:'Syne,sans-serif' }}>
                                    ₹{total.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 relative z-10">{investments.length} position{investments.length!==1?'s':''}</p>
                            </div>
                        </Tilt>
                        <div className="sm:col-span-2 glass-bright rounded-2xl p-5">
                            <p className="section-eyebrow mb-3">Allocation</p>
                            <div className="space-y-2">
                                {Object.entries(byType).sort((a,b)=>b[1]-a[1]).slice(0,4).map(([t,amt]) => {
                                    const pct = total>0 ? Math.round((amt/total)*100) : 0;
                                    const cfg = typeConfig[t] || typeConfig['Other'];
                                    return (
                                        <div key={t}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-300 font-medium">{cfg.icon} {t}</span>
                                                <span className="text-gray-400">{pct}% · ₹{amt.toLocaleString()}</span>
                                            </div>
                                            <div className="progress-track" style={{ height:'5px' }}>
                                                <motion.div className="progress-fill" initial={{ width:0 }}
                                                    animate={{ width:`${pct}%` }} transition={{ duration:1, ease:[0.16,1,0.3,1] }}
                                                    style={{ background:cfg.grad, boxShadow:`0 0 8px ${cfg.glow}` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                <AnimatePresence>
                    {showForm && (
                        <motion.div initial={{ opacity:0, scale:0.95, y:-10 }} animate={{ opacity:1, scale:1, y:0 }}
                            exit={{ opacity:0, scale:0.95, y:-10 }} transition={{ duration:0.3 }}
                            className="glass-bright rounded-2xl p-6 mb-6" style={{ border:'1px solid rgba(168,85,247,0.3)' }}>
                            <p className="section-eyebrow mb-1" style={{ color:'#a855f7' }}>New Position</p>
                            <h3 className="text-white font-bold text-lg mb-5" style={{ fontFamily:'Syne,sans-serif' }}>Add Investment</h3>
                            {error && (
                                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="mb-4 px-4 py-3 rounded-xl text-sm"
                                    style={{ background:'rgba(244,63,94,0.12)', border:'1px solid rgba(244,63,94,0.3)', color:'#fb7185' }}>
                                    ⚠ {error}
                                </motion.div>
                            )}
                            <div className="mb-5">
                                <label className="block section-eyebrow mb-3">Investment Type</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {investmentTypes.map(t => {
                                        const cfg = typeConfig[t];
                                        return (
                                            <motion.button key={t} type="button" whileTap={{ scale:0.95 }} onClick={() => setType(t)}
                                                className="py-3 px-2 rounded-xl text-center transition-all"
                                                style={{
                                                    background: type===t ? cfg.grad : 'rgba(255,255,255,0.04)',
                                                    border: type===t ? 'none' : '1px solid rgba(255,255,255,0.08)',
                                                    boxShadow: type===t ? `0 0 15px ${cfg.glow}` : 'none',
                                                }}>
                                                <div className="text-lg mb-0.5">{cfg.icon}</div>
                                                <div className="text-xs font-semibold" style={{ color:type===t?'white':'var(--muted)' }}>
                                                    {t.length>8 ? t.slice(0,7)+'…' : t}
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block section-eyebrow mb-2">Amount Invested (₹)</label>
                                        <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} required min="1"
                                            placeholder="25000" className="neo-input" />
                                    </div>
                                    <div>
                                        <label className="block section-eyebrow mb-2">Notes (optional)</label>
                                        <input type="text" value={description} onChange={e=>setDesc(e.target.value)}
                                            placeholder="e.g. Nifty 50 Index Fund" className="neo-input" />
                                    </div>
                                </div>
                                <motion.button type="submit" whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                                    className="btn-neon w-full py-3.5 font-bold"
                                    style={{ background:'linear-gradient(135deg,#a855f7,#6366f1)', boxShadow:'0 8px 30px rgba(168,85,247,0.35)' }}>
                                    Record Investment ◆
                                </motion.button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{[...Array(4)].map((_,i)=><div key={i} className="skeleton-neo h-36 rounded-2xl"/>)}</div>
                ) : investments.length === 0 ? (
                    <div className="text-center py-16">
                        <motion.div animate={{ y:[0,-10,0], rotate:[0,5,-5,0] }} transition={{ duration:2.5, repeat:Infinity }} className="text-5xl mb-4 opacity-40">◆</motion.div>
                        <p className="text-gray-500 font-semibold">No investments recorded</p>
                        <p className="text-gray-600 text-sm mt-1">Add your first investment to start tracking your portfolio.</p>
                    </div>
                ) : (
                    <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {investments.map((inv,i) => {
                            const cfg = typeConfig[inv.type] || typeConfig['Other'];
                            const pct = total>0 ? Math.round((inv.amount/total)*100) : 0;
                            return (
                                <motion.div key={inv._id} variants={fadeUp}>
                                    <Tilt tiltMaxAngleX={7} tiltMaxAngleY={7} glareEnable glareMaxOpacity={0.05} scale={1.03}>
                                        <div className="neo-card p-5 cursor-default group">
                                            <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full opacity-15 pointer-events-none"
                                                style={{ background:cfg.glow, filter:'blur(18px)' }} />
                                            <div className="flex items-start justify-between mb-4 relative z-10">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                                                        style={{ background:cfg.grad, boxShadow:`0 0 15px ${cfg.glow}` }}>{cfg.icon}</div>
                                                    <div>
                                                        <p className="text-gray-100 font-bold">{inv.type}</p>
                                                        {inv.description && <p className="text-gray-500 text-xs mt-0.5">{inv.description}</p>}
                                                    </div>
                                                </div>
                                                <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
                                                    onClick={() => handleDelete(inv._id)}
                                                    className="btn-danger px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-xs">✕</motion.button>
                                            </div>
                                            <div className="relative z-10">
                                                <p className="text-2xl font-black text-white mb-1 ticker" style={{ fontFamily:'Syne,sans-serif' }}>
                                                    ₹{inv.amount.toLocaleString()}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <div className="progress-track flex-1" style={{ height:'4px' }}>
                                                        <motion.div className="progress-fill" initial={{ width:0 }}
                                                            animate={{ width:`${pct}%` }} transition={{ duration:1, ease:[0.16,1,0.3,1] }}
                                                            style={{ background:cfg.grad, boxShadow:`0 0 6px ${cfg.glow}` }} />
                                                    </div>
                                                    <span className="text-xs font-bold" style={{ color:'var(--muted)' }}>{pct}%</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(inv.date||inv.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                                                </p>
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

export default Investments;