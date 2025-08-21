import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Film {
  position: number;
  title: string;
}

type Mode = "elimination" | "normal";

interface FilmStore {
  films: Film[];
  mode: Mode;

  addFilm: (title: string) => void;
  removeFilm: (position: number) => void;
  editFilm: (position: number, newTitle: string) => void;
  setMode: (mode: Mode) => void;
  reset: () => void;
}

export const useFilmZustand = create<FilmStore>()(
  persist(
    (set) => ({
      films: [],
      mode: "normal",

      addFilm: (title) =>
        set((state) => {
          const newFilm: Film = {
            position:
              state.films.length > 0
                ? state.films[state.films.length - 1].position + 1
                : 1,
            title,
          };
          return { films: [...state.films, newFilm] };
        }),

      removeFilm: (position) =>
        set((state) => ({
          films: state.films.filter((film) => film.position !== position),
        })),

      editFilm: (position, newTitle) =>
        set((state) => ({
          films: state.films.map((film) =>
            film.position === position ? { ...film, title: newTitle } : film
          ),
        })),

      setMode: (mode) => set(() => ({ mode })),

      reset: () => set(() => ({ films: [], mode: "normal" })),
    }),
    {
      name: "film-store",
    }
  )
);
