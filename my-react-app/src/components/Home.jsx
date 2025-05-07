import { useEffect, useState } from 'react';
import monsterImage from '../assets/tuafoto.jpg'; // Inserisci qui la tua immagine

const START_DATE = new Date('2018-04-01T00:00:00Z');

function Home() {
  const [elapsed, setElapsed] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = now - START_DATE;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      setElapsed(`${days} giorni, ${hours} ore, ${minutes} minuti`);
    }, 60000); // ogni minuto
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-4">
      <section className="text-center my-10">
        <h1 className="text-3xl font-bold">La mia Collezione di Monster Energy</h1>
        <p className="text-lg mt-2">Colleziono lattine di Monster dal <strong>1 Aprile 2018</strong></p>
        <p className="text-sm text-green-400 mt-1">Sono passati {elapsed}</p>
      </section>

      <section className="flex justify-center">
        <img src={monsterImage} alt="Io con le lattine" className="rounded-xl w-72 shadow-lg" />
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Alcune lattine dalla collezione</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">[Carosello 1]</div>
          <div className="bg-gray-800 p-4 rounded-lg">[Carosello 2]</div>
          <div className="bg-gray-800 p-4 rounded-lg">[Carosello 3]</div>
        </div>
      </section>
    </main>
  );
}

export default Home;
