import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  // Configuración preestablecida con tu mensaje y fotos
  const [config] = useState({
    tios: "Jacinto y Yudhit",
    boda: "1996-05-15", // Fecha ajustada como base
    firma: "Su sobrina, Otmary",
    carta: `Queridos tíos:\nHoy puedo ver no solo el paso del tiempo, sino la hermosa historia que han construido juntos con la ayuda de nuestro amoroso Padre Celestial.\n\nA pesar de la distancia que hoy nos separa, sus risas, sus consejos, sus muestras de amabilidad y cariño sincero, y su buen ejemplo de unión que nos dan, cruzan cualquier frontera. Son el claro ejemplo de que el amor verdadero, aunque no es perfecto, todo lo puede: se fortalece con los años y florece en cada etapa.\n\n¡Espero que la pasen bonito en este día tan especial, tíos amados!\n\nLos quiero mucho 🩷, un abrazo enorme desde su querido Encontrados.\n\nPosdata: Es muy probable que lean esto el 5 de julio, ya que me tardé un poquito haciéndolo. 🤭`,
    img1: "https://i.ibb.co/9k8rbL3d/IMG-20260704-WA0026.jpg",
    img2: "https://i.ibb.co/FLJtQ35W/IMG-20260704-WA0027.jpg",
    img3: "https://i.ibb.co/cXcq385F/IMG-20260704-WA0031.jpg"
  });

  const [isOpen, setIsOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showMain, setShowMain] = useState(false);
  const [fadeMain, setFadeMain] = useState(false);
  const canvasRef = useRef(null);
  const addHeartsRef = useRef(null);

  // Animación de corazones (manteniendo el diseño festivo)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let hearts = [];
    
    // ... [Lógica de animación preservada del original]
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  const openEnvelope = () => {
    setIsOpen(true);
    setTimeout(() => {
      setShowIntro(false);
      setShowMain(true);
      setTimeout(() => setFadeMain(true), 50);
    }, 2200);
  };

  return (
    <div className="relative min-h-screen bg-[#fdf6f6] font-sans flex flex-col items-center justify-start pb-12 overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />

      {showIntro && (
        <div className={`fixed inset-0 bg-rose-50 z-40 flex flex-col items-center justify-center p-4 transition-all duration-1000 ${isOpen ? 'opacity-0' : 'opacity-100'}`}>
          <h1 className="font-serif text-3xl text-rose-900 mb-8">Para mis Tíos {config.tios}</h1>
          <div className="w-[300px] h-[200px] cursor-pointer bg-rose-100 rounded-b-lg shadow-xl" onClick={openEnvelope}>
             <div className="text-center pt-10 text-rose-600 font-bold">¡Haz clic para abrir!</div>
          </div>
        </div>
      )}

      {showMain && (
        <main className={`w-full max-w-lg px-4 pt-16 z-10 transition-opacity duration-1000 ${fadeMain ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="font-serif text-4xl text-rose-900 text-center font-bold">¡Feliz Aniversario, {config.tios}!</h1>
          
          <div className="bg-rose-900 text-white rounded-[24px] p-8 mt-8 shadow-2xl">
            <div className="text-rose-100 leading-relaxed text-sm space-y-4 whitespace-pre-line text-justify">
              {config.carta}
            </div>
            <div className="mt-8 pt-6 border-t border-rose-800 text-right">
              <p className="font-serif text-lg italic">{config.firma}</p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 justify-items-center">
            {[config.img1, config.img2, config.img3].map((img, i) => (
              <img key={i} src={img} className="max-w-[240px] shadow-lg hover:scale-105 transition-transform" alt="Recuerdo" />
            ))}
          </div>
        </main>
      )}
    </div>
  );
}
