import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  // CONFIGURACIONES PREDETERMINADAS (Imágenes fijadas aquí)
  const [config, setConfig] = useState({
    tios: "Queridos Tíos",
    boda: "1996-05-15",
    firma: "Su sobrino(a) que los quiere",
    carta: `Queridos tíos, hoy celebramos no solo el paso del tiempo, sino la hermosa historia que han construido juntos.\n\nA pesar de la distancia física que nos separa hoy, sus risas, consejos y el inmenso ejemplo de unión que nos dan cruzan cualquier frontera. Son el claro ejemplo de que el amor verdadero todo lo puede, se fortalece con los años y florece en cada etapa.\n\n¡Que sigan sumando infinitos momentos felices, salud y complicidad! Les mando un abrazo gigante y apretado.`,
    // URLs de tus imágenes desde ImgBB
    img1: "https://i.ibb.co/9k8rbL3d/IMG-20260704-WA0026.jpg",
    img2: "https://i.ibb.co/FLJtQ35W/IMG-20260704-WA0027.jpg",
    img3: "https://i.ibb.co/cXcq385F/IMG-20260704-WA0031.jpg",
    locked: false
  });

  // ... [EL RESTO DE TU CÓDIGO SE MANTIENE IGUAL] ...

  // MODIFICACIÓN EN useEffect: Ya no necesitamos buscar en localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let updatedConfig = { ...config };

    if (params.has('t')) updatedConfig.tios = decodeURIComponent(params.get('t'));
    if (params.has('b')) updatedConfig.boda = decodeURIComponent(params.get('b'));
    if (params.has('f')) updatedConfig.firma = decodeURIComponent(params.get('f'));
    if (params.has('c')) updatedConfig.carta = decodeURIComponent(params.get('c'));
    if (params.has('l') && params.get('l') === "1") updatedConfig.locked = true;

    // Eliminamos la parte de localStorage para que las imágenes fijas sean las que siempre se muestren
    setConfig(updatedConfig);
    setInputNames(updatedConfig.tios);
    setInputWeddingDate(updatedConfig.boda);
    setInputSignature(updatedConfig.firma);
    setInputLetter(updatedConfig.carta);
  }, []);

  // ... [EL RESTO DE TU CÓDIGO] ...

  // MODIFICACIÓN EN generateCustomLink: Ya no necesitamos guardar imágenes en localStorage
  const generateCustomLink = () => {
    const t = inputNames.trim() || "Tíos";
    const b = inputWeddingDate || "1996-05-15";
    const f = inputSignature.trim() || "Su sobrino(a)";
    const c = inputLetter.trim() || "";

    const updated = { ...config, tios: t, boda: b, firma: f, carta: c, locked: true };
    setConfig(updated);

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
    });

    setShowModal(false);
  };

  // ... [RESTO DEL CÓDIGO] ...
}
