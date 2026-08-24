import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import useAuthStore from '../../store/authStore';

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

  const inputBase = { backgroundColor: '#ffffff', border: '1px solid #e2e2e2', borderRadius: '12px', padding: '14px 18px', fontSize: '14px', color: '#1b1b1b', outline: 'none', width: '100%' };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f9f9f9', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <nav className="border-b" style={{ backgroundColor: '#ffffff', borderColor: '#e2e2e2', padding: '16px 24px' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-extrabold text-xl tracking-tight" style={{ color: '#1b1b1b' }}>
            .computer<span style={{ color: '#5682B1' }}>Quiz</span>
          </Link>
          <span className="text-sm font-medium" style={{ color: '#727780' }}>Admin Portal</span>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6" style={{ paddingTop: '56px', paddingBottom: '56px' }}>
        <div className="w-full max-w-md">
          <div className="rounded-2xl" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e2e2', padding: '40px' }}>
            <div className="text-center" style={{ marginBottom: '32px' }}>
              <h1 className="font-bold" style={{ fontSize: '24px', color: '#1b1b1b', marginBottom: '8px' }}>Admin Portal</h1>
              <p className="text-sm" style={{ color: '#727780' }}>Sign in to manage assessments</p>
            </div>

            <form onSubmit={handleSubmit} id="admin-login-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {error && (
                <div className="flex items-center gap-3 rounded-xl" style={{ padding: '14px 16px', backgroundColor: 'rgba(186,26,26,0.06)', border: '1px solid rgba(186,26,26,0.15)', color: '#ba1a1a', fontSize: '14px' }}>
                  <AlertCircle size={16} className="shrink-0" /><span>{error}</span>
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold" style={{ color: '#42474f', marginBottom: '8px' }}>Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  style={inputBase} placeholder="admin@example.com"
                  onFocus={(e) => { e.target.style.borderColor = '#5682B1'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e2e2'; }} />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold" style={{ color: '#42474f', marginBottom: '8px' }}>Password</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  style={inputBase} placeholder="Enter your password"
                  onFocus={(e) => { e.target.style.borderColor = '#5682B1'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e2e2'; }} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 text-white text-sm font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5"
                style={{ backgroundColor: '#5682B1', borderRadius: '16px', padding: '16px', marginTop: '8px' }}
                onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#739EC9'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#5682B1'; }}
                id="login-submit-btn">
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><LogIn size={16} /> Sign In</>
                )}
              </button>
            </form>
          </div>
          <p className="text-center text-xs" style={{ color: '#c2c7d0', marginTop: '32px' }}>.computer Quiz Administration</p>
        </div>
      </main>
    </div>
  );
}
