import { useState, useEffect, useRef, useCallback } from 'react';

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
    <span
      className="font-mono font-bold"
      style={{
        color: isUrgent ? '#ba1a1a' : 'inherit',
        fontSize: 'inherit',
      }}
      id="exam-timer"
    >
      {formatTime()}
    </span>
  );
}
