import { useEffect, useMemo, useState } from "react";
import {
  getEvaluations,
  getFilmsToEvaluate,
  createEvaluation,
  undoLastEvaluation,
  getFilmStats,
} from "../../api/evaluations.js";
import handleLogout from "../../utils/helpers.js";

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
      return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1` : "";
    }

    if (link.includes("youtube.com/embed/")) {
      return `${link}${link.includes("?") ? "&" : "?"}rel=0&modestbranding=1&playsinline=1`;
    }
  } catch {
    return "";
  }

  return "";
}

function extractList(payload, key) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload[key])) return payload[key];
  return [];
}

function getErrorMessage(error, fallback) {
  return error?.response?.data?.error || error?.message || fallback;
}

function JuryVote() {
  const [films, setFilms] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [comment, setComment] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function fetchData() {
    const [filmsRes, evaluationsRes] = await Promise.all([
      getFilmsToEvaluate(),
      getEvaluations(),
    ]);

    return {
      films: extractList(filmsRes.data, "films"),
      evaluations: extractList(evaluationsRes.data, "evaluations"),
    };
  }

  async function loadInitialData() {
    setLoading(true);
    setError("");
    try {
      const { films: nextFilms, evaluations: nextEvaluations } = await fetchData();
      setFilms(nextFilms);
      setEvaluations(nextEvaluations);
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Failed to load jury data"));
    } finally {
      setLoading(false);
    }
  }

  async function refreshData() {
    const { films: nextFilms, evaluations: nextEvaluations } = await fetchData();
    setFilms(nextFilms);
    setEvaluations(nextEvaluations);
  }

  useEffect(() => {
    loadInitialData();
  }, []);

  const currentFilm = films[0] ?? null;
  const embedUrl = useMemo(() => getYoutubeEmbedUrl(currentFilm?.youtube_link), [currentFilm?.youtube_link]);

  const completed = evaluations.length;
  const total = completed + films.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 100;

  async function handleVote(decision) {
    if (!currentFilm || submitting) return;

    setSubmitting(true);
    setError("");

    const votedFilm = currentFilm;

    try {
      await createEvaluation({
        film_id: votedFilm.id,
        decision,
        comment: comment.trim() || null,
      });

      setComment("");

      const [statsResult, refreshResult] = await Promise.allSettled([
        getFilmStats(votedFilm.id),
        refreshData(),
      ]);

      if (statsResult.status === "fulfilled") {
        setStats({
          ...statsResult.value.data,
          filmTitle: votedFilm.title,
          decision,
        });
      } else {
        setStats(null);
      }

      if (refreshResult.status === "rejected") {
        setError(getErrorMessage(refreshResult.reason, "Evaluation saved but refresh failed"));
      }
    } catch (voteError) {
      setError(getErrorMessage(voteError, "Failed to submit evaluation"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUndo() {
    if (submitting) return;

    setSubmitting(true);
    setError("");

    try {
      await undoLastEvaluation();
      setStats(null);
      await refreshData();
    } catch (undoError) {
      setError(getErrorMessage(undoError, "Failed to undo evaluation"));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <section className="min-h-screen bg-black px-4 py-8 text-white">
        <div className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-white/5 p-6">
          Loading jury workspace...
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-5">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div>
            <h1 className="text-2xl font-semibold">Jury Vote</h1>
            <p className="text-sm text-white/70">
              {completed} evaluated · {films.length} remaining
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleUndo}
              disabled={submitting || completed === 0}
              className="rounded-lg border border-white/30 px-3 py-2 text-sm transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Undo last
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-red-500/40 bg-red-500/15 px-3 py-2 text-sm text-red-200 transition hover:bg-red-500/25"
            >
              Logout
            </button>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </header>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {stats && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
            <p className="text-sm text-emerald-200">
              Last vote on <span className="font-semibold">{stats.filmTitle}</span>: {stats.decision}
            </p>
            <p className="mt-1 text-xs text-white/75">
              YES {stats.yes} ({stats.yesPercent}%) · MAYBE {stats.maybe} ({stats.maybePercent}%) · NO {stats.no} ({stats.noPercent}%) · Total {stats.total}
            </p>
          </div>
        )}

        {!currentFilm ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <h2 className="text-xl font-semibold">No films left to evaluate</h2>
            <p className="mt-2 text-sm text-white/70">
              All assigned films have been reviewed.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/50">
                Current Film
              </p>
              <h2 className="text-2xl font-semibold">{currentFilm.title}</h2>
              {currentFilm.translated_title && (
                <p className="mt-1 text-sm text-white/70">{currentFilm.translated_title}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {currentFilm.status && (
                  <span className="rounded-full border border-white/20 px-2 py-1 text-white/80">
                    {currentFilm.status}
                  </span>
                )}
                {currentFilm.language && (
                  <span className="rounded-full border border-white/20 px-2 py-1 text-white/80">
                    {currentFilm.language}
                  </span>
                )}
                {currentFilm.duration && (
                  <span className="rounded-full border border-white/20 px-2 py-1 text-white/80">
                    {currentFilm.duration}
                  </span>
                )}
              </div>

              {currentFilm.user && (
                <p className="mt-4 text-sm text-white/75">
                  By {currentFilm.user.first_name} {currentFilm.user.last_name}
                </p>
              )}

              {currentFilm.synopsis && (
                <p className="mt-4 text-sm leading-6 text-white/85">{currentFilm.synopsis}</p>
              )}
            </article>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              {embedUrl ? (
                <div className="aspect-video overflow-hidden rounded-xl border border-white/10">
                  <iframe
                    src={embedUrl}
                    title={currentFilm.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-xl border border-white/10 bg-black/30 text-sm text-white/60">
                  No YouTube link available
                </div>
              )}

              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Optional comment"
                rows={3}
                className="mt-4 w-full resize-none rounded-xl border border-white/15 bg-black/25 p-3 text-sm text-white placeholder:text-white/40"
              />

              <div className="mt-4 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleVote("NO")}
                  disabled={submitting}
                  className="rounded-lg bg-red-500/80 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  NO
                </button>
                <button
                  type="button"
                  onClick={() => handleVote("MAYBE")}
                  disabled={submitting}
                  className="rounded-lg bg-amber-500/80 px-3 py-2 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  MAYBE
                </button>
                <button
                  type="button"
                  onClick={() => handleVote("YES")}
                  disabled={submitting}
                  className="rounded-lg bg-emerald-500/80 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  YES
                </button>
              </div>
            </div>
          </div>
        )}

        {evaluations.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              Recent Evaluations
            </h3>
            <div className="space-y-2">
              {evaluations.slice(0, 5).map((evaluation) => (
                <div
                  key={evaluation.id}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm"
                >
                  <span className="truncate pr-4">
                    {evaluation.film?.title || `Film #${evaluation.film_id}`}
                  </span>
                  <span className="rounded border border-white/20 px-2 py-0.5 text-xs">
                    {evaluation.decision}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default JuryVote;
