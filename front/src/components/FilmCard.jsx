import Icon from "../assets/Gallerie_svg/Icon.svg";
import Globe from "../assets/Gallerie_svg/Globe.svg";
import { useNavigate } from "react-router";

export default function FilmCard({ film }) {
  const navigate = useNavigate();
  if (!film) return null;

  const goToFilm = () => navigate(`/films/${film.id}`);

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goToFilm();
    }
  };

  const title = film.title ?? "Sans titre";
  const translatedTitle = film.translated_title ?? "";
  const duration = film.duration ?? ""; // varchar(20)
  const synopsis = film.synopsis ?? "";
  const status = film.status ?? ""; // enum(...)
  const aiTools = film.ai_tools ?? ""; // text
  const youtubeLink = film.youtube_link ?? "";
  const thumbnail = film.thumbnail ?? ""; // varchar(255)
  const image2 = film.image_2 ?? "";
  const image3 = film.image_3 ?? "";

  const badgeTopLeft = status ? status.replaceAll("_", " ").toUpperCase() : "STATUS";
  const badgeSecond = aiTools ? aiTools : "AI TOOLS";

  const coverUrl = thumbnail || image2 || image3 || "";

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
                {badgeTopLeft}
              </span>

              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-black tracking-wide text-white/90">
                {badgeSecond}
              </span>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2">
              <img src={Icon} alt="Icon" className="h-4 w-4" />
              <span className="font-black text-white">{duration || "—"}</span>
            </span>
          </div>

          {coverUrl ? (
            <div className="aspect-3/4 w-full overflow-hidden">
              <img
                src={coverUrl}
                alt={title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          ) : (
            <div className="aspect-3/4 w-full" />
          )}
        </article>

        <div className="mt-6">
          <h2 className="text-2xl font-extrabold tracking-widest text-white">
            {title}
          </h2>

          {/* translated_title */}
          {translatedTitle ? (
            <div className="mt-2 text-sm text-white/70">{translatedTitle}</div>
          ) : null}

          <div className="mt-6 grid grid-cols-2 gap-10">
            {/* synopsis */}
            <div>
              <div className="text-[12px] font-black tracking-widest text-white/50">
                SYNOPSIS
              </div>
              <div className="mt-3 text-sm font-medium text-white/90 line-clamp-3">
                {synopsis || "—"}
              </div>
            </div>

            {/* youtube_link */}
            <div className="text-right">
              <div className="text-[12px] font-black tracking-widest text-white/50">
                VIDÉO
              </div>

              <div className="mt-3 flex items-center justify-end gap-2 text-sm font-semibold text-white/90">
                <img src={Globe} alt="Link" className="h-4 w-4 opacity-80" />
                {youtubeLink ? (
                  <a
                    href={youtubeLink}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()} 
                    className="underline underline-offset-4 hover:text-white"
                  >
                    YouTube
                  </a>
                ) : (
                  <span>—</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
