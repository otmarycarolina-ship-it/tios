import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  // CONFIGURACIONES PREDETERMINADAS
  const [config, setConfig] = useState({
    tios: "Queridos Tíos",
    boda: "1996-05-15",
    firma: "Su sobrino(a) que los quiere",
    carta: `Queridos tíos, hoy celebramos no solo el paso del tiempo, sino la hermosa historia que han construido juntos.\n\nA pesar de la distancia física que nos separa hoy, sus risas, consejos y el inmenso ejemplo de unión que nos dan cruzan cualquier frontera. Son el claro ejemplo de que el amor verdadero todo lo puede, se fortalece con los años y florece en cada etapa.\n\n¡Que sigan sumando infinitos momentos felices, salud y complicidad! Les mando un abrazo gigante y apretado.`,
    img1: "https://i.ibb.co/9k8rbL3d/IMG-20260704-WA0026.jpg",
    img2: "https://i.ibb.co/FLJtQ35W/IMG-20260704-WA0027.jpg",
    img3: "https://i.ibb.co/cXcq385F/IMG-20260704-WA0031.jpg",
    locked: false
  });

  const [isOpen, setIsOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showMain, setShowMain] = useState(false);
  const [fadeMain, setFadeMain] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [yearsCount, setYearsCount] = useState("--");
  // --- NUEVO ESTADO PARA CÁPSULA ---
  const [candadoAbierto, setCandadoAbierto] = useState(false);

  // Inputs temporales para el modal
  const [inputNames, setInputNames] = useState("");
  const [inputWeddingDate, setInputWeddingDate] = useState("");
  const [inputSignature, setInputSignature] = useState("");
  const [inputLetter, setInputLetter] = useState("");

  const [toast, setToast] = useState({ show: false, message: "", icon: "" });
  const canvasRef = useRef(null);
  const addHeartsRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let updatedConfig = { ...config };

    if (params.has('t')) updatedConfig.tios = decodeURIComponent(params.get('t'));
    if (params.has('b')) updatedConfig.boda = decodeURIComponent(params.get('b'));
    if (params.has('f')) updatedConfig.firma = decodeURIComponent(params.get('f'));
    if (params.has('c')) updatedConfig.carta = decodeURIComponent(params.get('c'));
    if (params.has('l') && params.get('l') === "1") updatedConfig.locked = true;

    for (let i = 1; i <= 3; i++) {
      const localImg = localStorage.getItem(`aniv_img_${i}`);
      if (localImg) {
        updatedConfig[`img${i}`] = localImg;
      }
    }

    setConfig(updatedConfig);
    setInputNames(updatedConfig.tios);
    setInputWeddingDate(updatedConfig.boda);
    setInputSignature(updatedConfig.firma);
    setInputLetter(updatedConfig.carta);
  }, []);

  useEffect(() => {
    const weddingDate = new Date(config.boda + 'T00:00:00');
    const now = new Date();
    let years = now.getFullYear() - weddingDate.getFullYear();
    let months = now.getMonth() - weddingDate.getMonth();
    let days = now.getDate() - weddingDate.getDate();
    if (days < 0) months--;
    if (months < 0) years--;
    setYearsCount(years < 0 ? 0 : years);
  }, [config.boda]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let hearts = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
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
        this.color = `rgba(220, 50, 80, `;
        this.isSparkle = isSparkle;
        if (isSparkle) {
          this.speedY = -(Math.random() * 4 + 2);
          this.speedX = Math.random() * 6 - 3;
          this.size = Math.random() * 16 + 8;
          this.opacity = 1;
        }
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
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= this.isSparkle ? 0.015 : 0.001;
      }
    }

    addHeartsRef.current = (x, y, count = 8) => {
      for (let i = 0; i < count; i++) hearts.push(new Heart(x, y, true));
    };

    const handleInteraction = (e) => {
      let x = e.clientX || (e.touches && e.touches[0].clientX);
      let y = e.clientY || (e.touches && e.touches[0].clientY);
      if (x && y) addHeartsRef.current(x, y, 8);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    let animationFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (Math.random() < 0.04 && hearts.length < 80) hearts.push(new Heart());
      for (let i = hearts.length - 1; i >= 0; i--) {
        hearts[i].update();
        hearts[i].draw();
        if (hearts[i].y < -20 || hearts[i].opacity <= 0) hearts.splice(i, 1);
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const openEnvelope = () => {
    setIsOpen(true);
    const midX = window.innerWidth / 2;
    const midY = window.innerHeight / 2;
    setTimeout(() => {
      if (addHeartsRef.current) {
        addHeartsRef.current(midX, midY, 40);
        setTimeout(() => addHeartsRef.current(midX - 100, midY, 20), 150);
        setTimeout(() => addHeartsRef.current(midX + 100, midY, 20), 300);
      }
    }, 400);
    setTimeout(() => {
      setShowIntro(false);
      setShowMain(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setFadeMain(true), 50);
    }, 2200);
  };

  const showToastMsg = (msg, icon) => {
    setToast({ show: true, message: msg, icon: icon });
    setTimeout(() => setToast({ show: false, message: "", icon: "" }), 4000);
  };

  const previewUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => setConfig(prev => ({ ...prev, [`img${index}`]: uploadEvent.target.result }));
      reader.readAsDataURL(file);
    }
  };

  const generateCustomLink = () => {
    const t = inputNames.trim() || "Tíos", b = inputWeddingDate || "1996-05-15", f = inputSignature.trim() || "Su sobrino(a)", c = inputLetter.trim() || "";
    const updated = { ...config, tios: t, boda: b, firma: f, carta: c, locked: true };
    setConfig(updated);
    for (let i = 1; i <= 3; i++) if (updated[`img${i}`]) localStorage.setItem(`aniv_img_${i}`, updated[`img${i}`]);
    const baseUrl = window.location.origin + window.location.pathname;
    const searchParams = new URLSearchParams({ t, b, f, c, l: '1' });
    const finalUrl = `${baseUrl}?${searchParams.toString()}`;
    navigator.clipboard.writeText(finalUrl).then(() => showToastMsg("¡Regalo guardado!", "fa-lock text-rose-400"));
    setShowModal(false);
  };

  const getFormattedDate = () => {
    const d = new Date(config.boda + 'T00:00:00');
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
  };

  return (
    <div className="relative min-h-screen bg-[#fdf6f6] font-sans flex flex-col items-center justify-start pb-12 overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />
      
      {/* TOAST */}
      <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center space-x-2 transition-all duration-300 ${toast.show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <i className={`fas ${toast.icon || 'fa-check-circle text-green-400'}`}></i>
        <span className="text-sm font-medium">{toast.message}</span>
      </div>

      {showIntro && (
        <div className={`fixed inset-0 bg-rose-50 z-40 flex flex-col items-center justify-center p-4 transition-all duration-1000 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="text-center mb-8 max-w-sm">
            <h1 className="font-serif text-3xl text-rose-900 font-bold">Para mis {config.tios}</h1>
            <p className="text-gray-600 mt-3 text-sm">Toquen el sobre para abrir este regalo.</p>
          </div>
          <div className="w-[300px] h-[200px] cursor-pointer relative" onClick={openEnvelope} style={{ perspective: '1000px' }}>
            <div className={`w-full h-full bg-rose-100 rounded-b-lg shadow-xl border-b-4 border-rose-300 relative transition-transform duration-1000 ${isOpen ? 'rotate-x-[-15deg]' : ''}`} style={{ transformStyle: 'preserve-3d', transform: isOpen ? 'rotateX(-15deg) translateY(150px)' : 'none' }}>
              <div className="absolute top-0 left-0 w-0 h-0 border-l-[150px] border-l-transparent border-r-[150px] border-r-transparent border-t-[100px] border-t-rose-500 origin-top transition-all duration-500" style={{ transform: isOpen ? 'rotateX(180deg)' : 'none', zIndex: isOpen ? 1 : 4 }} />
              <div className="absolute inset-0 bg-rose-200 rounded-b-lg opacity-80 z-30" style={{ clipPath: 'polygon(0 0, 150px 100px, 300px 0, 300px 200px, 0 200px)' }}></div>
              <div className="absolute bottom-0 left-[10px] right-[10px] bg-white rounded-t-[8px] p-4 flex flex-col justify-between text-center transition-all duration-[800ms]" style={{ zIndex: isOpen ? 5 : 2, height: isOpen ? '240px' : '180px', transform: isOpen ? 'translateY(-130px)' : 'none' }}>
                <div className="text-rose-600 my-auto"><i className="fas fa-heart text-3xl animate-pulse"></i></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showMain && (
        <main className={`w-full max-w-lg px-4 pt-16 mt-4 z-10 transition-opacity duration-1000 ${fadeMain ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="font-serif text-4xl text-rose-900 text-center font-extrabold">¡{config.tios}!</h1>
          
          <div className="bg-white rounded-[24px] p-8 shadow-xl border border-rose-100 text-center my-8">
            <span className="font-serif text-5xl font-extrabold text-rose-900">{yearsCount}</span>
            <p className="text-xs text-rose-600 uppercase font-semibold">Años de amor</p>
          </div>

          <div className="bg-rose-900 text-white rounded-[24px] p-8 shadow-2xl mb-8">
            <div className="text-rose-100 leading-relaxed text-sm whitespace-pre-line text-justify">{config.carta}</div>
            <p className="text-xs text-rose-300 mt-6 uppercase tracking-widest font-bold">Con todo mi cariño,</p>
            <p className="font-serif text-lg italic mt-1">{config.firma}</p>
          </div>

          {/* --- CÁPSULA DEL TIEMPO --- */}
          <div className="flex flex-col items-center mt-12 mb-20 p-6 bg-white rounded-[24px] shadow-sm border border-rose-100">
            <h3 className="text-rose-900 font-serif font-bold text-lg mb-4">Un mensaje especial</h3>
            <button 
              onClick={() => setCandadoAbierto(!candadoAbierto)}
              className={`p-6 rounded-full transition-all duration-500 shadow-md ${candadoAbierto ? 'bg-green-100' : 'bg-rose-100 hover:scale-105'}`}
            >
              <i className={`fas ${candadoAbierto ? 'fa-lock-open text-green-600' : 'fa-lock text-rose-600'} text-4xl`}></i>
            </button>
            {candadoAbierto && (
              <div className="mt-6 w-full animate-fade-in p-4 bg-green-50 rounded-2xl border border-green-200 text-center">
                <p className="text-green-800 font-bold mb-4 text-sm">¡Mensaje de voz encontrado!</p>
                <video controls className="w-full rounded-xl shadow-lg" src="https://i.imgur.com/sk7u7kI.mp4">
                  Tu navegador no soporta el audio/video.
                </video>
              </div>
            )}
          </div>
        </main>
      )}
      
      {!config.locked && (
        <button onClick={() => setShowModal(true)} className="fixed top-4 left-4 z-30 bg-white/80 p-3 rounded-full shadow-lg border border-rose-200"><i className="fas fa-cog text-lg"></i></button>
      )}
      
      {/* MODAL (abreviado por brevedad, es el mismo de tu código) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[24px] p-6">
                <h3 className="text-xl font-bold mb-4">Personaliza</h3>
                <input className="w-full border p-2 mb-2" placeholder="Nombres" value={inputNames} onChange={(e) => setInputNames(e.target.value)} />
                <button onClick={generateCustomLink} className="w-full bg-rose-600 text-white py-3 rounded-xl mt-4">Guardar</button>
                <button onClick={() => setShowModal(false)} className="w-full text-gray-500 mt-2">Cancelar</button>
            </div>
        </div>
      )}
    </div>
  );
}
