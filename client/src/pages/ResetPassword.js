import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import API from '../api/axios';

function ResetPassword() {
    const [newPass, setNew]         = useState('');
    const [confirmPass, setConfirm] = useState('');
    const [error, setError]         = useState('');
    const [success, setSuccess]     = useState('');
    const [loading, setLoading]     = useState(false);
    const [showPw, setShowPw]       = useState(false);
    const { token } = useParams();
    const navigate  = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setSuccess('');
        if (newPass !== confirmPass) { setError('Passwords do not match'); return; }
        if (newPass.length < 6) { setError('Password must be at least 6 characters'); return; }
        setLoading(true);
        try {
            const res = await API.post('/auth/reset-password', { token, newPassword:newPass });
            setSuccess(res.data.message);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) { setError(err.response?.data?.message || 'Reset failed'); }
        finally { setLoading(false); }
    };

    const strength = newPass.length===0?0:newPass.length<6?1:newPass.length<10?2:3;
    const strengthColors = ['','#f43f5e','#f59e0b','#10b981'];

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4" style={{ background:'var(--bg)' }}>
            <div className="grid-bg" />
            <motion.div animate={{ y:[0,-18,0] }} transition={{ duration:7, repeat:Infinity }}
                className="orb w-80 h-80" style={{ top:-80, right:-80, background:'rgba(168,85,247,0.28)' }} />
            <motion.div animate={{ y:[0,16,0] }} transition={{ duration:9, repeat:Infinity, delay:1 }}
                className="orb w-72 h-72" style={{ bottom:-60, left:-60, background:'rgba(99,102,241,0.22)' }} />

            <div className="w-full max-w-md relative z-10">
                <motion.div initial={{ opacity:0, y:-30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }} className="text-center mb-8">
                    <Tilt tiltMaxAngleX={12} tiltMaxAngleY={12} scale={1.06} className="inline-block mb-5">
                        <div className="w-[72px] h-[72px] rounded-3xl flex items-center justify-center text-3xl mx-auto relative"
                            style={{ background:'linear-gradient(135deg,#a855f7,#6366f1)', boxShadow:'0 0 50px rgba(168,85,247,0.5)' }}>
                            🔐
                            <div className="absolute inset-0 rounded-3xl border border-purple-400/30 spin-slow" />
                        </div>
                    </Tilt>
                    <h1 className="text-4xl font-black text-white mb-2" style={{ fontFamily:'Syne,sans-serif' }}>Set New Password</h1>
                    <p className="text-gray-500 font-medium">Choose something strong and secure</p>
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
                                style={{ background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.3)', color:'#34d399' }}>✓ {success} — Redirecting...</motion.div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block section-eyebrow mb-2">New Password</label>
                                <div className="relative">
                                    <input type={showPw?'text':'password'} value={newPass} onChange={e=>setNew(e.target.value)} required
                                        placeholder="Min. 6 characters" className="neo-input pr-12" />
                                    <button type="button" onClick={() => setShowPw(!showPw)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-400 transition-colors text-sm">
                                        {showPw?'◯':'●'}
                                    </button>
                                </div>
                                {newPass.length>0 && (
                                    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="mt-2">
                                        <div className="flex gap-1">
                                            {[1,2,3].map(n=>(
                                                <div key={n} className="h-1 flex-1 rounded-full transition-all duration-300"
                                                    style={{ background:strength>=n?strengthColors[strength]:'rgba(255,255,255,0.08)' }} />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                            <div>
                                <label className="block section-eyebrow mb-2">Confirm Password</label>
                                <input type={showPw?'text':'password'} value={confirmPass} onChange={e=>setConfirm(e.target.value)} required
                                    placeholder="Re-enter password" className="neo-input"
                                    style={confirmPass&&newPass!==confirmPass?{borderColor:'rgba(244,63,94,0.5)',boxShadow:'0 0 0 3px rgba(244,63,94,0.1)'}:{}} />
                                {confirmPass&&newPass!==confirmPass&&<p className="text-xs mt-1" style={{ color:'#fb7185' }}>Passwords do not match</p>}
                            </div>
                            <motion.button type="submit" disabled={loading}
                                whileHover={{ scale:loading?1:1.02 }} whileTap={{ scale:loading?1:0.97 }}
                                className="btn-neon w-full py-4 font-bold text-base"
                                style={{ background:'linear-gradient(135deg,#a855f7,#6366f1)' }}>
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <motion.span animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}
                                            className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white" />
                                        Resetting...
                                    </span>
                                ) : 'Reset Password →'}
                            </motion.button>
                        </form>
                        <div className="divider my-6" />
                        <p className="text-center text-sm text-gray-500">
                            <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">← Back to Login</Link>
                        </p>
                    </motion.div>
                </Tilt>
            </div>
        </div>
    );
}

export default ResetPassword;