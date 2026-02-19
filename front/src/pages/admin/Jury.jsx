import { useEffect, useState } from "react";
import {
  getEvaluations,
  getFilmsToEvaluate,
  createEvaluation,
  deleteEvaluation,
} from "../../api/evaluations.js";

function Jury() {
  const [evaluations, setEvaluations] = useState([]);
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [selectedFilm, setSelectedFilm] = useState("");
  const [decision, setDecision] = useState("");
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    setLoading(true);
    Promise.all([
      getEvaluations().then((res) => res.data),
      getFilmsToEvaluate().then((res) => res.data),
    ])
      .then(([evals, filmsData]) => {
        setEvaluations(evals);
        setFilms(filmsData);
        setError(null);
      })
      .catch((err) => {
        console.error("[Jury] error:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!selectedFilm) return alert("Sélectionnez un film");
    if (!decision) return alert("Choisissez YES ou NO");
    createEvaluation({ film_id: Number(selectedFilm), decision, comment })
      .then(() => {
        setShowForm(false);
        setSelectedFilm("");
        setDecision("");
        setComment("");
        loadData();
      })
      .catch((err) => alert("Erreur: " + err.message));
  }

  function handleDelete(id) {
    if (!confirm("Supprimer cette évaluation ?")) return;
    deleteEvaluation(id)
      .then(() => loadData())
      .catch((err) => alert("Erreur: " + err.message));
  }

  const decisionStyle = {
    YES: { background: "#dcfce7", color: "#166534" },
    MAYBE: { background: "#fef9c3", color: "#854d0e" },
    NO: { background: "#fee2e2", color: "#991b1b" },
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Chargement...</div>;
  if (error) return <div style={{ padding: 40, color: "red" }}>Erreur: {error}</div>;

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: "bold" }}>Évaluations du jury</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ padding: "10px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: "bold" }}
        >
          {showForm ? "Annuler" : "Évaluer un film"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: "#f9fafb", padding: 20, borderRadius: 8, marginBottom: 24, border: "1px solid #e5e7eb" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontWeight: 500, marginBottom: 4 }}>Film *</label>
            <select value={selectedFilm} onChange={(e) => setSelectedFilm(e.target.value)} style={{ width: "100%", padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }}>
              <option value="">Sélectionner un film</option>
              {films.map((f) => (
                <option key={f.id} value={f.id}>{f.title}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontWeight: 500, marginBottom: 4 }}>Décision *</label>
            <div style={{ display: "flex", gap: 10 }}>
              {["YES", "NO"].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDecision(d)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 8,
                    border: decision === d ? "2px solid" : "2px solid #e5e7eb",
                    cursor: "pointer",
                    fontWeight: 600,
                    ...decisionStyle[d],
                    opacity: decision === d ? 1 : 0.4,
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontWeight: 500, marginBottom: 4 }}>Commentaire</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} style={{ width: "100%", padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }} />
          </div>
          <button type="submit" style={{ padding: "10px 24px", background: "#2563eb", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: "bold" }}>
            Soumettre
          </button>
        </form>
      )}

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <thead>
          <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
            <th style={{ padding: 12, textAlign: "left" }}>Film</th>
            <th style={{ padding: 12, textAlign: "left" }}>Jury</th>
            <th style={{ padding: 12, textAlign: "left" }}>Décision</th>
            <th style={{ padding: 12, textAlign: "left" }}>Commentaire</th>
            <th style={{ padding: 12, textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {evaluations.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>
                Aucune évaluation.
              </td>
            </tr>
          ) : (
            evaluations.map((ev) => (
              <tr key={ev.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: 12 }}>{ev.film?.title || `Film #${ev.film_id}`}</td>
                <td style={{ padding: 12 }}>{ev.jury ? `${ev.jury.first_name} ${ev.jury.last_name}` : "—"}</td>
                <td style={{ padding: 12 }}>
                  <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 14, fontWeight: 500, ...decisionStyle[ev.decision] }}>
                    {ev.decision}
                  </span>
                </td>
                <td style={{ padding: 12 }}>{ev.comment || "—"}</td>
                <td style={{ padding: 12, textAlign: "right" }}>
                  <button onClick={() => handleDelete(ev.id)} style={{ padding: "6px 14px", background: "#ef4444", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Jury;
