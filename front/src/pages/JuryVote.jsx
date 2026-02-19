import { useEffect, useState } from "react";
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
  const [comments, setComments] = useState({});
  const [submitting, setSubmitting] = useState(null);

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

  function handleVote(filmId, decision) {
    setSubmitting(filmId);
    createEvaluation({
      film_id: filmId,
      decision,
      comment: comments[filmId] || "",
    })
      .then(() => {
        setComments((prev) => ({ ...prev, [filmId]: "" }));
        loadData();
      })
      .catch((err) => alert("Erreur: " + err.message))
      .finally(() => setSubmitting(null));
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p style={{ color: "#9ca3af", fontSize: 18 }}>Chargement des films...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p style={{ color: "#ef4444", fontSize: 18 }}>Erreur: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", padding: "40px 20px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              background: "transparent",
              border: "1px solid #374151",
              borderRadius: 8,
              color: "#9ca3af",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Déconnexion
          </button>
        </div>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: "bold", color: "white", marginBottom: 8 }}>
            Espace Jury
          </h1>
          <p style={{ color: "#9ca3af", fontSize: 16 }}>
            {films.length > 0
              ? `${films.length} film${films.length > 1 ? "s" : ""} à évaluer`
              : "Tous les films ont été évalués"}
          </p>
        </div>

        {/* Already voted section */}
        {evaluations.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ color: "#9ca3af", fontSize: 14, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>
              Vos votes ({evaluations.length})
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {evaluations.map((ev) => (
                <div
                  key={ev.id}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "1px solid",
                    borderColor: ev.decision === "YES" ? "#166534" : "#991b1b",
                    background: ev.decision === "YES" ? "rgba(22,101,52,0.2)" : "rgba(153,27,27,0.2)",
                    color: ev.decision === "YES" ? "#4ade80" : "#f87171",
                    fontSize: 14,
                  }}
                >
                  {ev.film?.title || `Film #${ev.film_id}`} — {ev.decision}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Films to vote */}
        {films.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, border: "1px solid #1f2937", borderRadius: 16, background: "#111" }}>
            <p style={{ color: "#6b7280", fontSize: 18 }}>Vous avez évalué tous les films disponibles.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {films.map((film) => (
              <div
                key={film.id}
                style={{
                  border: "1px solid #1f2937",
                  borderRadius: 16,
                  background: "#111",
                  padding: 24,
                  transition: "border-color 0.2s",
                }}
              >
                {/* Film info */}
                <div style={{ marginBottom: 16 }}>
                  <h3 style={{ fontSize: 20, fontWeight: "bold", color: "white", marginBottom: 4 }}>
                    {film.title}
                  </h3>
                  {film.translated_title && (
                    <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 8 }}>{film.translated_title}</p>
                  )}
                  <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#9ca3af", marginBottom: 12 }}>
                    {film.language && <span>Langue: {film.language}</span>}
                    {film.duration && <span>Durée: {film.duration}s</span>}
                    {film.user && <span>Par: {film.user.first_name} {film.user.last_name}</span>}
                  </div>
                  {film.synopsis && (
                    <p style={{ color: "#d1d5db", fontSize: 15, lineHeight: 1.6 }}>{film.synopsis}</p>
                  )}
                </div>

                {/* Comment */}
                <textarea
                  placeholder="Commentaire (optionnel)"
                  value={comments[film.id] || ""}
                  onChange={(e) => setComments((prev) => ({ ...prev, [film.id]: e.target.value }))}
                  rows={2}
                  style={{
                    width: "100%",
                    padding: 12,
                    background: "#1a1a1a",
                    border: "1px solid #374151",
                    borderRadius: 8,
                    color: "white",
                    fontSize: 14,
                    marginBottom: 16,
                    resize: "vertical",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />

                {/* Vote buttons */}
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={() => handleVote(film.id, "YES")}
                    disabled={submitting === film.id}
                    style={{
                      flex: 1,
                      padding: "14px 24px",
                      background: "rgba(22,101,52,0.3)",
                      border: "2px solid #166534",
                      borderRadius: 10,
                      color: "#4ade80",
                      fontSize: 16,
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      opacity: submitting === film.id ? 0.5 : 1,
                    }}
                  >
                    YES
                  </button>
                  <button
                    onClick={() => handleVote(film.id, "NO")}
                    disabled={submitting === film.id}
                    style={{
                      flex: 1,
                      padding: "14px 24px",
                      background: "rgba(153,27,27,0.3)",
                      border: "2px solid #991b1b",
                      borderRadius: 10,
                      color: "#f87171",
                      fontSize: 16,
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      opacity: submitting === film.id ? 0.5 : 1,
                    }}
                  >
                    NO
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default JuryVote;
