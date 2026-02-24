import { useEffect, useState, useRef } from "react";
import {
  getEvaluations,
  getFilmsToEvaluate,
  createEvaluation,
  undoLastEvaluation,
  getFilmStats,
} from "../api/evaluations.js";
import handleLogout from "../utils/helpers.js";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

function JuryVote() {
  const [films, setFilms] = useState([]);
  const [allFilms, setAllFilms] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [videoWatched, setVideoWatched] = useState(false);
  const videoRef = useRef(null);

  // Undo
  const [canUndo, setCanUndo] = useState(false);
  const [lastVotedFilm, setLastVotedFilm] = useState(null);

  // Stats popup
  const [stats, setStats] = useState(null);
  const [showStats, setShowStats] = useState(false);

  // Filters
  const [filterType, setFilterType] = useState("all");
  const [filterLang, setFilterLang] = useState("all");

  // Swipe state
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [exitDirection, setExitDirection] = useState(null);
  const startX = useRef(0);

  useEffect(() => {
    loadData();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...allFilms];
    if (filterType !== "all") filtered = filtered.filter((f) => f.type === filterType);
    if (filterLang !== "all") filtered = filtered.filter((f) => f.language === filterLang);
    setFilms(filtered);
  }, [allFilms, filterType, filterLang]);

  function loadData() {
    setLoading(true);
    Promise.all([
      getFilmsToEvaluate().then((res) => res.data),
      getEvaluations().then((res) => res.data),
    ])
      .then(([filmsData, evalsData]) => {
        setAllFilms(filmsData);
        setEvaluations(evalsData);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  const currentFilm = films[0];

  // Get unique languages and types for filters
  const languages = [...new Set(allFilms.map((f) => f.language).filter(Boolean))];
  const types = [...new Set(allFilms.map((f) => f.type).filter(Boolean))];

  const hasVideo = currentFilm?.video_file;
  const votingDisabled = submitting || (hasVideo && !videoWatched);

  function handleVote(decision) {
    if (!currentFilm || votingDisabled) return;
    setSubmitting(true);
    setExitDirection(decision === "YES" ? "right" : "left");

    setTimeout(() => {
      createEvaluation({
        film_id: currentFilm.id,
        decision,
        comment: comment || "",
      })
        .then(() => {
          setLastVotedFilm(currentFilm);
          setCanUndo(true);
          setComment("");
          setDragX(0);
          setExitDirection(null);
          setVideoWatched(false);

          // Fetch stats for the voted film
          getFilmStats(currentFilm.id)
            .then((res) => {
              setStats({ ...res.data, filmTitle: currentFilm.title, decision });
              setShowStats(true);
              setTimeout(() => setShowStats(false), 3000);
            })
            .catch(() => {});

          loadData();
        })
        .catch((err) => {
          alert("Erreur: " + err.message);
          setExitDirection(null);
        })
        .finally(() => setSubmitting(false));
    }, 400);
  }

  function handleUndo() {
    if (!canUndo || submitting) return;
    setSubmitting(true);
    undoLastEvaluation()
      .then(() => {
        setCanUndo(false);
        setLastVotedFilm(null);
        setShowStats(false);
        setVideoWatched(false);
        loadData();
      })
      .catch((err) => alert("Erreur: " + err.message))
      .finally(() => setSubmitting(false));
  }

  // Drag handlers
  function onDragStart(clientX) {
    if (submitting) return;
    setDragging(true);
    startX.current = clientX;
  }
  function onDragMove(clientX) {
    if (!dragging) return;
    setDragX(clientX - startX.current);
  }
  function onDragEnd() {
    if (!dragging) return;
    setDragging(false);
    if (dragX > 120) handleVote("YES");
    else if (dragX < -120) handleVote("NO");
    else setDragX(0);
  }

  // Keyboard
  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight") handleVote("YES");
      if (e.key === "ArrowLeft") handleVote("NO");
      if (e.key === "z" && (e.ctrlKey || e.metaKey)) handleUndo();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Handle video ended — unlock voting
  function handleVideoEnded() {
    setVideoWatched(true);
  }

  // Handle video timeupdate — unlock at 80% watched
  function handleTimeUpdate(e) {
    const video = e.target;
    if (video.duration && video.currentTime / video.duration >= 0.8) {
      setVideoWatched(true);
    }
  }

  if (loading) {
    return (
      <div style={styles.screen}>
        <p style={{ color: "#9ca3af", fontSize: 18 }}>Chargement des films...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.screen}>
        <p style={{ color: "#ef4444", fontSize: 18 }}>Erreur: {error}</p>
      </div>
    );
  }

  const rotation = dragging ? dragX * 0.08 : 0;
  const cardTransform = exitDirection
    ? `translateX(${exitDirection === "right" ? 120 : -120}vw) rotate(${exitDirection === "right" ? 30 : -30}deg)`
    : `translateX(${dragX}px) rotate(${rotation}deg)`;
  const overlayOpacity = Math.min(Math.abs(dragX) / 120, 1);
  const overlayColor = dragX > 0 ? "rgba(74,222,128,0.35)" : "rgba(248,113,113,0.35)";
  const overlayText = dragX > 30 ? "YES" : dragX < -30 ? "NO" : "";

  const totalFilms = evaluations.length + allFilms.length;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", padding: "20px 20px 40px", overflow: "hidden" }}>
      {/* Top bar */}
      <div style={{ maxWidth: 500, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: "bold", color: "white" }}>Espace Jury</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>Déconnexion</button>
      </div>

      {/* Filters */}
      {(types.length > 0 || languages.length > 1) && (
        <div style={{ maxWidth: 500, margin: "0 auto 16px", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {types.length > 0 && (
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="all">Tous les types</option>
              {types.map((t) => (
                <option key={t} value={t}>{t === "hybride" ? "Hybride" : "100% IA"}</option>
              ))}
            </select>
          )}
          {languages.length > 1 && (
            <select
              value={filterLang}
              onChange={(e) => setFilterLang(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="all">Toutes les langues</option>
              {languages.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Progress */}
      <div style={{ maxWidth: 500, margin: "0 auto 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: "#9ca3af" }}>
          <span>{evaluations.length} voté{evaluations.length > 1 ? "s" : ""}</span>
          <span>{films.length} restant{films.length > 1 ? "s" : ""}</span>
        </div>
        <div style={{ height: 4, background: "#1f2937", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${evaluations.length / Math.max(totalFilms, 1) * 100}%`,
            background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
            borderRadius: 2,
            transition: "width 0.5s ease",
          }} />
        </div>
      </div>

      {/* Stats toast */}
      {showStats && stats && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 100,
          background: stats.decision === "YES" ? "rgba(22,101,52,0.95)" : "rgba(127,29,29,0.95)",
          padding: "14px 24px", borderRadius: 14, color: "white",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)", animation: "fadeIn 0.3s ease",
          textAlign: "center", minWidth: 220,
        }}>
          <div style={{ fontSize: 14, fontWeight: "bold", marginBottom: 6 }}>{stats.filmTitle}</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, fontSize: 13 }}>
            <span>👍 {stats.yesPercent}% ({stats.yes})</span>
            <span>👎 {stats.noPercent}% ({stats.no})</span>
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
            {stats.total} vote{stats.total > 1 ? "s" : ""} au total
          </div>
        </div>
      )}

      {/* Card area */}
      <div style={{ maxWidth: 500, margin: "0 auto", position: "relative", minHeight: 420 }}>
        {currentFilm ? (
          <>
            {/* Swipe card */}
            <div
              onMouseDown={(e) => onDragStart(e.clientX)}
              onMouseMove={(e) => onDragMove(e.clientX)}
              onMouseUp={onDragEnd}
              onMouseLeave={() => dragging && onDragEnd()}
              onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
              onTouchMove={(e) => onDragMove(e.touches[0].clientX)}
              onTouchEnd={onDragEnd}
              style={{
                ...styles.card,
                transform: cardTransform,
                transition: dragging ? "none" : "transform 0.4s cubic-bezier(0.2,0.8,0.2,1)",
                cursor: dragging ? "grabbing" : "grab",
                userSelect: "none",
              }}
            >
              {/* Swipe overlay */}
              {Math.abs(dragX) > 10 && !exitDirection && (
                <div style={{
                  position: "absolute", inset: 0, borderRadius: 20,
                  background: overlayColor, opacity: overlayOpacity,
                  display: "flex", justifyContent: "center", alignItems: "center",
                  pointerEvents: "none", zIndex: 2,
                }}>
                  <span style={{
                    fontSize: 64, fontWeight: "bold", color: "white",
                    textShadow: "0 4px 20px rgba(0,0,0,0.5)",
                    transform: `rotate(${dragX > 0 ? -15 : 15}deg)`,
                  }}>
                    {overlayText}
                  </span>
                </div>
              )}

              <div style={{ position: "relative", zIndex: 1, padding: 28 }}>
                {/* Badge + type */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
                  <div style={{
                    padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                    background: "rgba(139,92,246,0.2)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.3)",
                  }}>
                    Film {evaluations.length + 1} / {totalFilms}
                  </div>
                  {currentFilm.type && (
                    <div style={{
                      padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                      background: currentFilm.type === "total_ia" ? "rgba(236,72,153,0.2)" : "rgba(59,130,246,0.2)",
                      color: currentFilm.type === "total_ia" ? "#f472b6" : "#60a5fa",
                      border: `1px solid ${currentFilm.type === "total_ia" ? "rgba(236,72,153,0.3)" : "rgba(59,130,246,0.3)"}`,
                    }}>
                      {currentFilm.type === "total_ia" ? "100% IA" : "Hybride"}
                    </div>
                  )}
                </div>

                <h2 style={{ fontSize: 26, fontWeight: "bold", color: "white", marginBottom: 8, lineHeight: 1.2 }}>
                  {currentFilm.title}
                </h2>

                {currentFilm.translated_title && (
                  <p style={{ color: "#6b7280", fontSize: 15, marginBottom: 12, fontStyle: "italic" }}>
                    {currentFilm.translated_title}
                  </p>
                )}

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                  {currentFilm.language && <span style={styles.tag}>{currentFilm.language}</span>}
                  {currentFilm.duration && <span style={styles.tag}>{currentFilm.duration}s</span>}
                  {currentFilm.user && <span style={styles.tag}>{currentFilm.user.first_name} {currentFilm.user.last_name}</span>}
                </div>

                {currentFilm.synopsis && (
                  <p style={{ color: "#d1d5db", fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
                    {currentFilm.synopsis}
                  </p>
                )}

                {/* Video — mandatory viewing */}
                {currentFilm.video_file && (
                  <div
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    style={{ marginBottom: 16, borderRadius: 10, overflow: "hidden", position: "relative" }}
                  >
                    <video
                      ref={videoRef}
                      src={`${API_BASE}/uploads/${currentFilm.video_file}`}
                      controls
                      onEnded={handleVideoEnded}
                      onTimeUpdate={handleTimeUpdate}
                      style={{ width: "100%", borderRadius: 10 }}
                    />
                    {!videoWatched && (
                      <div style={{
                        position: "absolute", bottom: 0, left: 0, right: 0,
                        background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                        padding: "12px", textAlign: "center",
                        color: "#fbbf24", fontSize: 12, fontWeight: 600,
                      }}>
                        Regardez le film avant de voter
                      </div>
                    )}
                  </div>
                )}

                {/* Comment */}
                <textarea
                  placeholder="Commentaire (optionnel)..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  rows={2}
                  style={styles.textarea}
                />
              </div>
            </div>

            {/* Buttons */}
            {/* Voting disabled message */}
            {hasVideo && !videoWatched && (
              <p style={{ textAlign: "center", color: "#fbbf24", fontSize: 13, marginTop: 16, fontWeight: 600 }}>
                Regardez le film avant de voter
              </p>
            )}

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20, marginTop: hasVideo && !videoWatched ? 8 : 24 }}>
              <button
                onClick={() => handleVote("NO")}
                disabled={votingDisabled}
                style={{
                  ...styles.noBtn,
                  opacity: votingDisabled ? 0.3 : 1,
                  cursor: votingDisabled ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => { if (!votingDisabled) { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(239,68,68,0.4)"; }}}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <span style={{ fontSize: 28 }}>✕</span>
              </button>

              {/* Undo button */}
              <button
                onClick={handleUndo}
                disabled={!canUndo || submitting}
                style={{
                  ...styles.undoBtn,
                  opacity: canUndo ? 1 : 0.25,
                  cursor: canUndo ? "pointer" : "default",
                }}
                title="Annuler le dernier vote (Ctrl+Z)"
              >
                <span style={{ fontSize: 18 }}>↩</span>
              </button>

              <button
                onClick={() => handleVote("YES")}
                disabled={votingDisabled}
                style={{
                  ...styles.yesBtn,
                  opacity: votingDisabled ? 0.3 : 1,
                  cursor: votingDisabled ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => { if (!votingDisabled) { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(34,197,94,0.4)"; }}}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <span style={{ fontSize: 28 }}>♥</span>
              </button>
            </div>

            <p style={{ textAlign: "center", color: "#4b5563", fontSize: 12, marginTop: 16 }}>
              Glissez la carte · ← → · Ctrl+Z pour annuler
            </p>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: 60, border: "1px solid #1f2937", borderRadius: 20, background: "#111" }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🎬</p>
            <p style={{ color: "white", fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
              {allFilms.length === 0 ? "Tous les films ont été évalués !" : "Aucun film ne correspond aux filtres"}
            </p>
            <p style={{ color: "#6b7280", fontSize: 15 }}>
              {allFilms.length === 0
                ? `Merci pour vos ${evaluations.length} vote${evaluations.length > 1 ? "s" : ""}.`
                : "Essayez de changer les filtres ci-dessus."}
            </p>
          </div>
        )}
      </div>

      {/* Recent votes */}
      {evaluations.length > 0 && (
        <div style={{ maxWidth: 500, margin: "40px auto 0" }}>
          <h3 style={{ color: "#4b5563", fontSize: 12, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>
            Vos votes récents
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {evaluations.slice(0, 10).map((ev) => (
              <div
                key={ev.id}
                style={{
                  padding: "6px 14px", borderRadius: 20, fontSize: 13,
                  border: "1px solid",
                  borderColor: ev.decision === "YES" ? "#166534" : "#7f1d1d",
                  color: ev.decision === "YES" ? "#4ade80" : "#f87171",
                  background: ev.decision === "YES" ? "rgba(22,101,52,0.15)" : "rgba(127,29,29,0.15)",
                }}
              >
                {ev.film?.title || `Film #${ev.film_id}`}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  screen: {
    minHeight: "100vh", background: "#0a0a0a",
    display: "flex", justifyContent: "center", alignItems: "center",
  },
  logoutBtn: {
    padding: "6px 14px", background: "transparent",
    border: "1px solid #374151", borderRadius: 8,
    color: "#6b7280", cursor: "pointer", fontSize: 13,
  },
  filterSelect: {
    padding: "6px 12px", background: "#111", border: "1px solid #374151",
    borderRadius: 8, color: "#9ca3af", fontSize: 13, outline: "none",
    cursor: "pointer",
  },
  card: {
    position: "relative", borderRadius: 20,
    background: "linear-gradient(145deg, #111 0%, #1a1a2e 100%)",
    border: "1px solid #2d2d44", overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
  },
  tag: {
    padding: "4px 10px", borderRadius: 6, fontSize: 12,
    background: "rgba(255,255,255,0.06)", color: "#9ca3af",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  textarea: {
    width: "100%", padding: 12,
    background: "rgba(0,0,0,0.3)", border: "1px solid #374151",
    borderRadius: 10, color: "white", fontSize: 14,
    resize: "none", outline: "none", boxSizing: "border-box",
  },
  noBtn: {
    width: 64, height: 64, borderRadius: "50%",
    border: "2px solid #ef4444", background: "rgba(239,68,68,0.1)",
    color: "#ef4444", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.2s",
  },
  yesBtn: {
    width: 64, height: 64, borderRadius: "50%",
    border: "2px solid #22c55e", background: "rgba(34,197,94,0.1)",
    color: "#22c55e", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.2s",
  },
  undoBtn: {
    width: 48, height: 48, borderRadius: "50%",
    border: "2px solid #f59e0b", background: "rgba(245,158,11,0.1)",
    color: "#f59e0b",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.2s",
  },
};

export default JuryVote;
