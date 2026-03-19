import { useEffect, useState } from "react";
import { Link } from "react-router";
import instance from "../../api/config.js";
import handleLogout from "../../utils/helpers.js";

const STATUS_STYLE = {
  submitted:    { label: "Soumis",      color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  selected:     { label: "Sélectionné", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  under_review: { label: "En révision", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  finalist:     { label: "Finaliste",   color: "#a855f7", bg: "rgba(168,85,247,0.12)" },
  rejected:     { label: "Rejeté",      color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
};

const PHASE_LABEL = { phase1: "Phase 1", phase2: "Phase 2", phase3: "Primé 🏆", rejected: "Rejeté" };

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.submitted;
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
      color: s.color, background: s.bg, border: `1px solid ${s.color}`,
    }}>{s.label}</span>
  );
}

export default function ProducerDashboard() {
  const [films, setFilms] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [profileRes, filmsRes] = await Promise.all([
        instance.get("profile"),
        instance.get("phase/phase1"),
      ]);
      setProfile(profileRes.data);
      const userId = profileRes.data?.id;
      const allFilms = Array.isArray(filmsRes.data) ? filmsRes.data : [];
      setFilms(userId ? allFilms.filter(f => f.user_id === userId || f.producer?.id === userId) : allFilms);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const total = films.length;
  const selected = films.filter(f => f.status === "selected" || f.phase_status === "phase2" || f.phase_status === "phase3").length;
  const rejected = films.filter(f => f.status === "rejected").length;
  const pending = total - selected - rejected;

  const s = {
    page: { minHeight: "100vh", background: "#0a0a0a", padding: "24px 20px 60px", fontFamily: "sans-serif" },
    topBar: { maxWidth: 860, margin: "0 auto 28px", display: "flex", justifyContent: "space-between", alignItems: "center" },
    title: { fontSize: 22, fontWeight: 700, color: "white" },
    sub: { fontSize: 13, color: "#6b7280", marginTop: 2 },
    logoutBtn: { padding: "6px 14px", background: "transparent", border: "1px solid #374151", borderRadius: 8, color: "#6b7280", cursor: "pointer", fontSize: 13 },
    stats: { maxWidth: 860, margin: "0 auto 28px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 },
    statCard: (color) => ({ borderRadius: 14, border: `1px solid ${color}`, background: `rgba(${color === "#22c55e" ? "34,197,94" : color === "#3b82f6" ? "59,130,246" : "239,68,68"},0.08)`, padding: "16px 20px" }),
    statNum: (color) => ({ fontSize: 32, fontWeight: 800, color }),
    statLabel: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
    grid: { maxWidth: 860, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 },
    card: { borderRadius: 16, border: "1px solid #1f2937", background: "#111", overflow: "hidden" },
    cardBody: { padding: 16 },
    cardTitle: { fontSize: 15, fontWeight: 700, color: "white", marginBottom: 6, lineHeight: 1.3 },
    cardSub: { fontSize: 12, color: "#6b7280", fontStyle: "italic", marginBottom: 10 },
    row: { display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginBottom: 10 },
    tag: { padding: "2px 8px", borderRadius: 6, fontSize: 11, background: "rgba(255,255,255,0.06)", color: "#9ca3af" },
    link: { display: "inline-block", marginTop: 8, padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, background: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.3)", textDecoration: "none" },
    empty: { maxWidth: 860, margin: "60px auto", textAlign: "center", color: "#6b7280" },
    uploadLink: { display: "inline-block", marginTop: 16, padding: "10px 24px", borderRadius: 10, background: "#7c3aed", color: "white", fontWeight: 600, fontSize: 14, textDecoration: "none" },
  };

  if (loading) return (
    <div style={s.page}>
      <div style={{ ...s.topBar, justifyContent: "center" }}>
        <p style={{ color: "#9ca3af" }}>Chargement...</p>
      </div>
    </div>
  );

  if (error) return (
    <div style={s.page}>
      <div style={{ ...s.topBar, justifyContent: "center" }}>
        <p style={{ color: "#ef4444" }}>Erreur : {error}</p>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      <div style={s.topBar}>
        <div>
          <div style={s.title}>Mes films</div>
          <div style={s.sub}>Bonjour{profile?.first_name ? ` ${profile.first_name}` : ""} — tableau de bord producteur</div>
        </div>
        <button onClick={handleLogout} style={s.logoutBtn}>Déconnexion</button>
      </div>

      <div style={s.stats}>
        <div style={s.statCard("#3b82f6")}>
          <div style={s.statNum("#3b82f6")}>{total}</div>
          <div style={s.statLabel}>Films soumis</div>
        </div>
        <div style={s.statCard("#22c55e")}>
          <div style={s.statNum("#22c55e")}>{selected}</div>
          <div style={s.statLabel}>Sélectionnés</div>
        </div>
        <div style={s.statCard("#ef4444")}>
          <div style={s.statNum("#ef4444")}>{rejected}</div>
          <div style={s.statLabel}>Rejetés</div>
        </div>
      </div>

      {films.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎬</div>
          <p style={{ fontSize: 18, fontWeight: 600, color: "white" }}>Aucun film soumis</p>
          <p style={{ fontSize: 14, marginTop: 6 }}>Soumettez votre premier film pour participer au festival.</p>
          <Link to="/upload" style={s.uploadLink}>+ Soumettre un film</Link>
        </div>
      ) : (
        <>
          <div style={s.grid}>
            {films.map((film) => (
              <div key={film.id} style={s.card}>
                <div style={s.cardBody}>
                  <div style={s.cardTitle}>{film.title}</div>
                  {film.translated_title && <div style={s.cardSub}>{film.translated_title}</div>}
                  <div style={s.row}>
                    <StatusBadge status={film.status} />
                    {film.phase_status && (
                      <span style={{ ...s.tag, color: film.phase_status === "phase3" ? "#f59e0b" : "#9ca3af" }}>
                        {PHASE_LABEL[film.phase_status] || film.phase_status}
                      </span>
                    )}
                    {film.language && <span style={s.tag}>{film.language}</span>}
                    {film.duration && <span style={s.tag}>{film.duration}</span>}
                  </div>
                  {film.ai_tools && (
                    <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 8 }}>{film.ai_tools}</div>
                  )}
                  <div style={{ fontSize: 11, color: "#4b5563" }}>
                    Soumis le {new Date(film.created_at || film.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                    <Link to={`/films/${film.id}`} style={s.link}>Voir la fiche</Link>
                    {film.youtube_link && (
                      <a href={film.youtube_link} target="_blank" rel="noreferrer" style={{ ...s.link, color: "#f87171", borderColor: "rgba(248,113,113,0.3)", background: "rgba(248,113,113,0.1)" }}>
                        ▶ YouTube
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ maxWidth: 860, margin: "32px auto 0", textAlign: "right" }}>
            <Link to="/upload" style={s.uploadLink}>+ Soumettre un nouveau film</Link>
          </div>
        </>
      )}
    </div>
  );
}
