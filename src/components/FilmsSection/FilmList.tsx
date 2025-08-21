"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Film, useFilmZustand } from "../../store/useFilmZustand.store";
import FilmItem from "./FilmItem";

export default function FilmList() {
  const { films, addFilm, mode, setMode } = useFilmZustand();
  const [title, setTitle] = useState("");

  const handleAddFilm = () => {
    if (!title.trim()) return;
    addFilm(title.trim());
    const audio = new Audio("/sounds/rojer-that.mp3");
    audio.volume = 0.3;
    audio.play();
    setTitle("");
  };

  return (
    <div className="flex-shrink-0 w-[34%]">
      {/* 🔥 переключатель режима */}
      <h3 className="mb-2">Режимы:</h3>
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => {
            const audio = new Audio("/sounds/okei.mp3");
            audio.play();
            setMode("normal");
          }}
          className={twMerge(
            "px-3 py-2 rounded-xl border cursor-pointer",
            mode === "normal"
              ? "bg-black text-white border-black"
              : "bg-white text-black border-black hover:bg-black hover:text-white transition-colors"
          )}
        >
          Обычный
        </button>
        <button
          onClick={() => {
            const audio = new Audio("/sounds/okei.mp3");
            audio.play();
            setMode("elimination");
          }}
          className={twMerge(
            "px-3 py-2 rounded-xl border cursor-pointer",
            mode === "elimination"
              ? "bg-black text-white border-black"
              : "bg-white text-black border-black hover:bg-black hover:text-white transition-colors"
          )}
        >
          На выбывание
        </button>
      </div>

      <div className="w-full">
        <h3 className="mb-2">Добавьте фильм:</h3>
        <div className="flex">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название фильма"
            className={twMerge(
              "px-3 py-3 border-black border rounded-xl bg-black text-white focus:outline-none",
              "focus:border-black focus:bg-white focus:text-black transition-colors w-full"
            )}
            onKeyDown={(e) => e.key === "Enter" && handleAddFilm()}
          />
          <button
            onClick={handleAddFilm}
            className={twMerge(
              "bg-black text-white w-12.5 h-12.5 rounded-xl ml-2",
              "cursor-pointer hover:bg-white hover:text-black transition-colors",
              "border border-white hover:border-black"
            )}
          >
            +
          </button>
        </div>

        <div className="mt-2">
          {films.length === 0 ? (
            <p className="text-black text-center text-sm mt-5">
              Список фильмов пуст
            </p>
          ) : (
            films.map((film: Film) => (
              <FilmItem key={film.position} film={film} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
