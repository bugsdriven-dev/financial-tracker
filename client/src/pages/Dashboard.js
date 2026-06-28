import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const stagger = { hidden:{opacity:0}, show:{opacity:1, transition:{staggerChildren:0.1}} };
const fadeUp  = { hidden:{opacity:0,y:28}, show:{opacity:1,y:0,transition:{duration:0.5,ease:[0.16,1,0.3,1]}} };
const GUIDE_KEY = 'wt_dashboard_guide_seen';

function StatCard({ label, value, grad, glowColor, icon }) {
    return (
        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable glareMaxOpacity={0.08} scale={1.04} className="h-full">
            <motion.div variants={fadeUp} className="neo-card h-full p-6 cursor-default select-none"
                style={{ background:'linear-gradient(135deg, rgba(12,18,40,0.95) 0%, rgba(8,10,24,0.98) 100%)' }}>
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 pointer-events-none"
                    style={{ background:glowColor, filter:'blur(30px)' }} />
                <div className="flex items-start justify-between mb-5 relative z-10">
                    <p className="section-eyebrow">{label}</p>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                        style={{ background:grad, boxShadow:`0 0 20px ${glowColor}` }}>{icon}</div>
                </div>
                <motion.p initial={{ opacity:0, y:15 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3, duration:0.5 }}
                    className="text-2xl font-black text-white ticker relative z-10" style={{ fontFamily:'Syne,sans-serif' }}>
                    ₹{typeof value === 'number' ? value.toLocaleString() : value}
                </motion.p>
                <div className="absolute bottom-0 left-0 h-0.5 rounded-full w-full"
                    style={{ background:`linear-gradient(90deg, transparent, ${glowColor}, transparent)`, opacity:0.4 }} />
            </motion.div>
        </Tilt>
    );
}

function GuidePill({ icon, text }) {
    return (
        <div className="guide-pill flex items-start gap-2">
            <span className="text-base mt-0.5 shrink-0">{icon}</span>
            <span>{text}</span>
        </div>
    );
}

function Dashboard() {
    const { user } = useAuth();
    const [summary, setSummary]     = useState({ totalIncome:0, totalExpense:0, balance:0 });
    const [habits, setHabits]       = useState([]);
    const [goals, setGoals]         = useState([]);
    const [investments, setInvest]  = useState(0);
    const [loading, setLoading]     = useState(true);
    const [showGuide, setShowGuide] = useState(!sessionStorage.getItem(GUIDE_KEY));

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [s, h, g, inv] = await Promise.all([
                API.get('/transactions/summary'), API.get('/habits'),
                API.get('/goals'), API.get('/investments'),
            ]);
            setSummary(s.data); setHabits(h.data); setGoals(g.data);
            setInvest(inv.data.reduce((a,i) => a+i.amount, 0));
        } catch (e) { console.log(e); }
        finally { setLoading(false); }
    };

    const netWorth = summary.balance + investments;
    const savingsRate = summary.totalIncome > 0 ? Math.round((summary.balance/summary.totalIncome)*100) : 0;

    const cards = [
        { label:'Total Income',  value:summary.totalIncome,  grad:'linear-gradient(135deg,#10b981,#059669)', glowColor:'#10b981', icon:'↑' },
        { label:'Total Expense', value:summary.totalExpense, grad:'linear-gradient(135deg,#f43f5e,#e11d48)', glowColor:'#f43f5e', icon:'↓' },
        { label:'Investments',   value:investments,           grad:'linear-gradient(135deg,#a855f7,#7c3aed)', glowColor:'#a855f7', icon:'◆' },
        { label:'Net Worth',     value:netWorth,              grad:'linear-gradient(135deg,#6366f1,#4f46e5)', glowColor:'#6366f1', icon:'★' },
    ];

    if (loading) return (
        <div className="min-h-screen" style={{ background:'var(--bg)' }}>
            <div className="grid-bg" /><Navbar />
            <div className="flex items-center justify-center h-96 relative z-10">
                <div className="text-center">
                    <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}
                        className="w-14 h-14 rounded-full mx-auto mb-4"
                        style={{ border:'2px solid rgba(99,102,241,0.2)', borderTop:'2px solid #6366f1', boxShadow:'0 0 20px rgba(99,102,241,0.3)' }} />
                    <motion.p animate={{ opacity:[0.4,1,0.4] }} transition={{ duration:1.5, repeat:Infinity }}
                        className="text-indigo-400 font-semibold text-sm tracking-widest uppercase">Initialising...</motion.p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen relative" style={{ background:'var(--bg)' }}>
            <div className="grid-bg" />
            <motion.div animate={{ y:[0,-30,0], x:[0,20,0] }} transition={{ duration:12, repeat:Infinity, ease:'easeInOut' }}
                className="orb w-96 h-96" style={{ top:-150, right:-80, background:'rgba(99,102,241,0.25)' }} />
            <motion.div animate={{ y:[0,25,0] }} transition={{ duration:9, repeat:Infinity, delay:2, ease:'easeInOut' }}
                className="orb w-80 h-80" style={{ bottom:-100, left:-100, background:'rgba(168,85,247,0.2)' }} />
            <motion.div animate={{ y:[0,-18,0], x:[0,-12,0] }} transition={{ duration:10, repeat:Infinity, delay:1 }}
                className="orb w-48 h-48" style={{ top:'40%', left:'30%', background:'rgba(6,182,212,0.1)' }} />

            {[...Array(6)].map((_,i) => (
                <motion.div key={i} className="particle"
                    style={{
                        width:2+(i%3), height:2+(i%3),
                        background:['#6366f1','#a855f7','#06b6d4','#10b981','#f59e0b','#f43f5e'][i],
                        top:`${10+i*14}%`, left:`${8+i*13}%`,
                        boxShadow:`0 0 6px ${['#6366f1','#a855f7','#06b6d4','#10b981','#f59e0b','#f43f5e'][i]}`,
                        opacity:0.6,
                    }}
                    animate={{ y:[0,-(20+i*8),0], opacity:[0.6,0.9,0.6] }}
                    transition={{ duration:4+i, repeat:Infinity, ease:'easeInOut', delay:i*0.6 }}
                />
            ))}

            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">

                {showGuide && (
                    <motion.div initial={{ opacity:0, y:-20, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }}
                        transition={{ duration:0.4 }} className="glass-bright rounded-2xl p-5 mb-6"
                        style={{ border:'1px solid rgba(99,102,241,0.3)' }}>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="section-eyebrow mb-1">Getting started</p>
                                <h3 className="text-white font-bold text-lg" style={{ fontFamily:'Syne,sans-serif' }}>Welcome to your Financial OS 🚀</h3>
                                <p className="text-gray-400 text-sm mt-1">Here's what each section does — close anytime.</p>
                            </div>
                            <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
                                onClick={() => { sessionStorage.setItem(GUIDE_KEY,'1'); setShowGuide(false); }}
                                className="w-8 h-8 rounded-lg btn-ghost flex items-center justify-center text-sm text-gray-400 shrink-0">✕</motion.button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            <GuidePill icon="⇅" text="Transactions — log every income & expense so your numbers stay accurate." />
                            <GuidePill icon="◈" text="Habits — add daily/weekly saving habits and mark complete to build streaks." />
                            <GuidePill icon="◎" text="Goals — set a target like 'Buy Laptop' and drip money in whenever you save." />
                            <GuidePill icon="◆" text="Investments — record what you've put in stocks, FDs, crypto, etc." />
                            <GuidePill icon="▲" text="Analytics — visual charts that show where your money goes each month." />
                            <GuidePill icon="⬡" text="Dashboard (here) — your live snapshot: income, expenses, net worth & streaks." />
                        </div>
                    </motion.div>
                )}

                <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }} className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} scale={1.05}>
                                <motion.div whileHover={{ rotate:5 }}
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white pulse-neo"
                                    style={{ background:'linear-gradient(135deg,#6366f1,#a855f7)', boxShadow:'0 0 30px rgba(99,102,241,0.5)' }}>
                                    {user?.name?.charAt(0).toUpperCase()}
                                </motion.div>
                            </Tilt>
                            <div>
                                <p className="text-gray-500 text-xs font-medium tracking-widest uppercase">Command Centre</p>
                                <h2 className="text-2xl font-black text-white" style={{ fontFamily:'Syne,sans-serif' }}>
                                    Hey, <span className="grad-text">{user?.name?.split(' ')[0]}</span> 👋
                                </h2>
                            </div>
                        </div>
                        <div className="hidden sm:flex flex-col items-end">
                            <p className="section-eyebrow mb-1">Savings Rate</p>
                            <span className="text-3xl font-black grad-text-green" style={{ fontFamily:'Syne,sans-serif' }}>{savingsRate}%</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {cards.map(c => <StatCard key={c.label} {...c} />)}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4, duration:0.6 }}
                        className="glass-bright rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="section-eyebrow mb-1">Habit Streaks</p>
                                <h3 className="text-white font-bold text-lg" style={{ fontFamily:'Syne,sans-serif' }}>Active Routines</h3>
                            </div>
                            <div className="badge-gold px-3 py-1 rounded-lg text-xs font-bold">{habits.length} active</div>
                        </div>
                        {habits.length === 0 ? (
                            <div className="text-center py-10">
                                <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:2, repeat:Infinity }} className="text-4xl mb-3 opacity-40">◈</motion.div>
                                <p className="text-gray-500 font-medium text-sm">No habits yet.</p>
                                <p className="text-gray-600 text-xs mt-1">Head to Habits to create your first one.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {habits.slice(0,4).map((h,i) => (
                                    <motion.div key={h._id} initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
                                        transition={{ delay:i*0.08 }} whileHover={{ x:4 }}
                                        className="flex items-center justify-between neo-card px-4 py-3 cursor-default">
                                        <div className="flex items-center gap-3">
                                            <motion.div animate={{ scale:[1,1.15,1] }} transition={{ duration:2.5, repeat:Infinity, delay:i*0.3 }}
                                                className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                                                style={{ background:'linear-gradient(135deg,#f59e0b,#d97706)', boxShadow:'0 0 12px rgba(245,158,11,0.4)' }}>
                                                🔥
                                            </motion.div>
                                            <span className="text-gray-200 font-semibold text-sm">{h.name}</span>
                                        </div>
                                        <div className="badge-gold px-2.5 py-1 rounded-lg text-xs font-bold">{h.streak} day{h.streak!==1?'s':''}</div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5, duration:0.6 }}
                        className="glass-bright rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="section-eyebrow mb-1">Savings Goals</p>
                                <h3 className="text-white font-bold text-lg" style={{ fontFamily:'Syne,sans-serif' }}>Milestones</h3>
                            </div>
                            <div className="badge-blue px-3 py-1 rounded-lg text-xs font-bold">{goals.length} goals</div>
                        </div>
                        {goals.length === 0 ? (
                            <div className="text-center py-10">
                                <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:2, repeat:Infinity }} className="text-4xl mb-3 opacity-40">◎</motion.div>
                                <p className="text-gray-500 font-medium text-sm">No goals yet.</p>
                                <p className="text-gray-600 text-xs mt-1">Go to Goals and set your first target.</p>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {goals.slice(0,3).map((goal,i) => {
                                    const pct = Math.min(Math.round((goal.savedAmount/goal.targetAmount)*100),100);
                                    const grads = ['linear-gradient(90deg,#6366f1,#818cf8)','linear-gradient(90deg,#a855f7,#c084fc)','linear-gradient(90deg,#06b6d4,#67e8f9)'];
                                    const glows = ['rgba(99,102,241,0.5)','rgba(168,85,247,0.5)','rgba(6,182,212,0.5)'];
                                    return (
                                        <motion.div key={goal._id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.1 }}>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-200 font-semibold text-sm">{goal.name}</span>
                                                <span className="text-sm font-black" style={{ background:grads[i%3], WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{pct}%</span>
                                            </div>
                                            <div className="progress-track">
                                                <motion.div className="progress-fill" initial={{ width:0 }} animate={{ width:`${pct}%` }}
                                                    transition={{ duration:1.2, delay:0.5+i*0.12, ease:[0.16,1,0.3,1] }}
                                                    style={{ background:grads[i%3], boxShadow:`0 0 10px ${glows[i%3]}` }} />
                                            </div>
                                            <div className="flex justify-between text-xs text-gray-500 mt-1.5">
                                                <span>₹{goal.savedAmount.toLocaleString()} saved</span>
                                                <span>₹{goal.targetAmount.toLocaleString()} target</span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;