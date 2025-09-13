import { useEffect, useRef, useState, useCallback } from "react";

export default function useTimer(
  duration,
  { active = true, onTimeout = null } = {}
) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const timerRef = useRef(null);

  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    setTimeLeft(duration);
    if (active) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            onTimeout && onTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [duration, active, onTimeout]);

  useEffect(() => {
    reset();
    return () => clearInterval(timerRef.current);
  }, [reset]);

  return [timeLeft, reset, setTimeLeft];
}
