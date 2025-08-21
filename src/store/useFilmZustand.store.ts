import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Film {
  position: number;
  title: string;
  eliminated: boolean;
}

type Mode = "elimination" | "normal";

interface FilmStore {
  films: Film[];
  mode: Mode;

  addFilm: (title: string) => void;
  removeFilm: (position: number) => void;
  editFilm: (position: number, newTitle: string) => void;
  setEliminated: (position: number) => void;
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
            eliminated: false,
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
      setEliminated: (position) =>
        set((state) => ({
          films: state.films.map((film) =>
            film.position === position ? { ...film, eliminated: true } : film
          ),
        })),

      reset: () => set(() => ({ films: [], mode: "normal" })),
    }),
    {
      name: "film-store",
    }
  )
);
