import { useCallback, useEffect, useMemo, useState } from "react";
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

  const fetchData = useCallback(async () => {
    const [filmsRes, evaluationsRes] = await Promise.all([getFilmsToEvaluate(), getEvaluations()]);

    return {
      films: extractList(filmsRes.data, "films"),
      evaluations: extractList(evaluationsRes.data, "evaluations"),
    };
  }, []);

  const loadInitialData = useCallback(async () => {
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
  }, [fetchData]);

  const refreshData = useCallback(async () => {
    const { films: nextFilms, evaluations: nextEvaluations } = await fetchData();
    setFilms(nextFilms);
    setEvaluations(nextEvaluations);
  }, [fetchData]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

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
      <section className="relative min-h-screen overflow-hidden bg-black px-4 pb-16 pt-32 text-white sm:px-6 sm:pt-36">
        <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#AD46FF]/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-40 h-80 w-80 rounded-full bg-[#51A2FF]/15 blur-3xl" />

        <div className="relative mx-auto max-w-6xl rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-10">
          <p className="text-xs uppercase tracking-[0.28em] text-white/40">Jury Console</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            Loading jury workspace...
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-black px-4 pb-16 pt-32 text-white sm:px-6 sm:pt-36">
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#AD46FF]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-40 h-80 w-80 rounded-full bg-[#51A2FF]/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/3 h-56 w-56 rounded-full bg-[#F6339A]/10 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-6">
        <header className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Jury Console</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Vote <span className="bg-[linear-gradient(180deg,#51A2FF_0%,#AD46FF_50%,#FF2B7F_100%)] bg-clip-text text-transparent">Workspace</span>
              </h1>
              <p className="mt-3 text-sm text-white/70">
                {completed} evaluated · {films.length} remaining
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleUndo}
                disabled={submitting || completed === 0}
                className="rounded-full border border-white/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Undo Last
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-[#F6339A]/40 bg-[#F6339A]/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#ffd6ea] transition hover:bg-[#F6339A]/25"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#51A2FF_0%,#AD46FF_50%,#34D399_100%)] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </header>

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {stats && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
            <p className="text-sm text-emerald-200">
              Last vote on <span className="font-semibold">{stats.filmTitle}</span>: {stats.decision}
            </p>
            <p className="mt-1 text-xs text-white/75">
              YES {stats.yes} ({stats.yesPercent}%) · MAYBE {stats.maybe} ({stats.maybePercent}%) · NO {stats.no} ({stats.noPercent}%) · Total {stats.total}
            </p>
          </div>
        )}

        {!currentFilm ? (
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.24em] text-white/45">Queue Complete</p>
            <h2 className="mt-3 text-2xl font-bold">No films left to evaluate</h2>
            <p className="mt-2 text-sm text-white/70">All assigned films have been reviewed.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
            <article className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">Current Film</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white">{currentFilm.title}</h2>
              {currentFilm.translated_title && (
                <p className="mt-2 text-sm text-white/70">{currentFilm.translated_title}</p>
              )}

              <div className="mt-5 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.14em]">
                {currentFilm.status && (
                  <span className="rounded-full border border-[#AD46FF]/45 bg-[#AD46FF]/10 px-3 py-1 text-[#e8c9ff]">
                    {currentFilm.status}
                  </span>
                )}
                {currentFilm.language && (
                  <span className="rounded-full border border-[#51A2FF]/40 bg-[#51A2FF]/10 px-3 py-1 text-[#cbe9ff]">
                    {currentFilm.language}
                  </span>
                )}
                {currentFilm.duration && (
                  <span className="rounded-full border border-[#34D399]/40 bg-[#34D399]/10 px-3 py-1 text-[#ccf8e8]">
                    {currentFilm.duration}
                  </span>
                )}
              </div>

              {currentFilm.user && (
                <p className="mt-5 text-sm text-white/75">
                  By {currentFilm.user.first_name} {currentFilm.user.last_name}
                </p>
              )}

              {currentFilm.synopsis && (
                <p className="mt-5 text-sm leading-7 text-white/85">{currentFilm.synopsis}</p>
              )}
            </article>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:p-6">
              {embedUrl ? (
                <div className="aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                  <iframe
                    src={embedUrl}
                    title={currentFilm.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-2xl border border-white/10 bg-black/30 px-4 text-center text-sm text-white/60">
                  No YouTube link available
                </div>
              )}

              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Optional comment"
                rows={4}
                className="mt-4 w-full resize-none rounded-2xl border border-white/15 bg-black/30 p-3 text-sm text-white placeholder:text-white/40 focus:border-[#51A2FF]/50 focus:outline-none"
              />

              <div className="mt-4 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleVote("NO")}
                  disabled={submitting}
                  className="rounded-xl bg-gradient-to-r from-[#ef4444] to-[#f97316] px-3 py-2.5 text-xs font-black uppercase tracking-[0.15em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  NO
                </button>
                <button
                  type="button"
                  onClick={() => handleVote("MAYBE")}
                  disabled={submitting}
                  className="rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#eab308] px-3 py-2.5 text-xs font-black uppercase tracking-[0.15em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  MAYBE
                </button>
                <button
                  type="button"
                  onClick={() => handleVote("YES")}
                  disabled={submitting}
                  className="rounded-xl bg-gradient-to-r from-[#22c55e] to-[#10b981] px-3 py-2.5 text-xs font-black uppercase tracking-[0.15em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  YES
                </button>
              </div>
            </div>
          </div>
        )}

        {evaluations.length > 0 && (
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:p-6">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
              Recent Evaluations
            </h3>
            <div className="space-y-2">
              {evaluations.slice(0, 5).map((evaluation) => (
                <div
                  key={evaluation.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm"
                >
                  <span className="truncate pr-4 text-white/90">
                    {evaluation.film?.title || `Film #${evaluation.film_id}`}
                  </span>
                  <span className="rounded-full border border-white/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">
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
