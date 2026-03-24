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
      return id
        ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`
        : "";
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
    const [filmsRes, evaluationsRes] = await Promise.all([
      getFilmsToEvaluate(),
      getEvaluations(),
    ]);

    return {
      films: extractList(filmsRes.data, "films"),
      evaluations: extractList(evaluationsRes.data, "evaluations"),
    };
  }, []);

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { films: nextFilms, evaluations: nextEvaluations } =
        await fetchData();
      setFilms(nextFilms);
      setEvaluations(nextEvaluations);
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Failed to load jury data"));
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  const refreshData = useCallback(async () => {
    const { films: nextFilms, evaluations: nextEvaluations } =
      await fetchData();
    setFilms(nextFilms);
    setEvaluations(nextEvaluations);
  }, [fetchData]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const currentFilm = films[0] ?? null;

  const embedUrl = useMemo(
    () => getYoutubeEmbedUrl(currentFilm?.youtube_link),
    [currentFilm?.youtube_link]
  );

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
      }

      if (refreshResult.status === "rejected") {
        setError(
          getErrorMessage(refreshResult.reason, "Evaluation saved but refresh failed")
        );
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
      <section
        style={{
          background: "var(--jury-bg)",
          color: "var(--jury-text)",
        }}
        className="relative min-h-screen px-4 pb-16 pt-32"
      >
        <div
          style={{
            background: "var(--jury-card-bg)",
            borderColor: "var(--jury-card-border)",
          }}
          className="mx-auto max-w-6xl rounded-[28px] border p-6"
        >
          <h1 className="text-3xl font-black">Loading jury workspace...</h1>
        </div>
      </section>
    );
  }

  return (
    <section
      style={{
        background: "var(--jury-bg)",
        color: "var(--jury-text)",
      }}
      className="relative min-h-screen px-4 pb-16 pt-32"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header
          style={{
            background: "var(--jury-card-bg)",
            borderColor: "var(--jury-card-border)",
          }}
          className="rounded-[28px] border p-6"
        >
          <h1 className="text-3xl font-black">Vote Workspace</h1>

          <div
            style={{
              background: "var(--jury-progress-bg)",
            }}
            className="mt-5 h-2.5 w-full rounded-full"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#51A2FF] via-[#AD46FF] to-[#34D399]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </header>

        {error && (
          <div
            style={{
              background: "var(--jury-danger-bg)",
              borderColor: "var(--jury-danger-border)",
              color: "var(--jury-danger-text)",
            }}
            className="rounded-2xl border px-4 py-3 text-sm"
          >
            {error}
          </div>
        )}

        {stats && (
          <div
            style={{
              background: "var(--jury-success-bg)",
              borderColor: "var(--jury-success-border)",
              color: "var(--jury-success-text)",
            }}
            className="rounded-2xl border px-4 py-3"
          >
            Last vote on {stats.filmTitle}: {stats.decision}
          </div>
        )}

        {currentFilm && (
          <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
            <article
              style={{
                background: "var(--jury-card-bg)",
                borderColor: "var(--jury-card-border)",
              }}
              className="rounded-[28px] border p-6"
            >
              <h2 className="text-3xl font-black">{currentFilm.title}</h2>

              {currentFilm.synopsis && (
                <p style={{ color: "var(--jury-muted)" }} className="mt-4">
                  {currentFilm.synopsis}
                </p>
              )}
            </article>

            <div
              style={{
                background: "var(--jury-card-bg)",
                borderColor: "var(--jury-card-border)",
              }}
              className="rounded-[28px] border p-6"
            >
              {embedUrl && (
                <iframe
                  src={embedUrl}
                  className="aspect-video w-full rounded-2xl"
                  allowFullScreen
                />
              )}

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Optional comment"
                rows={4}
                style={{
                  background: "var(--jury-input-bg)",
                  borderColor: "var(--jury-input-border)",
                }}
                className="mt-4 w-full rounded-2xl border p-3"
              />

              <div className="mt-4 grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleVote("NO")}
                  className="rounded-xl bg-gradient-to-r from-red-500 to-orange-500 py-2 text-xs font-bold text-white"
                >
                  NO
                </button>

                <button
                  onClick={() => handleVote("MAYBE")}
                  className="rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 py-2 text-xs font-bold text-white"
                >
                  MAYBE
                </button>

                <button
                  onClick={() => handleVote("YES")}
                  className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 py-2 text-xs font-bold text-white"
                >
                  YES
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default JuryVote;
