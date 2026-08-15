import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import PageLayout from '../../components/PageLayout';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      {/* Top Navigation */}
      <nav className="border-b border-white/10 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
          <Link to="/" className="font-bold text-lg sm:text-2xl tracking-tight text-white">
            .computer Quiz
          </Link>
          <span className="text-white/30 text-[11px] sm:text-xs font-mono uppercase tracking-widest">
            Admin Portal
          </span>
        </div>
      </nav>

      {/* Login Form — centered */}
      <main className="flex-1 flex items-center justify-center px-6 sm:px-8 py-10 sm:py-16">
        <div className="w-full max-w-md mx-auto">
          <div className="border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6 sm:p-8 lg:p-10 rounded-sm">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white mb-1">Admin Portal</h1>
              <p className="text-purple-300/40 text-[11px] sm:text-xs font-mono uppercase tracking-widest">
                Authenticate to manage assessments
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" id="admin-login-form">
              {error && (
                <div className="flex items-center gap-3 p-3 sm:p-4 border border-red-500/20 bg-red-500/5 text-red-300/80 text-xs sm:text-sm rounded-sm">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-[11px] sm:text-xs font-mono text-white/40 mb-2 uppercase tracking-widest">Email</label>
                <input
                  type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/15 text-white placeholder-white/20 focus:outline-none focus:border-purple-400/50 focus:bg-white/[0.05] transition-all rounded-sm"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-[11px] sm:text-xs font-mono text-white/40 mb-2 uppercase tracking-widest">Password</label>
                <input
                  type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/15 text-white placeholder-white/20 focus:outline-none focus:border-purple-400/50 focus:bg-white/[0.05] transition-all rounded-sm"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-mono font-semibold text-xs uppercase tracking-widest hover:from-purple-500 hover:to-purple-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all rounded-sm mt-2"
                id="login-submit-btn"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><LogIn size={14} strokeWidth={2.5} /> Sign In</>
                )}
              </button>
            </form>
          </div>
          <p className="text-center text-white/15 text-[10px] sm:text-[11px] mt-6 sm:mt-8 font-mono uppercase tracking-widest">.computer Quiz Admin</p>
        </div>
      </main>
    </PageLayout>
  );
}
