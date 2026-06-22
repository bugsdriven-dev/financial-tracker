import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const res = await API.post('/auth/forgot-password', { email });
            setSuccess(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Forgot Password? 🔑
                </h1>
                <p className="text-center text-gray-500 mb-6">
                    Enter your email and we'll send you a reset link
                </p>

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 text-green-600 p-3 rounded mb-4 text-sm">
                        ✅ {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Remember your password?{' '}
                    <Link to="/login" className="text-blue-600 font-medium">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default ForgotPassword;