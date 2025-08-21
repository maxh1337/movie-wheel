import FilmList from "../components/FilmsSection/FilmList";
import Wheel from "../components/WheelSection/Wheel";

export default function Home() {
  return (
    <div className="flex w-full">
      <Wheel />
      <FilmList />
    </div>
  );
}
