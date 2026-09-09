import { Link } from 'react-router-dom';
import { Download, Smartphone, CheckCircle2, ShieldCheck, Layers, Wifi, ArrowLeft, FileDown, Sparkles } from 'lucide-react';
import PageLayout from '../../components/PageLayout';

export default function DownloadApp() {
  const downloadUrl = '/ionyou-app.apk';

  const steps = [
    {
      num: '01',
      title: 'Download the APK',
      desc: 'Tap the button below to download the ionyou-app.apk package directly to your Android device.',
    },
    {
      num: '02',
      title: 'Enable Unknown Sources',
      desc: 'If prompted by Chrome or Android, open Settings and toggle "Allow from this source" to permit installation.',
    },
    {
      num: '03',
      title: 'Install & Open',
      desc: 'Tap the downloaded file from your notifications or Files app, tap "Install", then open the application.',
    },
    {
      num: '04',
      title: 'Sign In',
      desc: 'Log in with your university Student or Faculty credentials to access your attendance records and check-in portal.',
    },
  ];

  const highlights = [
    {
      icon: ShieldCheck,
      title: 'FaceNet Biometric AI',
      desc: 'Instant face recognition verification matching your face against enrolled vectors in real time.',
    },
    {
      icon: Wifi,
      title: '3-Hour RFID Wall Session',
      desc: 'Tap once at the classroom door RFID scanner to activate a 3-hour presence window for all lectures.',
    },
    {
      icon: Layers,
      title: 'Faculty & Student Portals',
      desc: 'Faculty manage attendance sessions and inspect absent rosters; students monitor overall % and exam eligibility.',
    },
  ];

  return (
    <PageLayout>
      {/* Navbar */}
      <nav
        className="fixed top-0 w-full z-50"
        style={{
          background: 'rgba(255, 232, 219, 0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <div
          className="mx-auto flex justify-between items-center"
          style={{ height: '80px', maxWidth: '1280px', paddingLeft: '32px', paddingRight: '32px' }}
        >
          <Link to="/" className="flex items-center gap-3">
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight" style={{ color: '#1b1b1b' }}>
              .computer<span style={{ color: '#5682B1' }}>Quiz</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm font-semibold flex items-center gap-1.5 transition-colors duration-300"
              style={{ color: '#1b1b1b' }}
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header
        style={{
          backgroundColor: '#FFE8DB',
          paddingTop: '160px',
          paddingBottom: '90px',
          borderBottomLeftRadius: '48px',
          borderBottomRightRadius: '48px',
        }}
      >
        <div className="mx-auto text-center" style={{ maxWidth: '800px', paddingLeft: '32px', paddingRight: '32px' }}>
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6"
            style={{ backgroundColor: 'rgba(86,130,177,0.15)', color: '#5682B1' }}
          >
            <Smartphone size={14} />
            Official Android Mobile App
          </div>
          <h1
            className="font-extrabold mb-6 text-gray-900"
            style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
              lineHeight: '1.12',
              letterSpacing: '-0.03em',
            }}
          >
            Download the <span style={{ color: '#5682B1' }}>IOnYou</span> Attendance App
          </h1>
          <p className="text-lg mb-10 text-gray-700 leading-relaxed" style={{ maxWidth: '640px', margin: '0 auto 40px auto' }}>
            Seamless faculty attendance recording, contactless RFID wall check-ins, and student academic eligibility tracking — right on your Android device.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <a
              href={downloadUrl}
              download="ionyou-app.apk"
              className="inline-flex items-center justify-center gap-3 font-bold text-white text-base transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
              style={{ backgroundColor: '#5682B1', borderRadius: '18px', padding: '18px 42px' }}
            >
              <Download size={22} />
              Download APK (Direct)
            </a>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-gray-600 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-600" /> Android 8.0+</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-600" /> Free Download</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-amber-600" /> Latest Version</span>
          </div>
        </div>
      </header>

      {/* Highlights Grid */}
      <section style={{ backgroundColor: '#000000', paddingTop: '96px', paddingBottom: '96px' }}>
        <div className="mx-auto" style={{ maxWidth: '1280px', paddingLeft: '32px', paddingRight: '32px' }}>
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#5682B1] mb-2">
              App Capabilities
            </p>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Engineered for Modern Campus Operations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((h, i) => {
              const Icon = h.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl p-8 transition-transform duration-300 hover:-translate-y-2"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-[#5682B1]" style={{ backgroundColor: 'rgba(86,130,177,0.15)' }}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{h.title}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">{h.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Installation Guide */}
      <section style={{ backgroundColor: '#1a1a1a', paddingTop: '96px', paddingBottom: '96px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="mx-auto" style={{ maxWidth: '1000px', paddingLeft: '32px', paddingRight: '32px' }}>
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#5682B1] mb-2">
              Quick Setup
            </p>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              How to Install the APK on Android
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="rounded-2xl p-6 relative overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="text-4xl font-black mb-3" style={{ color: 'rgba(86,130,177,0.25)' }}>
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Download Card */}
          <div
            className="mt-16 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(86,130,177,0.15), rgba(86,130,177,0.05))',
              border: '1px solid rgba(86,130,177,0.3)',
            }}
          >
            <h3 className="text-2xl font-extrabold text-white mb-3">Ready to get started?</h3>
            <p className="text-gray-300 text-sm max-w-md mx-auto mb-8">
              Click the button below to initiate the direct APK download to your Android phone.
            </p>
            <a
              href={downloadUrl}
              download="ionyou-app.apk"
              className="inline-flex items-center gap-3 font-bold text-white text-base transition-all duration-300 hover:-translate-y-1 shadow-lg"
              style={{ backgroundColor: '#5682B1', borderRadius: '16px', padding: '16px 36px' }}
            >
              <FileDown size={20} />
              Download ionyou-app.apk
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#141414', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px 32px' }}>
        <div className="mx-auto flex flex-col sm:flex-row items-center justify-between gap-4" style={{ maxWidth: '1280px' }}>
          <span className="font-bold text-white text-lg">.computerQuiz & IOnYou</span>
          <p className="text-xs text-gray-500">
            {new Date().getFullYear()} Campus Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </PageLayout>
  );
}
