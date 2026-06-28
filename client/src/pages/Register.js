import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Register() {
    const [name, setName]       = useState('');
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
            const res = await API.post('/auth/register', { name, email, password });
            login(res.data.user, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally { setLoading(false); }
    };

    const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
    const strengthColors = ['','#f43f5e','#f59e0b','#10b981'];

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-10" style={{ background: 'var(--bg)' }}>
            <div className="grid-bg" />
            <motion.div animate={{ y:[0,-22,0], x:[0,12,0] }} transition={{ duration:9, repeat:Infinity }}
                className="orb w-96 h-96" style={{ top:-80, right:-80, background:'rgba(168,85,247,0.28)' }} />
            <motion.div animate={{ y:[0,20,0] }} transition={{ duration:8, repeat:Infinity, delay:2 }}
                className="orb w-72 h-72" style={{ bottom:-80, left:-60, background:'rgba(99,102,241,0.22)' }} />

            {['◆','★','◎','₿','▲','⬡'].map((icon, i) => (
                <motion.div key={i} animate={{ y:[0,-15,0], rotate:[0,6,-6,0] }}
                    transition={{ duration:4+i, repeat:Infinity, delay:i*0.5 }}
                    className="absolute font-mono font-black select-none pointer-events-none"
                    style={{
                        top:`${10+i*13}%`, right:`${5+i*15}%`,
                        fontSize:`${1+i%3*0.3}rem`,
                        color:['#a855f7','#6366f1','#06b6d4','#f59e0b','#10b981','#f43f5e'][i],
                        opacity:0.15,
                        textShadow:`0 0 20px ${['#a855f7','#6366f1','#06b6d4','#f59e0b','#10b981','#f43f5e'][i]}`,
                    }}>
                    {icon}
                </motion.div>
            ))}

            <div className="w-full max-w-md relative z-10">
                <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
                    className="text-center mb-8">
                    <Tilt tiltMaxAngleX={12} tiltMaxAngleY={12} scale={1.05} className="inline-block mb-5">
                        <div className="w-[72px] h-[72px] rounded-3xl flex items-center justify-center text-3xl mx-auto relative"
                            style={{ background:'linear-gradient(135deg,#a855f7,#6366f1)', boxShadow:'0 0 50px rgba(168,85,247,0.5)' }}>
                            🚀
                            <div className="absolute inset-0 rounded-3xl border border-purple-400/30 spin-slow" />
                        </div>
                    </Tilt>
                    <h1 className="text-4xl font-black text-white mb-2" style={{ fontFamily:'Syne,sans-serif' }}>Get started</h1>
                    <p className="text-gray-500 font-medium">Build your wealth tracking journey</p>
                </motion.div>

                <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} glareEnable glareMaxOpacity={0.05} scale={1.01}>
                    <motion.div initial={{ opacity:0, y:25 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.1 }}
                        className="glass-bright rounded-3xl p-8 shadow-2xl">
                        {error && (
                            <motion.div initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                                className="mb-5 px-4 py-3 rounded-xl text-sm font-medium"
                                style={{ background:'rgba(244,63,94,0.12)', border:'1px solid rgba(244,63,94,0.3)', color:'#fb7185' }}>
                                ⚠ {error}
                            </motion.div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block section-eyebrow mb-2">Full Name</label>
                                <input type="text" value={name} onChange={e=>setName(e.target.value)} required
                                    placeholder="Your Name" className="neo-input" />
                            </div>
                            <div>
                                <label className="block section-eyebrow mb-2">Email Address</label>
                                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
                                    placeholder="you@example.com" className="neo-input" />
                            </div>
                            <div>
                                <label className="block section-eyebrow mb-2">Password</label>
                                <div className="relative">
                                    <input type={showPw ? 'text' : 'password'} value={password}
                                        onChange={e=>setPass(e.target.value)} required minLength={6}
                                        placeholder="Min. 6 characters" className="neo-input pr-12" />
                                    <button type="button" onClick={() => setShowPw(!showPw)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-400 transition-colors text-sm">
                                        {showPw ? '◯' : '●'}
                                    </button>
                                </div>
                                {password.length > 0 && (
                                    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="mt-2">
                                        <div className="flex gap-1 mb-1">
                                            {[1,2,3].map(n => (
                                                <div key={n} className="h-1 flex-1 rounded-full transition-all duration-300"
                                                    style={{ background: strength >= n ? strengthColors[strength] : 'rgba(255,255,255,0.08)' }} />
                                            ))}
                                        </div>
                                        <p className="text-xs font-semibold" style={{ color: strengthColors[strength] }}>
                                            {['','Weak','Fair','Strong'][strength]}
                                        </p>
                                    </motion.div>
                                )}
                            </div>
                            <motion.button type="submit" disabled={loading}
                                whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.97 }}
                                className="btn-neon w-full py-4 text-base font-bold"
                                style={{ background:'linear-gradient(135deg,#a855f7,#6366f1)' }}>
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <motion.span animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}
                                            className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white" />
                                        Creating account...
                                    </span>
                                ) : 'Create Account →'}
                            </motion.button>
                        </form>
                        <div className="divider my-6" />
                        <p className="text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Sign in</Link>
                        </p>
                    </motion.div>
                </Tilt>
            </div>
        </div>
    );
}

export default Register;