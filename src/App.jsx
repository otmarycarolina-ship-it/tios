import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  // CONFIGURACIONES PREDETERMINADAS CON TUS DATOS
  const [config, setConfig] = useState({
    tios: "Jacinto y Yudhit",
    boda: "1996-07-04",
    firma: "Su sobrina, Otmary",
    carta: `Queridos tíos:\nHoy puedo ver no solo el paso del tiempo, sino la hermosa historia que han construido juntos con la ayuda de nuestro amoroso Padre Celestial.\n\nA pesar de la distancia que hoy nos separa, sus risas, sus consejos, sus muestras de amabilidad y cariño sincero, y su buen ejemplo de unión que nos dan, cruzan cualquier frontera. Son el claro ejemplo de que el amor verdadero, aunque no es perfecto, todo lo puede: se fortalece con los años y florece en cada etapa.\n\n¡Espero que la pasen bonito en este día tan especial, tíos amados!\n\nLos quiero mucho 🩷, un abrazo enorme desde su querido Encontrados.\n\nPosdata: Es muy probable que lean esto el 5 de julio, ya que me tardé un poquito haciéndolo. 🤭`,
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

  // Inputs temporales para el modal
  const [inputNames, setInputNames] = useState(config.tios);
  const [inputWeddingDate, setInputWeddingDate] = useState(config.boda);
  const [inputSignature, setInputSignature] = useState(config.firma);
  const [inputLetter, setInputLetter] = useState(config.carta);

  // Toast state
  const [toast, setToast] = useState({ show: false, message: "", icon: "" });

  const canvasRef = useRef(null);
  const addHeartsRef = useRef(null);

  // Cargar parámetros de la URL e imágenes de localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let updatedConfig = { ...config };

    if (params.has('t')) updatedConfig.tios = decodeURIComponent(params.get('t'));
    if (params.has('b')) updatedConfig.boda = decodeURIComponent(params.get('b'));
    if (params.has('f')) updatedConfig.firma = decodeURIComponent(params.get('f'));
    if (params.has('c')) updatedConfig.carta = decodeURIComponent(params.get('c'));
    if (params.has('l') && params.get('l') === "1") updatedConfig.locked = true;

    // Solo cargamos fotos de localStorage si no existen en la URL
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

  // ... (El resto de la lógica (Canvas, Animaciones, Eventos, UI) es idéntica a tu original)
  // [He omitido el bloque completo para brevedad, pero usa exactamente el que enviaste]
  // Asegúrate de pegar esto sobre el componente completo.

  // (El resto del código sigue igual hasta el return)
  // ...
  
  return (
    // (Retorna el JSX tal cual lo tenías en tu código original)
    <div className="relative min-h-screen bg-[#fdf6f6] font-sans flex flex-col items-center justify-start pb-12 overflow-x-hidden">
       {/* ... El resto del JSX original ... */}
    </div>
  );
}
