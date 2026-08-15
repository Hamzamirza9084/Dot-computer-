import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Clock, Lock } from 'lucide-react';
import api from '../../lib/axios';
import PageLayout from '../../components/PageLayout';
import GradientWaves from '../../components/GradientWaves';

export default function Home() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await api.get('/exams');
        setExams(res.data.data);
      } catch (err) {
        console.error('Failed to load exams:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  return (
    <PageLayout>
      {/* Gradient wave background — Home only */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ width: '100%', height: '100vh' }}>
        <GradientWaves
          horizonColor="#5227FF"
          waveColor="#FF9FFC"
          crestColor="#FFFFFF"
          speed={0.4}
          amplitude={2.5}
          waveScale={0.6}
          waveRatio={0.9}
          swell={35}
          turbulence={20}
          tilt={1.11}
          zoom={1}
          height={5.5}
          fogDepth={15}
          detail="medium"
          brightness={1}
          opacity={1}
          mouseInteraction
          parallaxStrength={0.5}
          grain
          grainIntensity={0.05}
        />
      </div>

      {/* Top Navigation */}
      <nav className="border-b border-white/10 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
          <Link to="/" className="font-bold text-lg sm:text-2xl tracking-tight text-white">
            .computer Quiz
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/" className="text-white text-xs sm:text-sm font-medium border-b border-white/50 pb-0.5">
              Exams
            </Link>
            <Link
              to="/admin/login"
              className="text-[11px] sm:text-xs font-mono tracking-widest uppercase border border-purple-400/40 px-3 sm:px-4 py-1.5 text-purple-300/80 hover:text-white hover:border-purple-400/70 hover:bg-purple-500/10 transition-all rounded-sm"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full border-b border-white/10 py-12 sm:py-20 lg:py-24">
        <div className="w-full max-w-6xl mx-auto px-6 sm:px-8 text-center">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white uppercase leading-none mb-4">
            Zero Emotion.<br />Total Focus.
          </h1>
          <p className="text-white/40 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            High-performance testing environment designed for absolute precision and cognitive load reduction.
          </p>
        </div>
      </section>

      {/* Exams Grid */}
      <main className="flex-1 w-full">
        <div className="w-full max-w-6xl mx-auto px-6 sm:px-8 py-8 sm:py-12 lg:py-16">
        {loading ? (
          <div className="text-center text-white/30 py-16 sm:py-20 font-mono text-sm uppercase tracking-widest">
            Loading assessments...
          </div>
        ) : exams.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <Lock size={24} className="mx-auto text-white/20 mb-3" />
            <p className="text-white/40 text-sm">No exams available right now. Check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
              <div
                key={exam._id}
                className="w-full border border-white/10 bg-white/[0.02] backdrop-blur-sm p-5 sm:p-6 flex flex-col justify-between hover:border-purple-400/30 hover:bg-white/[0.04] transition-all duration-300 group rounded-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h2 className="text-sm sm:text-base font-bold tracking-tight text-white/90 group-hover:text-white transition-colors">
                      {exam.title}
                    </h2>
                    <span className="flex items-center gap-1 text-purple-300/50 text-xs font-mono shrink-0">
                      <Clock size={12} />
                      {exam.durationMinutes}m
                    </span>
                  </div>
                  {exam.description && (
                    <p className="text-white/35 text-xs sm:text-sm mb-5 sm:mb-6 line-clamp-2 leading-relaxed">
                      {exam.description}
                    </p>
                  )}
                  {!exam.description && <div className="mb-5 sm:mb-6" />}
                </div>
                <button
                  onClick={() => navigate(`/exam/${exam._id}/enter`)}
                  className="w-full py-2.5 text-xs sm:text-sm font-medium bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-500 hover:to-purple-400 transition-all duration-300 rounded-sm uppercase tracking-wider font-mono"
                  id={`take-exam-${exam._id}`}
                >
                  Start Exam
                </button>
              </div>
            ))}

            {/* Placeholder card */}
            <div className="w-full border border-dashed border-white/10 p-5 sm:p-6 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[180px] rounded-sm">
              <Lock size={20} className="text-white/15 mb-2" />
              <p className="text-white/20 text-[11px] font-mono uppercase tracking-widest text-center">
                More exams unlocking soon
              </p>
            </div>
          </div>
        )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#050505]/60 backdrop-blur-sm py-5 sm:py-6 px-6 sm:px-8 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-[11px] font-mono uppercase tracking-wider">
            &copy; {new Date().getFullYear()} .computer Quiz. Zero Emotion. Total Focus.
          </p>
          <div className="flex gap-5 sm:gap-6 text-white/20 text-[11px] font-mono uppercase tracking-wider">
            <span className="hover:text-white/40 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white/40 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-white/40 cursor-pointer transition-colors">Support</span>
          </div>
        </div>
      </footer>
    </PageLayout>
  );
}
