import { useState, useEffect, useRef, useCallback } from 'react';
import { Clock } from 'lucide-react';

export default function Timer({ durationMinutes, startedAt, onTimeUp }) {
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
    const total = durationMinutes * 60;
    return Math.max(0, total - elapsed);
  });

  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;
  const firedRef = useRef(false);

  useEffect(() => {
    if (secondsLeft <= 0 && !firedRef.current) {
      firedRef.current = true;
      onTimeUpRef.current();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        if (next <= 0 && !firedRef.current) {
          firedRef.current = true;
          setTimeout(() => onTimeUpRef.current(), 0);
          clearInterval(interval);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isUrgent = secondsLeft <= 60;

  const formatTime = useCallback(() => {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, [minutes, seconds]);

  return (
    <div
      className={`flex flex-col items-center justify-center border-l border-b border-white/10 bg-[#050505] px-6 py-2 min-w-[140px] ${
        isUrgent ? 'animate-pulse-border border-white/40' : ''
      }`}
      id="exam-timer"
    >
      <span className="text-[10px] font-bold tracking-widest text-white/50 uppercase mb-0.5">
        Time Remaining
      </span>
      <span
        className={`font-mono text-3xl font-bold tracking-wider ${
          isUrgent ? 'text-white' : 'text-white'
        }`}
      >
        {formatTime()}
      </span>
    </div>
  );
}
