import { useState, useEffect, useRef } from "react";
import { savePomodoro } from "../api";

export default function usePomodoro() {
  const [time, setTime] = useState(25 * 60); // 25 minutos
  const [isRunning, setIsRunning] = useState(false);
  const [cycles, setCycles] = useState([]);
  const intervalRef = useRef(null);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = (newTime = 25 * 60) => {
    setTime(newTime);
    setIsRunning(false);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            handleCycleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const handleCycleComplete = async () => {
    const now = new Date();
    const cycleData = { duration: 25, completed_at: now.toISOString() };
    setCycles(prev => [...prev, cycleData]);
    try {
      await savePomodoro(cycleData);
    } catch (err) {
      console.error("Erro ao salvar ciclo Pomodoro:", err);
    }
  };

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return {
    minutes,
    seconds,
    isRunning,
    start,
    pause,
    reset,
    cycles,
  };
}
