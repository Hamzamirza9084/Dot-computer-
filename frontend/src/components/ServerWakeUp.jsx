import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.PROD
  ? 'https://dot-computer.onrender.com'
  : '';

export default function ServerWakeUp({ children }) {
  const [status, setStatus] = useState('checking'); // checking | ready | waking
  const [dots, setDots] = useState('');

  useEffect(() => {
    // In development, skip the check
    if (!import.meta.env.PROD) {
      setStatus('ready');
      return;
    }

    let attempt = 0;
    const maxAttempts = 6; // 6 attempts × 10s = 60s max wait

    const checkServer = async () => {
      try {
        await axios.get(`${API_BASE}/api/health`, { timeout: 10000 });
        setStatus('ready');
      } catch {
        attempt++;
        if (attempt >= maxAttempts) {
          setStatus('ready'); // Let them through anyway, requests will retry
        } else {
          setStatus('waking');
          setTimeout(checkServer, 10000);
        }
      }
    };

    checkServer();
  }, []);

  // Animate the dots
  useEffect(() => {
    if (status !== 'waking' && status !== 'checking') return;
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 500);
    return () => clearInterval(interval);
  }, [status]);

  if (status === 'ready') return children;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center"
         style={{ backgroundColor: '#f9f9f9', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="text-center" style={{ maxWidth: '400px', padding: '40px' }}>
        <div className="font-extrabold text-2xl" style={{ color: '#1b1b1b', marginBottom: '24px' }}>
          .computer<span style={{ color: '#5682B1' }}>Quiz</span>
        </div>

        {/* Animated loader */}
        <div style={{ marginBottom: '24px' }}>
          <div className="inline-flex gap-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="rounded-full"
                   style={{
                     width: '10px', height: '10px', backgroundColor: '#5682B1',
                     animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                   }} />
            ))}
          </div>
        </div>

        <p className="font-semibold" style={{ fontSize: '16px', color: '#1b1b1b', marginBottom: '8px' }}>
          {status === 'checking' ? 'Connecting to server' : 'Waking up server'}{dots}
        </p>
        <p className="text-sm" style={{ color: '#727780', lineHeight: '22px' }}>
          {status === 'checking'
            ? 'Checking server status...'
            : 'Our free server goes to sleep when inactive. This takes 20-40 seconds. Please wait...'}
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
