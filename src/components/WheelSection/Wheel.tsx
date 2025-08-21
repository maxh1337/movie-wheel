"use client";

import { motion, useAnimation } from "framer-motion";
import { useState } from "react";
import { useFilmZustand } from "../../store/useFilmZustand.store";

export default function Wheel() {
  const { films, mode, setEliminated } = useFilmZustand();
  const controls = useAnimation();
  const [selectedFilm, setSelectedFilm] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [eliminatedFilms, setEliminatedFilms] = useState<number[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  const activeFilms = films.filter((f) => !f.eliminated);

  if (activeFilms.length === 0) {
    return (
      <p className="text-center mt-5 w-full">Добавьте фильмы для розыгрыша</p>
    );
  }

  const handleSpin = async () => {
    setSelectedFilm(null);
    setShowPopup(false);

    const extraRotations = 1080 + Math.floor(Math.random() * 360);
    const newRotation = rotation + extraRotations;
    setRotation(newRotation);

    const audio = new Audio("/sounds/gf.m4a");
    audio.volume = 0.3;
    audio.play();

    await controls.start({
      rotate: newRotation,
      transition: { duration: 7, ease: "easeInOut" },
    });

    const normalized = ((newRotation % 360) + 360) % 360;
    const degreesPerFilm = 360 / activeFilms.length;
    const winnerIndex =
      activeFilms.length - 1 - Math.floor(normalized / degreesPerFilm);
    const film = activeFilms[winnerIndex];

    if (mode === "elimination") {
      if (activeFilms.length > 1) {
        // Отмечаем как выбыл
        setEliminated(film.position);
        setEliminatedFilms((prev) => [...prev, film.position]);

        // Проверяем, остался ли только один фильм
        const remainingFilms = activeFilms.filter(
          (f) => f.position !== film.position
        );
        if (remainingFilms.length === 1) {
          setSelectedFilm(remainingFilms[0].title);
          setShowPopup(true);
        }

        return; // Не показываем попап сразу для выбытого фильма
      } else {
        // Если крутим при последнем фильме, просто показываем его
        setSelectedFilm(film.title);
        setShowPopup(true);
      }
    } else {
      // Обычный режим — показываем выбранный фильм
      setSelectedFilm(film.title);
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => setShowPopup(false);

  const colors = [
    "#FF6B6B",
    "#FFD93D",
    "#6BCB77",
    "#4D96FF",
    "#C77DFF",
    "#FF922B",
    "#12CBC4",
    "#F368E0",
  ];

  const gradient = activeFilms
    .map((f, i) => {
      const start = (i / activeFilms.length) * 100;
      const end = ((i + 1) / activeFilms.length) * 100;
      return `${colors[i % colors.length]} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <div className="flex flex-col items-center relative w-[70%]">
      <div
        className="absolute -top-3 z-20 w-0 h-0 
          border-l-[15px] border-r-[15px] border-t-[25px]
          border-l-transparent border-r-transparent border-t-black"
      />

      <motion.div
        animate={controls}
        className="relative rounded-full border-4 border-black w-[480px] h-[480px] flex items-center justify-center"
        style={{
          background: `conic-gradient(${gradient})`,
        }}
      >
        <svg
          className="absolute top-0 left-0 w-full h-full z-20"
          viewBox="0 0 200 200"
        >
          {activeFilms.map((film, i) => {
            const sliceAngle = 360 / activeFilms.length;
            const angle = sliceAngle * i + sliceAngle / 2 - 90;
            const radius = 60;
            const x = 100 + radius * Math.cos((Math.PI * angle) / 180);
            const y = 100 + radius * Math.sin((Math.PI * angle) / 180);
            const rotation = angle + 90;
            const isEliminated = eliminatedFilms.includes(film.position);

            return (
              <motion.text
                key={film.position}
                x={x}
                y={y}
                fill="white"
                fontSize="8"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${rotation}, ${x}, ${y})`}
                initial={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="font-museo"
              >
                {film.title}
              </motion.text>
            );
          })}
        </svg>
      </motion.div>

      <button
        onClick={handleSpin}
        className="mt-16 px-5 py-2 rounded-xl bg-black text-white border border-black hover:bg-white hover:text-black transition-colors font-radio cursor-pointer"
      >
        Крутить колесо
      </button>

      {showPopup && selectedFilm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm"
            onClick={handleClosePopup}
          />
          <div className="relative bg-white p-6 rounded-xl shadow-lg text-center z-10">
            <p className="text-xl font-bold mb-4">
              {mode === "elimination" && activeFilms.length === 1
                ? "🎬 Победил фильм:"
                : mode === "elimination"
                ? "Выбыл фильм:"
                : "🎬 Победил фильм:"}
            </p>
            <p className="text-2xl font-museo font-bold">{selectedFilm}</p>
            <button
              className="mt-6 px-4 py-2 rounded bg-black text-white hover:bg-white hover:text-black border border-black transition-colors cursor-pointer"
              onClick={handleClosePopup}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
