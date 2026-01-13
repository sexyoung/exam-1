import { useState, useRef, useEffect } from 'react';

function RunningClock() {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [displayTime, setDisplayTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const intervalRef = useRef<number | null>(null);

  function formatTime(totalSeconds: number): string {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function clearTimer(): void {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function startTimer(): void {
    clearTimer();
    intervalRef.current = window.setInterval(() => {
      setDisplayTime((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsRunning(false);
          setIsPaused(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function handleStart(): void {
    const totalSeconds = minutes * 60 + seconds;
    setDisplayTime(totalSeconds);
    setIsRunning(true);
    setIsPaused(false);
    startTimer();
  }

  function handlePauseResume(): void {
    if (!isRunning) {
      return;
    }

    if (isPaused) {
      setIsPaused(false);
      startTimer();
    } else {
      setIsPaused(true);
      clearTimer();
    }
  }

  function handleReset(): void {
    clearTimer();
    setMinutes(0);
    setSeconds(0);
    setDisplayTime(0);
    setIsRunning(false);
    setIsPaused(false);
  }

  useEffect(() => {
    return () => clearTimer();
  }, []);

  return (
    <div>
      <label>
        <input
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
        />
        Minutes
      </label>
      <label>
        <input
          type="number"
          value={seconds}
          onChange={(e) => setSeconds(Number(e.target.value))}
        />
        Seconds
      </label>
      <button onClick={handleStart}>START</button>
      <button onClick={handlePauseResume}>PAUSE / RESUME</button>
      <button onClick={handleReset}>RESET</button>
      <h1 data-testid="running-clock">{formatTime(displayTime)}</h1>
    </div>
  );
}

export default RunningClock;
