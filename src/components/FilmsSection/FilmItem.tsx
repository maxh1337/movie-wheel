"use client";

import { useState } from "react";
import { IoMdTrash } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { Film, useFilmZustand } from "../../store/useFilmZustand.store";

export interface FilmItemProps {
  film: Film;
}

export default function FilmItem({ film }: FilmItemProps) {
  const { removeFilm, editFilm } = useFilmZustand();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(film.title);

  const handleSave = () => {
    if (title.trim()) {
      editFilm(film.position, title.trim());
      setIsEditing(false);
    }
  };

  return (
    <div className="text-white bg-black flex border border-white rounded-xl px-3 py-2 mb-2 items-center justify-between">
      <div className="flex items-center gap-2">
        <p className="w-8 h-8 flex items-center justify-center text-sm bg-black mr-2">
          {film.position}
        </p>
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              className="w-full bg-transparent text-white border-none outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
          ) : (
            <p className="text-base w-full">{film.title}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="group rounded-full p-2 transition-colors cursor-pointer hover:bg-white"
          onClick={() => setIsEditing(true)}
        >
          <MdEdit className="w-5 h-5 text-white transition-colors group-hover:text-black" />
        </span>
        <span
          className="group rounded-full p-2 transition-colors cursor-pointer hover:bg-white"
          onClick={() => removeFilm(film.position)}
        >
          <IoMdTrash className="w-5 h-5 text-white transition-colors group-hover:text-black" />
        </span>
      </div>
    </div>
  );
}
