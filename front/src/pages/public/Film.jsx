import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../../api/config";
import { YouTubePlayer } from "../../components/ui/youtube-video-player";

function extractYoutubeId(link) {
  if (!link) return "";
  try {
    if (link.includes("youtu.be/")) {
      return link.split("youtu.be/")[1].split(/[?&]/)[0];
    }
    if (link.includes("youtube.com/watch")) {
      const url = new URL(link);
      return url.searchParams.get("v") || "";
    }
    if (link.includes("youtube.com/embed/")) {
      return link.split("embed/")[1].split(/[?&]/)[0];
    }
  } catch {}
  if (/^[a-zA-Z0-9_-]{6,}$/.test(link)) return link;
  return "";
}

function prettyStatus(status) {
  return status ? String(status).replaceAll("_", " ").toUpperCase() : "";
}

export default function Film() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFilmFromGallery = async () => {
      try {
        setLoading(true);
        setError("");
        setFilm(null);

        const token = localStorage.getItem("token");
        if (!token) {
          setError('Pas de token dans le localStorage. Il faut se connecter (clé « token »).');
          return;
        }

        const targetId = Number(id);
        const limit = 50;

        const findIn = (data) => {
          const arr = data?.showVideos || data?.videos || data?.items || [];
          return arr.find((v) => Number(v.id) === targetId) || null;
        };

        const firstRes = await api.get(`/gallerie?page=1&limit=${limit}`);
        const firstData = firstRes.data;

        let found = findIn(firstData);
        if (found) {
          setFilm(found);
          return;
        }

        const totalPages = Number(firstData?.totalPages || 1);

        for (let p = 2; p <= totalPages; p++) {
          const res = await api.get(`/gallerie?page=${p}&limit=${limit}`);
          found = findIn(res.data);
          if (found) {
            setFilm(found);
            return;
          }
        }

        setError("Film not found");
      } catch (err) {
        console.error("FETCH FILM ERROR:", err);

        if (err?.response) {
          setError(
            `HTTP ${err.response.status} — ${
              typeof err.response.data === "string"
                ? err.response.data
                : JSON.stringify(err.response.data)
            }`
          );
        } else {
          setError(err.message || "Erreur de chargement du film.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFilmFromGallery();
    else {
      setLoading(false);
      setError("Pas d'id dans l'URL");
    }
  }, [id]);

  const videoId = useMemo(() => {
    const link =
      film?.youtube_link ||
      film?.youtubeLink ||
      film?.video_link ||
      film?.video ||
      "";
    return extractYoutubeId(link);
  }, [film]);

  const status = prettyStatus(film?.status);
  const aiTools = film?.ai_tools || film?.aiTools || "_";
  const duration = film?.duration || "_";
  const director = film?.user
    ? `${film.user.first_name || ""} ${film.user.last_name || ""}`.trim()
    : "";
  const origin = film?.language || "";

  if (loading) return <div className="p-6 text-white">Loading...</div>;
  if (error) return <div className="p-6 text-red-400">{error}</div>;
  if (!film) return <div className="p-6 text-white">Film not found</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 rounded-full border border-white/20 px-4 py-2 hover:bg-white/10"
      >
        ← Back
      </button>

      <div className="mx-auto max-w-6xl">
        {/* VIDEO */}
        <div className="mt-2">
          {videoId ? (
            <YouTubePlayer
              videoId={videoId}
              title={film.title}
              className="w-full"
              containerClassName="rounded-2xl border border-white/10 bg-black text-white shadow-lg"
              expandedClassName="rounded-2xl border border-white/10 bg-black text-white shadow-xl"
              thumbnailImageClassName="opacity-80"
              playButtonClassName="bg-black/50 hover:bg-black/60 border-white/15"
              titleClassName="text-white/90"
              controlsClassName="right-3 top-3"
              expandButtonClassName="bg-black/40 hover:bg-black/55"
              backdropClassName="bg-black/70 backdrop-blur-sm"
              playerClassName="bg-black"
            />
          ) : (
            <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 text-white/60">
              No YouTube link
            </div>
          )}
        </div>

        {/* TITLE UNDER VIDEO */}
        <h1 className="mt-8 text-[48px] font-bold font-arimo uppercase bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">{film.title}</h1>
        {film.translated_title ? (
          <div className="mt-2 text-white/70">{film.translated_title}</div>
        ) : null}

        {/* INFO */}
        <div className="grid grid-cols-5 gap-8 mt-6">
          {director ? (
            <div>
              <span className="text-slate-400 font-black uppercase">Réalisateur </span>
              <span className="block text-sm font-extrabold text-white/55 font-jakarta">{director}</span>
            </div>
          ) : null}

          {origin ? (
            <div>
              <span className="text-slate-400 font-black uppercase">Origine </span>
              <span className="block text-sm font-extrabold text-white/55 font-jakarta">{origin}</span>

            </div>
          ) : null}

          {status ? (
            <div>
              <span className="text-slate-400 font-black uppercase">Statut </span>
              <span className="block text-sm font-extrabold text-white/55 font-jakarta">{status}</span>

            </div>
          ) : null}

          {aiTools ? (
            <div>
              <span className="text-slate-400 font-black uppercase">Type AI </span>
              <span className="block text-sm font-extrabold text-white/55 font-jakarta">{aiTools}</span>

            </div>
          ) : null}

          {duration ? (
            <div>
              <span className="text-slate-400 font-black uppercase">Durée </span>
              <span className="block text-sm font-extrabold text-white/55 font-jakarta">{duration}</span>

            </div>
          ) : null}
        </div>

        {/* SYNOPSIS */}
        {film.synopsis ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8">
            <div className="text-slate-400 font-black uppercase">
              SYNOPSIS 
            </div>
            <div className="block text-sm font-extrabold text-white/55 font-jakartamt-4  leading-relaxed">
              {film.synopsis}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
