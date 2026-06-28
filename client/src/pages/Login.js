import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [email, setEmail]     = useState('');
    const [password, setPass]   = useState('');
    const [error, setError]     = useState('');
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw]   = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setLoading(true);
        try {
            const res = await API.post('/auth/login', { email, password });
            login(res.data.user, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
            <div className="grid-bg" />
            <motion.div animate={{ y:[0,-25,0], x:[0,15,0] }} transition={{ duration:8, repeat:Infinity, ease:'easeInOut' }}
                className="orb w-96 h-96" style={{ top:-100, left:-80, background:'rgba(99,102,241,0.3)' }} />
            <motion.div animate={{ y:[0,20,0], x:[0,-12,0] }} transition={{ duration:10, repeat:Infinity, ease:'easeInOut', delay:1.5 }}
                className="orb w-72 h-72" style={{ bottom:-80, right:-60, background:'rgba(168,85,247,0.25)' }} />
            <motion.div animate={{ y:[0,-15,0] }} transition={{ duration:7, repeat:Infinity, ease:'easeInOut', delay:0.8 }}
                className="orb w-48 h-48" style={{ top:'60%', right:'25%', background:'rgba(6,182,212,0.15)' }} />

            {['₿','◆','↑','★','◎','▲'].map((icon, i) => (
                <motion.div key={i}
                    animate={{ y:[0,-18,0], rotate:[0,8,-8,0] }}
                    transition={{ duration:4.5+i*0.8, repeat:Infinity, ease:'easeInOut', delay:i*0.6 }}
                    className="absolute font-mono font-black select-none pointer-events-none"
                    style={{
                        top:`${12+i*13}%`, left:`${6+i*15}%`,
                        fontSize:`${1.2+(i%3)*0.4}rem`,
                        color:['#6366f1','#a855f7','#06b6d4','#10b981','#f59e0b','#f43f5e'][i],
                        opacity:0.18,
                        textShadow:`0 0 20px ${['#6366f1','#a855f7','#06b6d4','#10b981','#f59e0b','#f43f5e'][i]}`,
                    }}>
                    {icon}
                </motion.div>
            ))}

            <div className="w-full max-w-md relative z-10">
                <motion.div initial={{ opacity:0, y:-30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, ease:[0.16,1,0.3,1] }}
                    className="text-center mb-8">
                    <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} scale={1.05} className="inline-block mb-6">
                        <motion.div whileHover={{ rotate:8 }}
                            className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto relative"
                            style={{ background:'linear-gradient(135deg,#6366f1,#a855f7)', boxShadow:'0 0 50px rgba(99,102,241,0.5)' }}>
                            💎
                            <div className="absolute inset-0 rounded-3xl border border-indigo-400/30 spin-slow" />
                        </motion.div>
                    </Tilt>
                    <h1 className="text-4xl font-black text-white mb-2 neon-flicker" style={{ fontFamily:'Syne,sans-serif' }}>Welcome back</h1>
                    <p className="text-gray-500 font-medium">Your financial command centre awaits</p>
                </motion.div>

                <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} glareEnable glareMaxOpacity={0.06} scale={1.01}>
                    <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
                        transition={{ duration:0.6, delay:0.15, ease:[0.16,1,0.3,1] }}
                        className="glass-bright rounded-3xl shadow-2xl p-8">
                        {error && (
                            <motion.div initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                                className="mb-5 px-4 py-3 rounded-xl text-sm font-medium"
                                style={{ background:'rgba(244,63,94,0.12)', border:'1px solid rgba(244,63,94,0.3)', color:'#fb7185' }}>
                                ⚠ {error}
                            </motion.div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold mb-2 section-eyebrow">Email Address</label>
                                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
                                    placeholder="you@example.com" className="neo-input" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold mb-2 section-eyebrow">Password</label>
                                <div className="relative">
                                    <input type={showPw ? 'text' : 'password'} value={password}
                                        onChange={e=>setPass(e.target.value)} required placeholder="••••••••"
                                        className="neo-input pr-12" />
                                    <button type="button" onClick={() => setShowPw(!showPw)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-400 transition-colors text-sm">
                                        {showPw ? '◯' : '●'}
                                    </button>
                                </div>
                                <div className="text-right mt-2">
                                    <Link to="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>
                            <motion.button type="submit" disabled={loading}
                                whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.97 }}
                                className="btn-neon w-full py-4 text-base font-bold">
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <motion.span animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}
                                            className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white" />
                                        Authenticating...
                                    </span>
                                ) : 'Sign In →'}
                            </motion.button>
                        </form>
                        <div className="divider my-6" />
                        <p className="text-center text-sm text-gray-500">
                            New here?{' '}
                            <Link to="/register" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Create account</Link>
                        </p>
                    </motion.div>
                </Tilt>

                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.8 }}
                    className="flex justify-center gap-8 mt-8">
                    {[['💎','Full Stack'],['🔐','JWT Secured'],['📊','Live Charts']].map(([icon, label]) => (
                        <div key={label} className="text-center">
                            <div className="text-xl mb-1">{icon}</div>
                            <p className="text-gray-600 text-xs font-medium">{label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

export default Login;