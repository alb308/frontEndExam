import React, { useEffect, useState } from 'react';

function Timer() {
  const startDate = new Date('2018-04-01T13:30:00Z');
  const [duration, setDuration] = useState({});

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = now - startDate;

      const seconds = Math.floor(diff / 1000) % 60;
      const minutes = Math.floor(diff / (1000 * 60)) % 60;
      const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const years = Math.floor(days / 365.25);

      setDuration({ years, days: days % 365, hours, minutes, seconds });
    };

    updateTimer(); // chiamata iniziale
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h2>Tempo da quando ho iniziato:</h2>
      <p>
        {duration.years} anni, {duration.days} giorni, {duration.hours} ore,{' '}
        {duration.minutes} minuti, {duration.seconds} secondi
      </p>
    </section>
  );
}

export default Timer;
