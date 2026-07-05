import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  // CONFIGURACIONES PREDETERMINADAS
  const [config, setConfig] = useState({
    tios: "Queridos Tíos Jacinto y Yudhit",
    boda: "1996-07-04",
    firma: "Su sobrina, Otmary",
    carta: `Queridos tíos, hoy mi corazón se detiene a contemplar no solo el paso del tiempo, sino la hermosa historia que han construido juntos con la ayuda de nuestro amoroso padre celestial.\n\nA pesar de la distancia que hoy nos separa, sus risas, consejos, sus muestras de amabilidad y cariño sincero y el inmenso ejemplo de unión que nos dan cruzan cualquier frontera. Son el claro ejemplo de que el amor verdadero, aunque no es perfecto, todo lo puede, se fortalece con los años y florece en cada etapa.\n\n¡Que la pasen muy bien en este día tan especial, tíos amados!\n\nPosdata: Es muy probable que lean esto el 5 de julio. 🤭\n\nLos quiero mucho 🩷, un abrazo desde su querido Encontrados.`,
    img1: "https://i.ibb.co/9k8rbL3d/IMG-20260704-WA0026.jpg",
    img2: "https://i.ibb.co/FLJtQ35W/IMG-20260704-WA0027.jpg",
    img3: "https://i.ibb.co/cXcq385F/IMG-20260704-WA0031.jpg",
    locked: true
  });

  const [isOpen, setIsOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showMain, setShowMain] = useState(false);
  const [fadeMain, setFadeMain] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [yearsCount, setYearsCount] = useState("--");

  const [inputNames, setInputNames] = useState(config.tios);
  const [inputWeddingDate, setInputWeddingDate] = useState(config.boda);
  const [inputSignature, setInputSignature] = useState(config.firma);
  const [inputLetter, setInputLetter] = useState(config.carta);

  const [toast, setToast] = useState({ show: false, message: "", icon: "" });

  const canvasRef = useRef(null);
  const addHeartsRef = useRef(null);

  // Cargar parámetros de la URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let updatedConfig = { ...config };

    if (params.has('t')) updatedConfig.tios = decodeURIComponent(params.get('t'));
    if (params.has('b')) updatedConfig.boda = decodeURIComponent(params.get('b'));
    if (params.has('f')) updatedConfig.firma = decodeURIComponent(params.get('f'));
    if (params.has('c')) updatedConfig.carta = decodeURIComponent(params.get('c'));
    if (params.has('l') && params.get('l') === "1") updatedConfig.locked = true;

    // YA NO LEEMOS DE LOCALSTORAGE PARA ASEGURAR QUE LAS FOTOS CARGUEN SIEMPRE
    setConfig(updatedConfig);
    setInputNames(updatedConfig.tios);
    setInputWeddingDate(updatedConfig.boda);
    setInputSignature(updatedConfig.firma);
    setInputLetter(updatedConfig.carta);
  }, []);

  // Calcular el contador de años
  useEffect(() => {
    const weddingDate = new Date(config.boda + 'T00:00:00');
    const now = new Date();
    let years = now.getFullYear() - weddingDate.getFullYear();
    let months = now.getMonth() - weddingDate.getMonth();
    let days = now.getDate() - weddingDate.getDate();

    if (days < 0) months--;
    if (months < 0) years--;

    setYearsCount(years);
  }, [config.boda]);

  // Canvas Animación de Corazones (Mantenida igual)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let hearts = [];
    const resizeCanvas = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Heart {
      constructor(x, y, isSparkle = false) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || canvas.height + Math.random() * 50;
        this.size = Math.random() * 12 + 6;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = -(Math.random() * 1.5 + 0.8);
        this.opacity = Math.random() * 0.5 + 0.3;
        this.color = `rgba(${220 + Math.random() * 35}, ${50 + Math.random() * 50}, ${80 + Math.random() * 50}, `;
        this.isSparkle = isSparkle;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.beginPath();
        const d = this.size;
        ctx.translate(this.x, this.y);
        ctx.moveTo(0, -d / 4);
        ctx.bezierCurveTo(-d / 2, -d, -d, -d / 3, 0, d / 2);
        ctx.bezierCurveTo(d, -d / 3, d / 2, -d, 0, -d / 4);
        ctx.fill();
        ctx.restore();
      }
      update() { this.x += this.speedX; this.y += this.speedY; this.opacity -= 0.001; }
    }
    
    addHeartsRef.current = (x, y, count = 8) => { for (let i = 0; i < count; i++) hearts.push(new Heart(x, y, true)); };

    let animationFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = hearts.length - 1; i >= 0; i--) {
        hearts[i].update();
        hearts[i].draw();
        if (hearts[i].y < -20 || hearts[i].opacity <= 0) hearts.splice(i, 1);
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const openEnvelope = () => {
    setIsOpen(true);
    setTimeout(() => {
      setShowIntro(false);
      setShowMain(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setFadeMain(true), 50);
    }, 2200);
  };

  const getFormattedDate = () => {
    const dateObj = new Date(config.boda + 'T00:00:00');
    return `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
  };

  return (
    <div className="relative min-h-screen bg-[#fdf6f6] font-sans flex flex-col items-center justify-start pb-12 overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />

      {showIntro && (
        <div className={`fixed inset-0 bg-rose-50 z-40 flex flex-col items-center justify-center p-4 transition-all duration-1000 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="text-center mb-8 max-w-sm px-4">
            <h1 className="font-serif text-3xl text-rose-900 font-bold">Para mis {config.tios}</h1>
            <p className="text-gray-600 mt-3 text-sm">Toquen el sobre para abrir su sorpresa.</p>
          </div>
          <div className="w-[300px] h-[200px] cursor-pointer relative" onClick={openEnvelope}>
             <div className={`w-full h-full bg-rose-100 rounded-b-lg shadow-xl border-b-4 border-rose-300 transition-transform duration-1000`} style={{ transform: isOpen ? 'rotateX(-15deg) translateY(150px)' : 'none' }}>
                <div className="absolute top-0 left-0 w-0 h-0 border-l-[150px] border-l-transparent border-r-[150px] border-r-transparent border-t-[100px] border-t-rose-500" style={{ transform: isOpen ? 'rotateX(180deg)' : 'none' }} />
             </div>
          </div>
        </div>
      )}

      {showMain && (
        <main className={`w-full max-w-lg px-4 pt-16 mt-4 z-10 transition-opacity duration-1000 ${fadeMain ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl font-extrabold text-rose-900">¡{config.tios}!</h1>
            <p className="font-serif text-xl text-rose-600 italic">¡Feliz Aniversario!</p>
          </div>

          <div className="bg-white rounded-[24px] p-8 shadow-xl border border-rose-100 text-center mb-8">
            <span className="font-serif text-5xl font-extrabold text-rose-900">{yearsCount}</span>
            <p className="text-rose-600 font-semibold mt-1">Años caminando de la mano</p>
            <p className="text-xs text-gray-400 mt-2">Calculado desde el {getFormattedDate()}</p>
          </div>

          <div className="bg-rose-900 text-white rounded-[24px] p-8 shadow-2xl mb-8">
            <div className="text-rose-100 leading-relaxed text-sm whitespace-pre-line text-justify font-light">
              {config.carta}
            </div>
            <div className="mt-8 pt-6 border-t border-rose-800 text-right">
              <p className="font-serif text-lg text-rose-100 italic font-semibold">{config.firma}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 px-4 justify-items-center mb-10">
            {[1, 2, 3].map((num) => (
              <div key={num} className="bg-white p-3 shadow-lg max-w-[240px] w-full">
                <img src={config[`img${num}`]} className="w-full aspect-square object-cover" alt="Recuerdo" />
              </div>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}
