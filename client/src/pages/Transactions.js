import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Tilt from 'react-parallax-tilt';

const catIcons = { Salary:'💼',Freelance:'💻',Business:'🏢',Investment:'📈',Gift:'🎁',Food:'🍔',Transport:'🚗',Rent:'🏠',Shopping:'🛍️',Entertainment:'🎬',Health:'💊',Education:'📚',Other:'📦' };
const incCats  = ['Salary','Freelance','Business','Investment','Gift','Other'];
const expCats  = ['Food','Transport','Rent','Shopping','Entertainment','Health','Education','Other'];
const stagger  = { hidden:{opacity:0}, show:{opacity:1, transition:{staggerChildren:0.07}} };
const fadeUp   = { hidden:{opacity:0,y:20}, show:{opacity:1,y:0,transition:{duration:0.4,ease:[0.16,1,0.3,1]}} };
const GUIDE_KEY = 'wt_tx_guide_seen';

function Transactions() {
    const [transactions, setTx] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [type, setType]         = useState('expense');
    const [amount, setAmount]     = useState('');
    const [category, setCategory] = useState('');
    const [description, setDesc]  = useState('');
    const [error, setError]       = useState('');
    const [showGuide, setShowGuide] = useState(!sessionStorage.getItem(GUIDE_KEY));
    const [filter, setFilter]     = useState('all');

    useEffect(() => { fetchTx(); }, []);

    const fetchTx = async () => {
        try { const r = await API.get('/transactions'); setTx(r.data); }
        catch (e) { console.log(e); } finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setError('');
        try {
            await API.post('/transactions', { type, amount:Number(amount), category, description });
            setAmount(''); setCategory(''); setDesc(''); setShowForm(false); fetchTx();
        } catch (e) { setError(e.response?.data?.message || 'Failed'); }
    };

    const handleDelete = async (id) => {
        try { await API.delete(`/transactions/${id}`); fetchTx(); } catch (e) { console.log(e); }
    };

    const totalIncome  = transactions.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
    const totalExpense = transactions.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
    const filtered = filter==='all' ? transactions : transactions.filter(t=>t.type===filter);

    return (
        <div className="min-h-screen relative" style={{ background:'var(--bg)' }}>
            <div className="grid-bg" />
            <motion.div animate={{ y:[0,-20,0] }} transition={{ duration:9, repeat:Infinity }}
                className="orb w-80 h-80" style={{ top:-80, right:-60, background:'rgba(16,185,129,0.2)' }} />
            <motion.div animate={{ y:[0,18,0] }} transition={{ duration:7, repeat:Infinity, delay:1 }}
                className="orb w-64 h-64" style={{ bottom:-60, left:-60, background:'rgba(244,63,94,0.15)' }} />
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-8 relative z-10">
                <AnimatePresence>
                    {showGuide && (
                        <motion.div initial={{ opacity:0, y:-15 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
                            className="glass-bright rounded-2xl p-5 mb-6" style={{ border:'1px solid rgba(16,185,129,0.25)' }}>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="section-eyebrow mb-1" style={{ color:'#10b981' }}>How Transactions work</p>
                                    <h3 className="text-white font-bold" style={{ fontFamily:'Syne,sans-serif' }}>Log every rupee in and out ⇅</h3>
                                </div>
                                <button onClick={() => { sessionStorage.setItem(GUIDE_KEY,'1'); setShowGuide(false); }}
                                    className="text-gray-500 hover:text-white text-sm btn-ghost w-7 h-7 flex items-center justify-center rounded-lg">✕</button>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-2 text-xs text-gray-400">
                                <div className="guide-pill">💡 Hit <strong className="text-white">+ Add Transaction</strong> to record income or an expense.</div>
                                <div className="guide-pill">📂 Pick a <strong className="text-white">category</strong> — this powers your Analytics charts.</div>
                                <div className="guide-pill">🔍 Use the <strong className="text-white">filter pills</strong> to view only income or only expenses.</div>
                                <div className="guide-pill">🗑️ Hover a row and tap <strong className="text-white">Delete</strong> to remove a wrong entry.</div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
                    className="flex items-center justify-between mb-6">
                    <div>
                        <p className="section-eyebrow mb-1">Money Flow</p>
                        <h2 className="text-3xl font-black text-white" style={{ fontFamily:'Syne,sans-serif' }}>Transactions</h2>
                    </div>
                    <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                        onClick={() => setShowForm(!showForm)} className="btn-neon px-6 py-3 text-sm font-bold">
                        {showForm ? '✕ Cancel' : '+ Add Transaction'}
                    </motion.button>
                </motion.div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                        { label:'Total Income',  value:totalIncome,  grad:'linear-gradient(135deg,#10b981,#059669)', glow:'rgba(16,185,129,0.4)', icon:'↑' },
                        { label:'Total Expense', value:totalExpense, grad:'linear-gradient(135deg,#f43f5e,#e11d48)', glow:'rgba(244,63,94,0.4)',  icon:'↓' },
                    ].map(c => (
                        <Tilt key={c.label} tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable glareMaxOpacity={0.06} scale={1.03}>
                            <div className="neo-card p-5 cursor-default">
                                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-15 pointer-events-none"
                                    style={{ background:c.glow, filter:'blur(20px)' }} />
                                <div className="flex items-center justify-between mb-3 relative z-10">
                                    <p className="section-eyebrow">{c.label}</p>
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                                        style={{ background:c.grad, boxShadow:`0 0 15px ${c.glow}` }}>{c.icon}</div>
                                </div>
                                <p className="text-2xl font-black text-white ticker relative z-10" style={{ fontFamily:'Syne,sans-serif' }}>
                                    ₹{c.value.toLocaleString()}
                                </p>
                            </div>
                        </Tilt>
                    ))}
                </div>

                <AnimatePresence>
                    {showForm && (
                        <motion.div initial={{ opacity:0, scale:0.95, y:-10 }} animate={{ opacity:1, scale:1, y:0 }}
                            exit={{ opacity:0, scale:0.95, y:-10 }} transition={{ duration:0.3, ease:[0.16,1,0.3,1] }}
                            className="glass-bright rounded-2xl p-6 mb-6" style={{ border:'1px solid rgba(99,102,241,0.3)' }}>
                            <p className="section-eyebrow mb-1">New Entry</p>
                            <h3 className="text-white font-bold text-lg mb-5" style={{ fontFamily:'Syne,sans-serif' }}>Add Transaction</h3>
                            {error && (
                                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="mb-4 px-4 py-3 rounded-xl text-sm"
                                    style={{ background:'rgba(244,63,94,0.12)', border:'1px solid rgba(244,63,94,0.3)', color:'#fb7185' }}>
                                    ⚠ {error}
                                </motion.div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="flex gap-2">
                                    {['income','expense'].map(t => (
                                        <motion.button key={t} type="button" whileTap={{ scale:0.95 }}
                                            onClick={() => { setType(t); setCategory(''); }}
                                            className="flex-1 py-3 rounded-xl font-bold text-sm transition-all"
                                            style={{
                                                background: type===t ? (t==='income' ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#f43f5e,#e11d48)') : 'rgba(255,255,255,0.04)',
                                                border: type===t ? 'none' : '1px solid rgba(255,255,255,0.08)',
                                                color: type===t ? 'white' : 'var(--muted)',
                                                boxShadow: type===t ? (t==='income' ? '0 0 20px rgba(16,185,129,0.4)' : '0 0 20px rgba(244,63,94,0.4)') : 'none',
                                            }}>
                                            {t==='income' ? '↑ Income' : '↓ Expense'}
                                        </motion.button>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block section-eyebrow mb-2">Amount (₹)</label>
                                        <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} required min="1" placeholder="0" className="neo-input" />
                                    </div>
                                    <div>
                                        <label className="block section-eyebrow mb-2">Category</label>
                                        <select value={category} onChange={e=>setCategory(e.target.value)} required className="neo-select">
                                            <option value="">Select...</option>
                                            {(type==='income' ? incCats : expCats).map(c => <option key={c} value={c}>{catIcons[c]} {c}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block section-eyebrow mb-2">Description (optional)</label>
                                    <input type="text" value={description} onChange={e=>setDesc(e.target.value)}
                                        placeholder="e.g. Monthly salary, Grocery run..." className="neo-input" />
                                </div>
                                <motion.button type="submit" whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                                    className="btn-neon w-full py-3.5 font-bold">Save Transaction ✓</motion.button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex gap-2 mb-5">
                    {['all','income','expense'].map(f => (
                        <motion.button key={f} whileTap={{ scale:0.95 }} onClick={() => setFilter(f)}
                            className="px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all"
                            style={{
                                background: filter===f ? 'linear-gradient(135deg,#6366f1,#a855f7)' : 'rgba(255,255,255,0.04)',
                                border: filter===f ? 'none' : '1px solid rgba(255,255,255,0.08)',
                                color: filter===f ? 'white' : 'var(--muted)',
                                boxShadow: filter===f ? '0 0 20px rgba(99,102,241,0.3)' : 'none',
                            }}>
                            {f==='all' ? 'All' : f==='income' ? '↑ Income' : '↓ Expenses'}
                        </motion.button>
                    ))}
                    <div className="ml-auto text-xs text-gray-500 self-center">{filtered.length} entries</div>
                </div>

                {loading ? (
                    <div className="space-y-3">{[...Array(5)].map((_,i) => <div key={i} className="skeleton-neo h-16 rounded-2xl" />)}</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:2.5, repeat:Infinity }} className="text-5xl mb-4 opacity-40">⇅</motion.div>
                        <p className="text-gray-500 font-semibold">No transactions yet</p>
                        <p className="text-gray-600 text-sm mt-1">Add your first entry above.</p>
                    </div>
                ) : (
                    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
                        {filtered.map((tx) => (
                            <motion.div key={tx._id} variants={fadeUp} whileHover={{ x:4, scale:1.005 }}
                                className="neo-card px-5 py-4 flex items-center justify-between cursor-default group">
                                <div className="flex items-center gap-4">
                                    <motion.div whileHover={{ scale:1.15, rotate:8 }}
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                                        style={{
                                            background: tx.type==='income' ? 'linear-gradient(135deg,rgba(16,185,129,0.2),rgba(5,150,105,0.15))' : 'linear-gradient(135deg,rgba(244,63,94,0.2),rgba(225,29,72,0.15))',
                                            border: tx.type==='income' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(244,63,94,0.3)',
                                        }}>
                                        {catIcons[tx.category] || '📦'}
                                    </motion.div>
                                    <div>
                                        <p className="text-gray-200 font-semibold text-sm">{tx.category}</p>
                                        {tx.description && <p className="text-gray-500 text-xs mt-0.5">{tx.description}</p>}
                                        <p className="text-gray-600 text-xs mt-0.5">
                                            {new Date(tx.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-lg font-black"
                                        style={{ color:tx.type==='income'?'#10b981':'#f43f5e', textShadow:tx.type==='income'?'0 0 15px rgba(16,185,129,0.4)':'0 0 15px rgba(244,63,94,0.4)' }}>
                                        {tx.type==='income'?'+':'-'}₹{tx.amount.toLocaleString()}
                                    </span>
                                    <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
                                        onClick={() => handleDelete(tx._id)}
                                        className="btn-danger px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold">
                                        Delete
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default Transactions;