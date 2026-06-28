import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';

const CHART_COLORS = ['#6366f1','#f43f5e','#10b981','#f59e0b','#a855f7','#06b6d4','#f97316','#ec4899'];
const GUIDE_KEY = 'wt_analytics_guide_seen';

const NeoTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="glass-bright rounded-2xl px-4 py-3 shadow-2xl" style={{ border:'1px solid rgba(99,102,241,0.4)' }}>
            {label && <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">{label}</p>}
            {payload.map((p,i) => <p key={i} className="text-sm font-black" style={{ color:p.color }}>{p.name}: ₹{p.value?.toLocaleString()}</p>)}
        </div>
    );
};

function AnalyticCard({ label, display, grad, glow, icon, delay }) {
    return (
        <Tilt tiltMaxAngleX={9} tiltMaxAngleY={9} glareEnable glareMaxOpacity={0.07} scale={1.04}>
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay, duration:0.5, ease:[0.16,1,0.3,1] }}
                className="neo-card p-5 cursor-default">
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-15 pointer-events-none" style={{ background:glow, filter:'blur(22px)' }} />
                <div className="flex items-center justify-between mb-3 relative z-10">
                    <p className="section-eyebrow">{label}</p>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background:grad, boxShadow:`0 0 15px ${glow}` }}>{icon}</div>
                </div>
                <p className="text-2xl font-black text-white ticker relative z-10" style={{ fontFamily:'Syne,sans-serif' }}>{display}</p>
            </motion.div>
        </Tilt>
    );
}

function Analytics() {
    const [transactions, setTx] = useState([]);
    const [investments, setInv] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showGuide, setShowGuide] = useState(!sessionStorage.getItem(GUIDE_KEY));

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [t, inv] = await Promise.all([API.get('/transactions'), API.get('/investments')]);
            setTx(t.data); setInv(inv.data);
        } catch (e) { console.log(e); } finally { setLoading(false); }
    };

    const expByCat = {};
    transactions.filter(t=>t.type==='expense').forEach(t=>{ expByCat[t.category]=(expByCat[t.category]||0)+t.amount; });
    const pieData = Object.entries(expByCat).map(([name,value])=>({name,value}));

    const monthMap = {};
    transactions.forEach(t => {
        const m = new Date(t.date).toLocaleString('default',{month:'short',year:'2-digit'});
        if (!monthMap[m]) monthMap[m]={month:m,income:0,expense:0};
        if (t.type==='income') monthMap[m].income+=t.amount; else monthMap[m].expense+=t.amount;
    });
    const lineData = Object.values(monthMap).map(m=>({...m,netSavings:m.income-m.expense}));

    const totalIncome  = transactions.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
    const totalExpense = transactions.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
    const totalInvest  = investments.reduce((s,i)=>s+i.amount,0);
    const netWorth     = (totalIncome-totalExpense)+totalInvest;
    const savingsRate  = totalIncome>0 ? Math.round(((totalIncome-totalExpense)/totalIncome)*100) : 0;

    const summaryCards = [
        { label:'Net Worth',    display:`₹${netWorth.toLocaleString()}`,   grad:'linear-gradient(135deg,#6366f1,#4f46e5)', glow:'rgba(99,102,241,0.5)',  icon:'★', delay:0.05 },
        { label:'Total Income', display:`₹${totalIncome.toLocaleString()}`, grad:'linear-gradient(135deg,#10b981,#059669)', glow:'rgba(16,185,129,0.5)',  icon:'↑', delay:0.1  },
        { label:'Total Expense',display:`₹${totalExpense.toLocaleString()}`,grad:'linear-gradient(135deg,#f43f5e,#e11d48)', glow:'rgba(244,63,94,0.5)',   icon:'↓', delay:0.15 },
        { label:'Savings Rate', display:`${savingsRate}%`,                  grad:'linear-gradient(135deg,#a855f7,#7c3aed)', glow:'rgba(168,85,247,0.5)',  icon:'◆', delay:0.2  },
    ];

    if (loading) return (
        <div className="min-h-screen" style={{ background:'var(--bg)' }}>
            <div className="grid-bg" /><Navbar />
            <div className="flex items-center justify-center h-96 relative z-10">
                <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}
                    className="w-14 h-14 rounded-full"
                    style={{ border:'2px solid rgba(99,102,241,0.2)', borderTop:'2px solid #6366f1', boxShadow:'0 0 20px rgba(99,102,241,0.3)' }} />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen relative" style={{ background:'var(--bg)' }}>
            <div className="grid-bg" />
            <motion.div animate={{ y:[0,-25,0] }} transition={{ duration:10, repeat:Infinity }}
                className="orb w-96 h-96" style={{ top:-150, right:-100, background:'rgba(99,102,241,0.22)' }} />
            <motion.div animate={{ y:[0,20,0] }} transition={{ duration:8, repeat:Infinity, delay:2 }}
                className="orb w-72 h-72" style={{ bottom:-80, left:-80, background:'rgba(168,85,247,0.18)' }} />
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
                {showGuide && (
                    <motion.div initial={{ opacity:0, y:-15 }} animate={{ opacity:1, y:0 }}
                        className="glass-bright rounded-2xl p-5 mb-6" style={{ border:'1px solid rgba(6,182,212,0.3)' }}>
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <p className="section-eyebrow mb-1" style={{ color:'#06b6d4' }}>How Analytics work</p>
                                <h3 className="text-white font-bold" style={{ fontFamily:'Syne,sans-serif' }}>Your full financial picture ▲</h3>
                            </div>
                            <button onClick={() => { sessionStorage.setItem(GUIDE_KEY,'1'); setShowGuide(false); }}
                                className="text-gray-500 hover:text-white text-sm btn-ghost w-7 h-7 flex items-center justify-center rounded-lg">✕</button>
                        </div>
                        <div className="grid sm:grid-cols-3 gap-2 text-xs text-gray-400">
                            <div className="guide-pill">🥧 <strong className="text-white">Expense Breakdown</strong> — shows which categories eat most of your budget.</div>
                            <div className="guide-pill">📊 <strong className="text-white">Income vs Expense</strong> — monthly bars let you spot heavy-spending months.</div>
                            <div className="guide-pill">📈 <strong className="text-white">Net Savings Trend</strong> — tracks how your savings grow or dip over time.</div>
                        </div>
                    </motion.div>
                )}

                <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }} className="mb-8">
                    <p className="section-eyebrow mb-1">Data Intelligence</p>
                    <h2 className="text-3xl font-black text-white" style={{ fontFamily:'Syne,sans-serif' }}>Wealth Analytics</h2>
                </motion.div>

                {transactions.length === 0 ? (
                    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                        className="glass-bright rounded-3xl p-16 text-center" style={{ border:'1px solid rgba(99,102,241,0.2)' }}>
                        <motion.div animate={{ y:[0,-12,0] }} transition={{ duration:3, repeat:Infinity }} className="text-6xl mb-4 opacity-50">▲</motion.div>
                        <p className="text-gray-400 font-bold text-lg">No data yet</p>
                        <p className="text-gray-600 text-sm mt-1">Add some transactions to see your analytics come alive.</p>
                    </motion.div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {summaryCards.map(c => <AnalyticCard key={c.label} {...c} />)}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <motion.div initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.3, duration:0.6 }}
                                whileHover={{ y:-3 }} className="glass-bright rounded-2xl p-6 transition-all" style={{ border:'1px solid rgba(99,102,241,0.15)' }}>
                                <p className="section-eyebrow mb-1">Spending</p>
                                <h3 className="text-white font-bold text-lg mb-5" style={{ fontFamily:'Syne,sans-serif' }}>Expense Breakdown</h3>
                                {pieData.length === 0 ? (
                                    <div className="flex items-center justify-center h-48 text-gray-600 font-semibold">No expenses yet</div>
                                ) : (
                                    <ResponsiveContainer width="100%" height={280}>
                                        <PieChart>
                                            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                                                outerRadius={90} innerRadius={45} paddingAngle={4}
                                                label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`}
                                                labelLine={{ stroke:'rgba(255,255,255,0.2)', strokeWidth:1 }}>
                                                {pieData.map((_,idx)=>(
                                                    <Cell key={idx} fill={CHART_COLORS[idx%CHART_COLORS.length]} stroke="transparent"
                                                        style={{ filter:`drop-shadow(0 0 6px ${CHART_COLORS[idx%CHART_COLORS.length]}60)` }} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<NeoTooltip />} />
                                            <Legend wrapperStyle={{ color:'#6b7ba4', fontSize:'12px' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </motion.div>

                            <motion.div initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.4, duration:0.6 }}
                                whileHover={{ y:-3 }} className="glass-bright rounded-2xl p-6 transition-all" style={{ border:'1px solid rgba(99,102,241,0.15)' }}>
                                <p className="section-eyebrow mb-1">Monthly</p>
                                <h3 className="text-white font-bold text-lg mb-5" style={{ fontFamily:'Syne,sans-serif' }}>Income vs Expense</h3>
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={lineData} barSize={12} barGap={3}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" vertical={false} />
                                        <XAxis dataKey="month" tick={{ fontSize:11, fill:'#6b7ba4', fontWeight:600 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize:11, fill:'#6b7ba4', fontWeight:600 }} axisLine={false} tickLine={false} />
                                        <Tooltip content={<NeoTooltip />} />
                                        <Legend wrapperStyle={{ color:'#6b7ba4', fontSize:'12px' }} />
                                        <Bar dataKey="income" name="Income" fill="#10b981" radius={[6,6,0,0]} style={{ filter:'drop-shadow(0 0 6px rgba(16,185,129,0.5))' }} />
                                        <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[6,6,0,0]} style={{ filter:'drop-shadow(0 0 6px rgba(244,63,94,0.5))' }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </motion.div>
                        </div>

                        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5, duration:0.6 }}
                            whileHover={{ y:-3 }} className="glass-bright rounded-2xl p-6 transition-all" style={{ border:'1px solid rgba(99,102,241,0.15)' }}>
                            <p className="section-eyebrow mb-1">Trend</p>
                            <h3 className="text-white font-bold text-lg mb-5" style={{ fontFamily:'Syne,sans-serif' }}>Net Savings Over Time</h3>
                            <ResponsiveContainer width="100%" height={260}>
                                <LineChart data={lineData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fontSize:11, fill:'#6b7ba4', fontWeight:600 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize:11, fill:'#6b7ba4', fontWeight:600 }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<NeoTooltip />} />
                                    <Legend wrapperStyle={{ color:'#6b7ba4', fontSize:'12px' }} />
                                    <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2.5} name="Income"
                                        dot={{ r:4, fill:'#10b981', stroke:'#050814', strokeWidth:2 }} activeDot={{ r:6 }} style={{ filter:'drop-shadow(0 0 6px rgba(16,185,129,0.6))' }} />
                                    <Line type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={2.5} name="Expense"
                                        dot={{ r:4, fill:'#f43f5e', stroke:'#050814', strokeWidth:2 }} activeDot={{ r:6 }} style={{ filter:'drop-shadow(0 0 6px rgba(244,63,94,0.6))' }} />
                                    <Line type="monotone" dataKey="netSavings" stroke="#6366f1" strokeWidth={2.5} name="Net Savings"
                                        dot={{ r:4, fill:'#6366f1', stroke:'#050814', strokeWidth:2 }} activeDot={{ r:6 }} style={{ filter:'drop-shadow(0 0 6px rgba(99,102,241,0.6))' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Analytics;