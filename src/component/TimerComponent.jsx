import React, { useEffect, useState } from 'react';
import '../style/TimerComponent.css';

const TimerComponent = ({ totalTime, handleTimeOut, handleResetTime }) => {
  const savedTimeLeft = parseInt(localStorage.getItem('timeLeft')) || totalTime;
  const [timeLeft, setTimeLeft] = useState(savedTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          localStorage.setItem('timeLeft', newTime.toString());
          return newTime;
        });
      } else {
        clearInterval(timer);
        handleTimeOut();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, handleTimeOut]);

  useEffect(() => {
    if (handleResetTime) {
      setTimeLeft(0);
      localStorage.setItem('timeLeft', '0');
    }
  }, [handleResetTime]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = timeLeft <= 0 ? '00:00' : `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;

  return (
    <div className="timer">
      <p>Time Left: {formattedTime}</p>
    </div>
  );
};

export default TimerComponent;
