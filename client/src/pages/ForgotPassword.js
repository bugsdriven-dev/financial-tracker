import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import API from '../api/axios';

function ForgotPassword() {
    const [email, setEmail]     = useState('');
    const [error, setError]     = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setSuccess(''); setLoading(true);
        try { const res = await API.post('/auth/forgot-password', { email }); setSuccess(res.data.message); }
        catch (err) { setError(err.response?.data?.message || 'Something went wrong'); }
        finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4" style={{ background:'var(--bg)' }}>
            <div className="grid-bg" />
            <motion.div animate={{ y:[0,-18,0] }} transition={{ duration:7, repeat:Infinity }}
                className="orb w-80 h-80" style={{ top:-80, left:-80, background:'rgba(99,102,241,0.28)' }} />
            <motion.div animate={{ y:[0,16,0] }} transition={{ duration:9, repeat:Infinity, delay:1 }}
                className="orb w-72 h-72" style={{ bottom:-60, right:-60, background:'rgba(168,85,247,0.22)' }} />

            <div className="w-full max-w-md relative z-10">
                <motion.div initial={{ opacity:0, y:-30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }} className="text-center mb-8">
                    <Tilt tiltMaxAngleX={12} tiltMaxAngleY={12} scale={1.06} className="inline-block mb-5">
                        <div className="w-[72px] h-[72px] rounded-3xl flex items-center justify-center text-3xl mx-auto relative"
                            style={{ background:'linear-gradient(135deg,#6366f1,#a855f7)', boxShadow:'0 0 50px rgba(99,102,241,0.5)' }}>
                            🔑
                            <div className="absolute inset-0 rounded-3xl border border-indigo-400/30 spin-slow" />
                        </div>
                    </Tilt>
                    <h1 className="text-4xl font-black text-white mb-2" style={{ fontFamily:'Syne,sans-serif' }}>Forgot Password?</h1>
                    <p className="text-gray-500 font-medium">No worries — we'll send a reset link</p>
                </motion.div>

                <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} glareEnable glareMaxOpacity={0.06} scale={1.01}>
                    <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.15 }}
                        className="glass-bright rounded-3xl p-8 shadow-2xl">
                        {error && (
                            <motion.div initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} className="mb-5 px-4 py-3 rounded-xl text-sm"
                                style={{ background:'rgba(244,63,94,0.12)', border:'1px solid rgba(244,63,94,0.3)', color:'#fb7185' }}>⚠ {error}</motion.div>
                        )}
                        {success && (
                            <motion.div initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} className="mb-5 px-4 py-3 rounded-xl text-sm"
                                style={{ background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.3)', color:'#34d399' }}>✓ {success}</motion.div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block section-eyebrow mb-2">Registered Email</label>
                                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
                                    placeholder="you@example.com" className="neo-input" />
                            </div>
                            <motion.button type="submit" disabled={loading}
                                whileHover={{ scale:loading?1:1.02 }} whileTap={{ scale:loading?1:0.97 }}
                                className="btn-neon w-full py-4 font-bold text-base">
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <motion.span animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}
                                            className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white" />
                                        Sending...
                                    </span>
                                ) : 'Send Reset Link →'}
                            </motion.button>
                        </form>
                        <div className="divider my-6" />
                        <p className="text-center text-sm text-gray-500">
                            Remember it?{' '}
                            <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Back to Login</Link>
                        </p>
                    </motion.div>
                </Tilt>
            </div>
        </div>
    );
}

export default ForgotPassword;