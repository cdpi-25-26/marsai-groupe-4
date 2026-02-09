import Icon from "../assets/Gallerie_svg/Icon.svg";
import Globe from "../assets/Gallerie_svg/Globe.svg";
import { useNavigate } from "react-router";

export default function FilmCard({ film }) {
  const navigate = useNavigate();

  if (!film) return null;

  const goToFilm = () => {
    navigate(`/films/${film.id}`);
  };

  const onKeyDown = (e) => {
    // pour accessibilité depuis clavier
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goToFilm();
    }
  };

  return (
    <div className="w-full">
      <div
        role="link"
        tabIndex={0}
        onClick={goToFilm}
        onKeyDown={onKeyDown}
        className="cursor-pointer outline-none"
      >
        <article className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/5 shadow-[0_24px_80px_rgba(0,0,0,0.55)] transition hover:scale-[1.01]">
          <div className="flex justify-between items-start p-4">
            <div className="flex flex-col gap-2">
              <span className="inline-flex rounded-full border border-purple-500/50 bg-purple-600/30 px-4 py-2 text-[10px] font-black tracking-wide">
                {film.category}
              </span>

              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-black tracking-wide text-white/90">
                {film.ai}
              </span>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2">
              <img src={Icon} alt="Icon" className="h-4 w-4" />
              <span className="font-black text-white">{film.rank}</span>
            </span>
          </div>
{/* Placeholder pour l'image du film */}
          <div className="aspect-3/4 w-full" />
        </article>

        <div className="mt-6">
          <h2 className="text-2xl font-extrabold tracking-widest text-white">
            {film.title}
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-10">
            <div>
              <div className="text-[12px] font-black tracking-widest text-white/50">
                RÉALISATEUR
              </div>
              <div className="mt-3 text-lg font-semibold text-white/90 whitespace-nowrap">
                {film.director}
              </div>
            </div>

            <div className="text-right">
              <div className="text-[12px] font-black tracking-widest text-white/50">
                ORIGINE
              </div>

              <div className="mt-3 flex items-center justify-end gap-2 text-xl font-semibold text-white/90">
                <img src={Globe} alt="Globe" className="h-4 w-4 opacity-80" />
                <span>{film.origin}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
