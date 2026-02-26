import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../../api/config";

function getYoutubeEmbedUrl(link) {
  if (!link) return "";

  try {
    if (link.includes("youtu.be/")) {
      const id = link.split("youtu.be/")[1].split(/[?&]/)[0];
      return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`;
    }

    if (link.includes("youtube.com/watch")) {
      const url = new URL(link);
      const id = url.searchParams.get("v");
      return id
        ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`
        : "";
    }

    if (link.includes("youtube.com/embed/")) {
      const id = link.split("embed/")[1].split(/[?&]/)[0];
      return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`;
    }
  } catch {}

  // если вдруг это уже чистый id
  if (/^[a-zA-Z0-9_-]{6,}$/.test(link)) {
    return `https://www.youtube.com/embed/${link}?rel=0&modestbranding=1&playsinline=1`;
  }

  return "";
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
          setError('Нет token в localStorage. Нужно залогиниться (ключ "token").');
          return;
        }

        const targetId = Number(id);
        const limit = 50; // быстрее, чем 6

        const findIn = (data) => {
          const arr = data?.showVideos || data?.videos || data?.items || [];
          return arr.find((v) => Number(v.id) === targetId) || null;
        };

        // 1) первая страница
        const firstRes = await api.get(`/gallerie?page=1&limit=${limit}`);
        const firstData = firstRes.data;

        let found = findIn(firstData);
        if (found) {
          setFilm(found);
          return;
        }

        const totalPages = Number(firstData?.totalPages || 1);

        // 2) остальные страницы
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
          setError(err.message || "Ошибка загрузки фильма");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFilmFromGallery();
    else {
      setLoading(false);
      setError("Нет id в URL");
    }
  }, [id]);

  const embedUrl = useMemo(() => {
    const link =
      film?.youtube_link ||
      film?.youtubeLink ||
      film?.video_link ||
      film?.video ||
      "";
    return getYoutubeEmbedUrl(link);
  }, [film]);

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

      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-black">{film.title}</h1>

        {film.translated_title ? (
          <div className="mt-2 text-white/70">{film.translated_title}</div>
        ) : null}

        {film.synopsis ? (
          <div className="mt-6 text-white/80">{film.synopsis}</div>
        ) : null}

        {embedUrl ? (
          <div className="mt-8 flex justify-center">
            <div className="w-full max-w-3xl aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black">
              <iframe
                src={embedUrl}
                title={film.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
        ) : (
          <div className="mt-8 text-white/60">No YouTube link</div>
        )}
      </div>
    </div>
  );
}
