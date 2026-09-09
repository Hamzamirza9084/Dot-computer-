import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Clock, ArrowRight, BookOpen, Shield, Zap, Code, ListChecks, Download, Smartphone, Sparkles, CheckCircle2 } from 'lucide-react';
import api from '../../lib/axios';
import PageLayout from '../../components/PageLayout';

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

  const features = [
    {
      icon: Zap,
      title: 'Instant Feedback',
      description: 'Receive detailed results and performance analytics the moment you complete your assessment.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    },
    {
      icon: Shield,
      title: 'Timed Precision',
      description: 'Built-in countdown timer enforces strict time boundaries, simulating real-world exam conditions.',
      image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=400&fit=crop',
    },
    {
      icon: BookOpen,
      title: 'Rich Question Bank',
      description: 'Multiple-choice assessments crafted for depth, covering a broad range of topics and difficulty levels.',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop',
    },
  ];

  return (
    <PageLayout>
      {/* ==============================
          NAVIGATION - Glass on peach
          ============================== */}
      <nav className="fixed top-0 w-full z-50"
           style={{ background: 'rgba(255, 232, 219, 0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div className="mx-auto flex justify-between items-center" style={{ height: '80px', maxWidth: '1280px', paddingLeft: '32px', paddingRight: '32px' }}>
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight" style={{ color: '#1b1b1b' }}>
              .computer<span style={{ color: '#5682B1' }}>Quiz</span>
            </span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#assessments" className="text-sm font-semibold tracking-wide transition-colors duration-300"
               style={{ color: '#5682B1', borderBottom: '2px solid #5682B1', paddingBottom: '4px' }}>Assessments</a>
            <a href="#features" className="text-sm font-semibold tracking-wide transition-colors duration-300"
               style={{ color: '#1b1b1b' }}
               onMouseEnter={(e) => { e.currentTarget.style.color = '#5682B1'; }}
               onMouseLeave={(e) => { e.currentTarget.style.color = '#1b1b1b'; }}>Features</a>
            <a href="#download-app" className="text-sm font-semibold tracking-wide transition-colors duration-300 flex items-center gap-1.5"
               style={{ color: '#1b1b1b' }}
               onMouseEnter={(e) => { e.currentTarget.style.color = '#5682B1'; }}
               onMouseLeave={(e) => { e.currentTarget.style.color = '#1b1b1b'; }}>
              <Smartphone size={15} />
              Mobile App
            </a>
            <Link to="/admin/login" className="text-sm font-semibold tracking-wide transition-colors duration-300"
               style={{ color: '#1b1b1b' }}
               onMouseEnter={(e) => { e.currentTarget.style.color = '#5682B1'; }}
               onMouseLeave={(e) => { e.currentTarget.style.color = '#1b1b1b'; }}>Admin Portal</Link>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="/ionyou-app.apk"
              download="ionyou-app.apk"
              className="text-xs font-bold flex items-center gap-1.5 transition-all duration-300 hover:-translate-y-0.5"
              style={{ backgroundColor: 'rgba(86,130,177,0.15)', color: '#5682B1', border: '1px solid rgba(86,130,177,0.3)', borderRadius: '14px', padding: '10px 18px' }}
              title="Download ionyou-app.apk"
            >
              <Download size={14} />
              Download APK
            </a>
            <Link to="/admin/login"
              className="text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
              style={{ backgroundColor: '#5682B1', borderRadius: '16px', padding: '10px 24px' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#739EC9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#5682B1'; }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ==============================
          HERO SECTION - 2 Column on Peach
          ============================== */}
      <header style={{ backgroundColor: '#FFE8DB', paddingTop: '160px', paddingBottom: '80px', borderBottomLeftRadius: '48px', borderBottomRightRadius: '48px' }}>
        <div className="mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center" style={{ maxWidth: '1280px', paddingLeft: '32px', paddingRight: '32px' }}>
          {/* Left text */}
          <div className="lg:col-span-5 text-center lg:text-left" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <p className="text-sm font-semibold uppercase" style={{ color: '#5682B1', letterSpacing: '0.15em' }}>
              High-Performance Assessment Platform
            </p>
            <h1 className="font-extrabold" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: '1.08', letterSpacing: '-0.04em', color: '#1b1b1b' }}>
              Precision Testing.{' '}
              <br />
              <span style={{ color: '#5682B1' }}>Total Clarity.</span>
            </h1>
            <p className="max-w-xl mx-auto lg:mx-0" style={{ fontSize: '18px', lineHeight: '28px', color: '#42474f' }}>
              A distraction-free environment designed for cognitive focus and accurate measurement. Take assessments with confidence, receive instant results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#assessments"
                className="text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5"
                style={{ backgroundColor: '#5682B1', borderRadius: '16px', padding: '16px 32px' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#739EC9'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#5682B1'; }}>
                Browse Assessments
                <ArrowRight size={18} />
              </a>
              <Link to="/admin/login"
                className="text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-300"
                style={{ color: '#1b1b1b', padding: '16px 32px' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#5682B1'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#1b1b1b'; }}>
                Admin Portal
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right image */}
          <div className="lg:col-span-7 relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}>
            <img
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop"
              alt="Modern workspace with laptop showing code editor"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* ==============================
          FEATURES SECTION - Dark background
          ============================== */}
      <section id="features" style={{ backgroundColor: '#000000', paddingTop: '96px', paddingBottom: '96px' }}>
        <div className="mx-auto" style={{ maxWidth: '1280px', paddingLeft: '32px', paddingRight: '32px' }}>
          <div className="text-center" style={{ marginBottom: '64px' }}>
            <p className="text-sm font-semibold uppercase" style={{ color: '#5682B1', letterSpacing: '0.15em', marginBottom: '16px' }}>
              Why This Platform
            </p>
            <h2 className="font-bold text-white" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', lineHeight: '1.2', letterSpacing: '-0.02em' }}>
              Built for Focus, Designed for Results
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="rounded-2xl overflow-hidden transition-transform duration-300 hover:-translate-y-2"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', padding: '32px' }}
                >
                  {/* Feature image */}
                  <div className="w-full rounded-xl overflow-hidden" style={{ aspectRatio: '16/9', marginBottom: '24px' }}>
                    <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center gap-3" style={{ marginBottom: '16px' }}>
                    <div className="flex items-center justify-center shrink-0"
                         style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(86,130,177,0.2)', color: '#5682B1' }}>
                      <Icon size={20} />
                    </div>
                    <h3 className="font-semibold text-white" style={{ fontSize: '24px', lineHeight: '32px' }}>
                      {feature.title}
                    </h3>
                  </div>
                  <p style={{ fontSize: '16px', lineHeight: '24px', color: '#e2e2e2' }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      
      {/* ==============================
          MOBILE APP DOWNLOAD SECTION
          ============================== */}
      <section id="download-app" className="scroll-mt-20"
               style={{ backgroundColor: '#141414', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="mx-auto" style={{ maxWidth: '1280px', paddingLeft: '32px', paddingRight: '32px' }}>
          <div className="rounded-3xl p-8 sm:p-12 relative overflow-hidden"
               style={{ background: 'linear-gradient(135deg, rgba(86,130,177,0.12), rgba(255,255,255,0.03))', border: '1px solid rgba(86,130,177,0.25)', backdropFilter: 'blur(16px)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
                     style={{ backgroundColor: 'rgba(86,130,177,0.18)', color: '#5682B1' }}>
                  <Smartphone size={13} />
                  Android Application
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                  Download the <span style={{ color: '#5682B1' }}>IOnYou</span> Attendance App
                </h2>
                <p className="text-gray-300 text-base leading-relaxed mb-6 max-w-2xl">
                  Complete Campus Attendance Solution for Faculty and Students. Includes real-time FaceNet AI recognition, 3-hour RFID wall badge verification, and personal lecture history.
                </p>
                <div className="flex flex-wrap gap-4 items-center">
                  <a
                    href="/ionyou-app.apk"
                    download="ionyou-app.apk"
                    className="inline-flex items-center gap-2.5 font-bold text-white text-sm transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
                    style={{ backgroundColor: '#5682B1', borderRadius: '16px', padding: '14px 28px' }}
                  >
                    <Download size={18} />
                    Download APK Directly
                  </a>
                  <Link
                    to="/download"
                    className="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-300"
                    style={{ color: '#e2e2e2', padding: '14px 20px' }}
                  >
                    Installation Guide & Details
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-4 flex flex-col justify-center items-start lg:items-end gap-3 text-xs text-gray-400 font-medium border-t lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-8" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <span className="flex items-center gap-2 text-white/80"><CheckCircle2 size={16} className="text-green-500 shrink-0" /> Package: ionyou-app.apk</span>
                <span className="flex items-center gap-2 text-white/80"><CheckCircle2 size={16} className="text-green-500 shrink-0" /> Android 8.0 or higher</span>
                <span className="flex items-center gap-2 text-white/80"><CheckCircle2 size={16} className="text-green-500 shrink-0" /> Direct Sideload / No Play Store Needed</span>
                <span className="flex items-center gap-2 text-white/80"><CheckCircle2 size={16} className="text-green-500 shrink-0" /> Free & Open Campus Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================
          ASSESSMENTS SECTION - Dark
          ============================== */}
      <section id="assessments" className="scroll-mt-20"
               style={{ backgroundColor: '#303030', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '96px', paddingBottom: '96px' }}>
        <div className="mx-auto" style={{ maxWidth: '1280px', paddingLeft: '32px', paddingRight: '32px' }}>
          <div style={{ marginBottom: '48px' }}>
            <p className="text-sm font-semibold uppercase" style={{ color: '#5682B1', letterSpacing: '0.15em', marginBottom: '8px' }}>
              Available Now
            </p>
            <h2 className="font-bold text-white" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', lineHeight: '1.2', letterSpacing: '-0.02em' }}>
              Assessments
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-20 text-white/30 text-sm font-medium">Loading assessments...</div>
          ) : exams.length === 0 ? (
            <div className="text-center py-20 border border-dashed rounded-2xl" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <p className="text-white/30 text-sm font-medium">No assessments available right now. Check back soon.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {exams.map((exam) => (
                <div
                  key={exam._id}
                  className="rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 transition-colors duration-300"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', padding: '24px' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                >
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="shrink-0 flex items-center justify-center rounded-xl"
                         style={{ width: '64px', height: '64px', backgroundColor: 'rgba(86,130,177,0.1)', color: '#5682B1' }}>
                      <Code size={28} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white" style={{ fontSize: '24px', lineHeight: '32px', marginBottom: '4px' }}>
                        {exam.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm" style={{ color: '#e2e2e2' }}>
                        <span className="flex items-center gap-1"><Clock size={14} />{exam.durationMinutes}m</span>
                        <span className="flex items-center gap-1"><ListChecks size={14} />{exam.questionCount || 0} questions</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/exam/${exam._id}/enter`)}
                    className="text-white text-sm font-semibold whitespace-nowrap w-full md:w-auto transition-all duration-300 hover:-translate-y-0.5"
                    style={{ backgroundColor: '#5682B1', borderRadius: '16px', padding: '12px 32px' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#739EC9'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#5682B1'; }}
                    id={`take-exam-${exam._id}`}
                  >
                    Start Assessment
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==============================
          FOOTER - 4 Column Grid
          ============================== */}
      <footer style={{ backgroundColor: '#303030', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '64px', paddingBottom: '64px' }}>
        <div className="mx-auto grid grid-cols-1 md:grid-cols-4 gap-8" style={{ maxWidth: '1280px', paddingLeft: '32px', paddingRight: '32px' }}>
          <div>
            <span className="font-bold text-white" style={{ fontSize: '24px' }}>.computerQuiz</span>
            <p className="mt-4 text-sm" style={{ color: 'rgba(194,199,208,0.8)' }}>
              {new Date().getFullYear()} .computer Quiz Assessment Platform. All rights reserved.
            </p>
            <p className="text-sm font-medium" style={{ color: '#5682B1', marginTop: '8px' }}>
              Created by Hamza Mirza
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white" style={{ marginBottom: '8px' }}>Legal</h4>
            <span className="text-sm cursor-pointer transition-colors duration-300" style={{ color: 'rgba(194,199,208,0.8)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#5682B1'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(194,199,208,0.8)'; }}>Privacy Policy</span>
            <span className="text-sm cursor-pointer transition-colors duration-300" style={{ color: 'rgba(194,199,208,0.8)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#5682B1'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(194,199,208,0.8)'; }}>Terms of Service</span>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white" style={{ marginBottom: '8px' }}>Support</h4>
            <span className="text-sm cursor-pointer transition-colors duration-300" style={{ color: 'rgba(194,199,208,0.8)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#5682B1'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(194,199,208,0.8)'; }}>Contact Support</span>
            <span className="text-sm cursor-pointer transition-colors duration-300" style={{ color: 'rgba(194,199,208,0.8)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#5682B1'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(194,199,208,0.8)'; }}>Security</span>
          </div>
        </div>
      </footer>
    </PageLayout>
  );
}
