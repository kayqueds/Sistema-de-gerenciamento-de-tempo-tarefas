import { useEffect, useState } from 'react';
import './Error404Clock.css';

function Error404Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Cálculo dos graus dos ponteiros do relógio
  const secondsDegrees = (time.getSeconds() / 60) * 360 + 90;
  const minutesDegrees = (time.getMinutes() / 60) * 360 + (time.getSeconds() / 60) * 6 + 90;
  const hoursDegrees = ((time.getHours() % 12) / 12) * 360 + (time.getMinutes() / 60) * 30 + 90;

  return (
    <div className="clock-error-container">
      <h1 className="error-code">404</h1>
      <p className="error-message">O tempo parou aqui...</p>
      <div className="clock">
        <div className="clock-face">
          <div
            className="hand hour-hand"
            style={{ transform: `rotate(${hoursDegrees}deg)` }}
          ></div>
          <div
            className="hand min-hand"
            style={{ transform: `rotate(${minutesDegrees}deg)` }}
          ></div>
          <div
            className="hand second-hand"
            style={{ transform: `rotate(${secondsDegrees}deg)` }}
          ></div>
          {[...Array(12)].map((_, i) => (
            <div key={i} className="tick" style={{ transform: `rotate(${i * 30}deg)` }} />
          ))}
        </div>
      </div>
      <button className="error-button" onClick={() => window.location.href = '/'}>
        Voltar para a página inicial
      </button>
    </div>
  );
}

export default Error404Clock;
