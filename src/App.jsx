import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  // CONFIGURACIONES PREDETERMINADAS
  const [config, setConfig] = useState({
    tios: "Queridos Tíos",
    boda: "1996-05-15",
    firma: "Su sobrino(a) que los quiere",
    carta: `Queridos tíos, hoy celebramos no solo el paso del tiempo, sino la hermosa historia que han construido juntos.\n\nA pesar de la distancia física que nos separa hoy, sus risas, consejos y el inmenso ejemplo de unión que nos dan cruzan cualquier frontera. Son el claro ejemplo de que el amor verdadero todo lo puede, se fortalece con los años y florece en cada etapa.\n\n¡Que sigan sumando infinitos momentos felices, salud y complicidad! Les mando un abrazo gigante y apretado.`,
    img1: "",
    img2: "",
    img3: "",
    locked: false
  });

  const [isOpen, setIsOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showMain, setShowMain] = useState(false);
  const [fadeMain, setFadeMain] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [yearsCount, setYearsCount] = useState("--");

  // Inputs temporales para el modal
  const [inputNames, setInputNames] = useState("");
  const [inputWeddingDate, setInputWeddingDate] = useState("");
  const [inputSignature, setInputSignature] = useState("");
  const [inputLetter, setInputLetter] = useState("");

  // Toast state
  const [toast, setToast] = useState({ show: false, message: "", icon: "" });

  const canvasRef = useRef(null);

  // Cargar parámetros de la URL e imágenes de localStorage
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

  // Calcular el contador de años
  useEffect(() => {
    const weddingDate = new Date(config.boda + 'T00:00:00');
    const now = new Date();
    let diffMs = now - weddingDate;

    if (diffMs < 0) {
      setYearsCount("0");
      return;
    }

    let years = now.getFullYear() - weddingDate.getFullYear();
    let months = now.getMonth() - weddingDate.getMonth();
    let days = now.getDate() - weddingDate.getDate();

    if (days < 0) months--;
    if (months < 0) years--;

    setYearsCount(years);
  }, [config.boda]);

  // Canvas Animación de Corazones
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
        this.color = `rgba(${220 + Math.random() * 35}, ${50 + Math.random() * 50}, ${80 + Math.random() * 50}, `;
        this.isSparkle = isSparkle;
        if (isSparkle) {
          this.speedY = -(Math.random() * 3 + 1.5);
          this.speedX = Math.random() * 4 - 2;
          this.size = Math.random() * 15 + 10;
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
        if (this.isSparkle) {
          this.opacity -= 0.015;
        } else {
          this.opacity -= 0.001;
        }
      }
    }

    const handleInteraction = (e) => {
      let x = e.clientX || (e.touches && e.touches[0].clientX);
      let y = e.clientY || (e.touches && e.touches[0].clientY);
      if (x && y) {
        for (let i = 0; i < 8; i++) {
          hearts.push(new Heart(x, y, true));
        }
      }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    for (let i = 0; i < 20; i++) {
      hearts.push(new Heart(Math.random() * canvas.width, Math.random() * canvas.height));
    }

    let animationFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (Math.random() < 0.04 && hearts.length < 80) {
        hearts.push(new Heart());
      }
      for (let i = hearts.length - 1; i >= 0; i--) {
        hearts[i].update();
        hearts[i].draw();
        if (hearts[i].y < -20 || hearts[i].opacity <= 0 || hearts[i].x < -20 || hearts[i].x > canvas.width + 20) {
          hearts.splice(i, 1);
        }
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
    setTimeout(() => {
      setShowIntro(false);
      setShowMain(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        setFadeMain(true);
      }, 50);
    }, 2200);
  };

  const showToastMsg = (msg, icon) => {
    setToast({ show: true, message: msg, icon: icon });
    setTimeout(() => {
      setToast({ show: false, message: "", icon: "" });
    }, 4000);
  };

  const previewUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setConfig(prev => ({ ...prev, [`img${index}`]: uploadEvent.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCustomLink = () => {
    const t = inputNames.trim() || "Tíos";
    const b = inputWeddingDate || "1996-05-15";
    const f = inputSignature.trim() || "Su sobrino(a)";
    const c = inputLetter.trim() || "";

    const updated = { ...config, tios: t, boda: b, firma: f, carta: c, locked: true };
    setConfig(updated);

    for (let i = 1; i <= 3; i++) {
      if (updated[`img${i}`]) {
        localStorage.setItem(`aniv_img_${i}`, updated[`img${i}`]);
      }
    }

    const baseUrl = window.location.origin + window.location.pathname;
    const searchParams = new URLSearchParams();
    searchParams.set('t', t);
    searchParams.set('b', b);
    searchParams.set('f', f);
    searchParams.set('c', c);
    searchParams.set('l', '1');

    const finalUrl = `${baseUrl}?${searchParams.toString()}`;

    navigator.clipboard.writeText(finalUrl).then(() => {
      showToastMsg("¡Regalo guardado! Enlace de WhatsApp copiado.", "fa-lock text-rose-400");
    }).catch(() => {
      showToastMsg("Guardado. Copia la URL del navegador.", "fa-exclamation-triangle text-yellow-400");
    });

    setShowModal(false);
  };

  const getFormattedDate = () => {
    const dateObj = new Date(config.boda + 'T00:00:00');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="relative min-h-screen bg-[#fdf6f6] font-sans flex flex-col items-center justify-start pb-12 overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />

      {/* TOAST NOTIFICACIÓN */}
      <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center space-x-2 transition-all duration-300 ${toast.show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <span><i className={`fas ${toast.icon || 'fa-check-circle text-green-400'}`}></i></span>
        <span className="text-sm font-medium">{toast.message}</span>
      </div>

      {/* PANTALLA DE BIENVENIDA (SOBRE VIRTUAL) */}
      {showIntro && (
        <div className={`fixed inset-0 bg-rose-50 z-40 flex flex-col items-center justify-center p-4 transition-all duration-1000 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="text-center mb-8 max-w-sm px-4">
            <span className="text-xs font-semibold tracking-widest text-rose-500 uppercase">Un mensaje especial de aniversario</span>
            <h1 className="font-serif text-3xl md:text-4xl text-rose-900 mt-2 font-bold leading-tight">Para mis queridos {config.tios}</h1>
            <p className="text-gray-600 mt-3 text-sm">Preparen sus corazones, toquen el sobre para abrir este regalo digital hecho con mucho amor desde la distancia.</p>
          </div>

          {/* El Sobre Virtual */}
          <div className="w-[300px] h-[200px] cursor-pointer relative" onClick={openEnvelope} style={{ perspective: '1000px' }}>
            <div className={`w-full h-full bg-rose-100 rounded-b-lg shadow-xl border-b-4 border-rose-300 relative transition-transform duration-1000`} style={{ transformStyle: 'preserve-3d', transform: isOpen ? 'rotateX(-15deg) translateY(150px)' : 'none' }}>
              {/* Solapa superior */}
              <div 
                className="absolute top-0 left-0 w-0 h-0 border-l-[150px] border-l-transparent border-r-[150px] border-r-transparent border-t-[100px] border-t-rose-500 origin-top transition-all duration-500"
                style={{ 
                  transform: isOpen ? 'rotateX(180deg)' : 'none', 
                  zIndex: isOpen ? 1 : 4,
                  transitionDelay: isOpen ? '0.4s' : '0s'
                }}
              />
              
              {/* Cuerpo del sobre frontal izquierdo/derecho */}
              <div className="absolute inset-0 bg-rose-200 rounded-b-lg opacity-80 z-30" style={{ clipPath: 'polygon(0 0, 150px 100px, 300px 0, 300px 200px, 0 200px)' }}></div>
              
              {/* Carta dentro del sobre */}
              <div 
                className="absolute bottom-0 left-[10px] right-[10px] bg-white rounded-8px border border-rose-100 p-4 flex flex-col justify-between text-center transition-all duration-[800ms]"
                style={{ 
                  zIndex: isOpen ? 5 : 2, 
                  height: isOpen ? '240px' : '180px',
                  transform: isOpen ? 'translateY(-130px)' : 'none',
                  transitionDelay: isOpen ? '0.8s' : '0s',
                  boxShadow: '0 -5px 15px rgba(0,0,0,0.05)'
                }}
              >
                <div className="text-rose-600 my-auto">
                  <i className="fas fa-heart text-3xl animate-pulse"></i>
                  <p className="font-serif font-bold text-lg text-rose-900 mt-2">¡Feliz Aniversario!</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Hacer clic para abrir su sorpresa</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-rose-400 text-xs mt-12 animate-bounce flex items-center gap-1">
            <i className="fas fa-hand-pointer"></i> Presiona el sobre para comenzar
          </p>
        </div>
      )}

      {/* BOTÓN DE AJUSTES */}
      {!config.locked && (
        <button onClick={() => setShowModal(true)} className="fixed top-4 left-4 z-30 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg border border-rose-200 flex items-center justify-center cursor-pointer text-gray-700 hover:text-rose-600 transition-colors">
          <i className="fas fa-cog text-lg"></i>
        </button>
      )}

      {/* CONTENIDO PRINCIPAL */}
      {showMain && (
        <main className={`w-full max-w-lg px-4 pt-16 mt-4 z-10 transition-opacity duration-1000 ${fadeMain ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-center mb-8 relative">
            <div className="inline-block bg-rose-100 text-rose-600 px-4 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-3">
              <i className="fas fa-sparkles mr-1"></i> Amor a la Distancia
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-extrabold text-rose-900 leading-tight">¡{config.tios}!</h1>
            <p className="font-serif text-xl text-rose-600 mt-1 italic font-medium">¡Feliz Aniversario!</p>
            
            <div className="flex justify-center my-6 space-x-2">
              <span className="h-1 w-8 bg-rose-200 rounded-full"></span>
              <i className="fas fa-heart text-rose-400 text-sm"></i>
              <span class="h-1 w-8 bg-rose-200 rounded-full"></span>
            </div>
          </div>

          {/* CONTADOR DE AMOR */}
          <div className="bg-white rounded-[24px] p-8 shadow-xl border border-rose-100 text-center mb-8 transform transition-transform hover:scale-[1.01]">
            <h3 className="text-xs uppercase tracking-wider text-rose-500 font-bold mb-3">Su amor en el tiempo</h3>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="bg-rose-50 rounded-full w-32 h-32 flex flex-col items-center justify-center border-4 border-rose-100 shadow-inner">
                <span className="font-serif text-5xl font-extrabold text-rose-900 leading-none">{yearsCount}</span>
                <span className="text-xs text-rose-600 uppercase font-semibold mt-1">Años</span>
              </div>
              <p className="text-rose-800 font-medium text-sm mt-4 italic">Caminando de la mano</p>
            </div>
            <p className="text-xs text-gray-400 italic mt-2 border-t border-rose-50 pt-3">Calculado desde su boda el {getFormattedDate()}</p>
          </div>

          {/* CARTA ROMÁNTICA */}
          <div className="bg-rose-900 text-white rounded-[24px] p-8 shadow-2xl relative overflow-hidden mb-8">
            <div className="absolute -right-8 -bottom-8 text-rose-800 text-9xl opacity-20 pointer-events-none">
              <i className="fas fa-quote-right"></i>
            </div>
            <div className="absolute left-6 top-6 text-rose-400/30 text-3xl">
              <i className="fas fa-envelope-open-text"></i>
            </div>
            
            <div className="relative z-10">
              <h4 className="font-serif text-xl text-rose-200 mb-6 italic text-center">Una carta especial para ustedes</h4>
              <div className="text-rose-100 leading-relaxed text-sm space-y-4 whitespace-pre-line text-justify font-light">
                {config.carta}
              </div>
              <div className="mt-8 pt-6 border-t border-rose-800 text-right">
                <p className="text-xs text-rose-300 uppercase tracking-widest font-bold">Con todo mi cariño,</p>
                <p className="font-serif text-lg text-rose-100 italic mt-1 font-semibold">{config.firma}</p>
              </div>
            </div>
          </div>

          {/* COLLAGE DE FOTOS */}
          <div className="mb-10">
            <h3 className="font-serif text-2xl font-bold text-rose-900 text-center mb-1">Nuestros Recuerdos</h3>
            <p className="text-center text-xs text-gray-500 mb-8 italic">Momentom felices congelados en el tiempo</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 justify-items-center">
              {[1, 2, 3].map((num) => (
                <div 
                  key={num} 
                  className={`bg-white p-3 pb-8 shadow-lg transition-transform duration-300 hover:scale-105 hover:rotate-0 max-w-[240px] w-full ${num === 1 ? '-rotate-3' : num === 2 ? 'rotate-3' : '-rotate-1 md:col-span-2'}`}
                >
                  <div className="relative bg-rose-50 aspect-square rounded-md overflow-hidden border border-gray-100 flex items-center justify-center">
                    {config[`img${num}`] ? (
                      <img src={config[`img${num}`]} className="w-full h-full object-cover" alt={`Recuerdo ${num}`} />
                    ) : (
                      <div className="text-center p-4">
                        <i className={`fas ${num === 1 ? 'fa-heart animate-pulse' : num === 2 ? 'fa-camera' : 'fa-sparkles'} text-rose-300 text-3xl`}></i>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MENSAJE DE DISTANCIA */}
          <div className="bg-rose-50 border border-rose-100 rounded-[24px] p-6 text-center mb-10">
            <div className="text-rose-500 text-3xl mb-3">
              <i className="fas fa-globe-americas animate-spin" style={{ animationDuration: '20s' }}></i>
            </div>
            <p className="font-serif text-base text-rose-900 font-semibold mb-1">No hay distancia para el cariño</p>
            <p className="text-gray-600 text-xs leading-relaxed">Aunque hoy nos separen kilómetros, este abrazo virtual viaja a la velocidad de la luz para llegar hasta su hogar.</p>
          </div>
        </main>
      )}

      {/* MODAL DE PERSONALIZACIÓN */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
          <div className="bg-white w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-rose-950 text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="font-serif text-xl font-bold">Personaliza tu Regalo</h3>
                <p className="text-xs text-rose-200 mt-1">Configura nombres, carta, fecha y fotos</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-white hover:text-rose-300 text-lg">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nombres de los Tíos</label>
                <input type="text" value={inputNames} onChange={(e) => setInputNames(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm" placeholder="Ej: Tíos María y Carlos" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Fecha de Boda</label>
                <input type="date" value={inputWeddingDate} onChange={(e) => setInputWeddingDate(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Tu Firma</label>
                <input type="text" value={inputSignature} onChange={(e) => setInputSignature(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm" placeholder="Ej: Tu sobrino Andrés" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Mensaje de la Carta</label>
                <textarea rows="4" value={inputLetter} onChange={(e) => setInputLetter(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm" placeholder="Escribe aquí tu dedicatoria especial..."></textarea>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 class="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Agregar Fotos para el Collage</h4>
                <div className="space-y-3">
                  {[1, 2, 3].map((num) => (
                    <div key={num}>
                      <label className="block text-[11px] text-gray-500 mb-0.5">Foto {num}</label>
                      <input type="file" accept="image/*" onChange={(e) => previewUpload(e, num)} className="text-xs text-gray-600 block w-full file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col gap-2">
              <button onClick={generateCustomLink} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-2xl shadow-lg flex items-center justify-center space-x-2">
                <i className="fas fa-save"></i>
                <span>Guardar</span>
              </button>
              <button onClick={() => setShowModal(false)} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 rounded-2xl text-xs">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
