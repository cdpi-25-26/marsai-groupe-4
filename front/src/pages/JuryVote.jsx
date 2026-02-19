import { useEffect, useState, useRef } from "react";
import {
  getEvaluations,
  getFilmsToEvaluate,
  createEvaluation,
} from "../api/evaluations.js";
import handleLogout from "../utils/helpers.js";

function JuryVote() {
  const [films, setFilms] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Swipe state
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [exitDirection, setExitDirection] = useState(null); // "left" | "right"
  const startX = useRef(0);
  const cardRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    setLoading(true);
    Promise.all([
      getFilmsToEvaluate().then((res) => res.data),
      getEvaluations().then((res) => res.data),
    ])
      .then(([filmsData, evalsData]) => {
        setFilms(filmsData);
        setEvaluations(evalsData);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  const currentFilm = films[0];

  function handleVote(decision) {
    if (!currentFilm || submitting) return;
    setSubmitting(true);
    setExitDirection(decision === "YES" ? "right" : "left");

    setTimeout(() => {
      createEvaluation({
        film_id: currentFilm.id,
        decision,
        comment: comment || "",
      })
        .then(() => {
          setComment("");
          setDragX(0);
          setExitDirection(null);
          loadData();
        })
        .catch((err) => {
          alert("Erreur: " + err.message);
          setExitDirection(null);
        })
        .finally(() => setSubmitting(false));
    }, 400);
  }

  // Touch / Mouse drag handlers
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
    if (dragX > 120) {
      handleVote("YES");
    } else if (dragX < -120) {
      handleVote("NO");
    } else {
      setDragX(0);
    }
  }

  // Keyboard support
  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowRight") handleVote("YES");
      if (e.key === "ArrowLeft") handleVote("NO");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

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

  // Compute card transform
  const rotation = dragging ? dragX * 0.08 : 0;
  const cardTransform = exitDirection
    ? `translateX(${exitDirection === "right" ? 120 : -120}vw) rotate(${exitDirection === "right" ? 30 : -30}deg)`
    : `translateX(${dragX}px) rotate(${rotation}deg)`;
  const overlayOpacity = Math.min(Math.abs(dragX) / 120, 1);
  const overlayColor = dragX > 0 ? "rgba(74,222,128,0.35)" : "rgba(248,113,113,0.35)";
  const overlayText = dragX > 30 ? "YES" : dragX < -30 ? "NO" : "";

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", padding: "20px 20px 40px", overflow: "hidden" }}>
      {/* Top bar */}
      <div style={{ maxWidth: 500, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: "bold", color: "white" }}>
          Espace Jury
        </h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Déconnexion
        </button>
      </div>

      {/* Progress */}
      <div style={{ maxWidth: 500, margin: "0 auto 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: "#9ca3af" }}>
          <span>{evaluations.length} voté{evaluations.length > 1 ? "s" : ""}</span>
          <span>{films.length} restant{films.length > 1 ? "s" : ""}</span>
        </div>
        <div style={{ height: 4, background: "#1f2937", borderRadius: 2, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${evaluations.length / Math.max(evaluations.length + films.length, 1) * 100}%`,
              background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
              borderRadius: 2,
              transition: "width 0.5s ease",
            }}
          />
        </div>
      </div>

      {/* Card area */}
      <div style={{ maxWidth: 500, margin: "0 auto", position: "relative", minHeight: 420 }}>
        {currentFilm ? (
          <>
            {/* Swipe card */}
            <div
              ref={cardRef}
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

              {/* Film content */}
              <div style={{ position: "relative", zIndex: 1, padding: 28 }}>
                {/* Film number badge */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div style={{
                    padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                    background: "rgba(139,92,246,0.2)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.3)",
                  }}>
                    Film {evaluations.length + 1} / {evaluations.length + films.length}
                  </div>
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
                  {currentFilm.language && (
                    <span style={styles.tag}>{currentFilm.language}</span>
                  )}
                  {currentFilm.duration && (
                    <span style={styles.tag}>{currentFilm.duration}s</span>
                  )}
                  {currentFilm.user && (
                    <span style={styles.tag}>{currentFilm.user.first_name} {currentFilm.user.last_name}</span>
                  )}
                </div>

                {currentFilm.synopsis && (
                  <p style={{ color: "#d1d5db", fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
                    {currentFilm.synopsis}
                  </p>
                )}

                {/* Comment input */}
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
            <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 24 }}>
              <button
                onClick={() => handleVote("NO")}
                disabled={submitting}
                style={styles.noBtn}
                onMouseEnter={(e) => { e.target.style.transform = "scale(1.1)"; e.target.style.boxShadow = "0 0 30px rgba(239,68,68,0.4)"; }}
                onMouseLeave={(e) => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "none"; }}
              >
                <span style={{ fontSize: 32 }}>✕</span>
                <span style={{ fontSize: 11, letterSpacing: 2 }}>NO</span>
              </button>

              <button
                onClick={() => handleVote("YES")}
                disabled={submitting}
                style={styles.yesBtn}
                onMouseEnter={(e) => { e.target.style.transform = "scale(1.1)"; e.target.style.boxShadow = "0 0 30px rgba(34,197,94,0.4)"; }}
                onMouseLeave={(e) => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "none"; }}
              >
                <span style={{ fontSize: 32 }}>♥</span>
                <span style={{ fontSize: 11, letterSpacing: 2 }}>YES</span>
              </button>
            </div>

            {/* Hint */}
            <p style={{ textAlign: "center", color: "#4b5563", fontSize: 12, marginTop: 16 }}>
              Glissez la carte ou utilisez ← →
            </p>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: 60, border: "1px solid #1f2937", borderRadius: 20, background: "#111" }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🎬</p>
            <p style={{ color: "white", fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
              Tous les films ont été évalués !
            </p>
            <p style={{ color: "#6b7280", fontSize: 15 }}>
              Merci pour vos {evaluations.length} vote{evaluations.length > 1 ? "s" : ""}.
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
            {evaluations.slice(-10).reverse().map((ev) => (
              <div
                key={ev.id}
                style={{
                  padding: "6px 14px",
                  borderRadius: 20,
                  fontSize: 13,
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
    minHeight: "100vh",
    background: "#0a0a0a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutBtn: {
    padding: "6px 14px",
    background: "transparent",
    border: "1px solid #374151",
    borderRadius: 8,
    color: "#6b7280",
    cursor: "pointer",
    fontSize: 13,
  },
  card: {
    position: "relative",
    borderRadius: 20,
    background: "linear-gradient(145deg, #111 0%, #1a1a2e 100%)",
    border: "1px solid #2d2d44",
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
  },
  tag: {
    padding: "4px 10px",
    borderRadius: 6,
    fontSize: 12,
    background: "rgba(255,255,255,0.06)",
    color: "#9ca3af",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  textarea: {
    width: "100%",
    padding: 12,
    background: "rgba(0,0,0,0.3)",
    border: "1px solid #374151",
    borderRadius: 10,
    color: "white",
    fontSize: 14,
    resize: "none",
    outline: "none",
    boxSizing: "border-box",
  },
  noBtn: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    border: "2px solid #ef4444",
    background: "rgba(239,68,68,0.1)",
    color: "#ef4444",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
    gap: 2,
  },
  yesBtn: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    border: "2px solid #22c55e",
    background: "rgba(34,197,94,0.1)",
    color: "#22c55e",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
    gap: 2,
  },
};

export default JuryVote;
