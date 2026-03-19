import { useEffect, useState } from "react";
import instance from "../../api/config.js";

const PHASES = [
  {
    key: "phase1",
    label: "Phase 1 — Soumissions",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.12)",
    desc: "Les producteurs soumettent leurs films. Le jury évalue et vote.",
  },
  {
    key: "phase2",
    label: "Phase 2 — Sélection finale",
    color: "#a855f7",
    bg: "rgba(168,85,247,0.12)",
    desc: "Les 50 meilleurs films (par votes YES) sont promus. Attribution des prix.",
  },
  {
    key: "phase3",
    label: "Phase 3 — Palmarès",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    desc: "Les prix sont attribués. Le palmarès est public.",
  },
];

export default function PhaseManagement() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [promoting, setPromoting] = useState(false);
  const [reverting, setReverting] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => { loadStatus(); }, []);

  async function loadStatus() {
    setLoading(true);
    try {
      const res = await instance.get("phase/status");
      setStatus(res.data);
    } catch {
      setMsg({ type: "error", text: "Erreur de chargement du statut" });
    } finally {
      setLoading(false);
    }
  }

  async function promote() {
    if (!confirm(`Promouvoir les meilleurs films en phase suivante (édition ${status?.currentEdition}) ?`)) return;
    setPromoting(true);
    setMsg(null);
    try {
      const res = await instance.post("phase/promote", { edition_year: status.currentEdition });
      setMsg({ type: "success", text: res.data.message });
      await loadStatus();
    } catch (e) {
      setMsg({ type: "error", text: e.response?.data?.error || "Erreur lors de la promotion" });
    } finally {
      setPromoting(false);
    }
  }

  async function revert() {
    if (!confirm(`Revenir à la phase précédente ? Les prix attribués seront supprimés.`)) return;
    setReverting(true);
    setMsg(null);
    try {
      const res = await instance.post("phase/revert", { edition_year: status.currentEdition });
      setMsg({ type: "success", text: res.data.message });
      await loadStatus();
    } catch (e) {
      setMsg({ type: "error", text: e.response?.data?.error || "Erreur lors du retour en arrière" });
    } finally {
      setReverting(false);
    }
  }

  const s = {
    wrap: { padding: 24 },
    header: { marginBottom: 24 },
    title: { fontSize: 22, fontWeight: 700, marginBottom: 4 },
    sub: { fontSize: 14, color: "#9ca3af" },
    card: { borderRadius: 14, border: "1px solid #1f2937", background: "#111", padding: 20, marginBottom: 12 },
    phaseRow: { display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" },
    dot: (color) => ({ width: 12, height: 12, borderRadius: "50%", background: color, flexShrink: 0 }),
    phaseLabel: { fontWeight: 600, fontSize: 15, color: "white" },
    phaseDesc: { fontSize: 13, color: "#9ca3af", marginTop: 4 },
    count: (color) => ({
      marginLeft: "auto", padding: "2px 12px", borderRadius: 20,
      fontSize: 13, fontWeight: 700, color, border: `1px solid ${color}`,
      background: "rgba(255,255,255,0.04)",
    }),
    activeTag: { padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: "#22c55e", color: "white", marginLeft: 8 },
    btns: { display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" },
    btn: (color, disabled) => ({
      padding: "10px 20px", borderRadius: 10, fontWeight: 600, fontSize: 14,
      border: "none", cursor: disabled ? "not-allowed" : "pointer",
      background: disabled ? "#374151" : color, color: "white", opacity: disabled ? 0.5 : 1,
      transition: "opacity 0.2s",
    }),
    msgBox: (type) => ({
      marginTop: 16, padding: "12px 16px", borderRadius: 10, fontSize: 14,
      background: type === "success" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
      border: `1px solid ${type === "success" ? "#22c55e" : "#ef4444"}`,
      color: type === "success" ? "#4ade80" : "#f87171",
    }),
  };

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <h1 style={s.title}>Gestion des Phases du Concours</h1>
        <p style={s.sub}>
          {loading ? "Chargement..." : status ? `Édition ${status.currentEdition} — ${status.phaseName}` : ""}
        </p>
      </div>

      {!loading && status && (
        <>
          {PHASES.map((phase) => {
            const count = status.phases?.[phase.key] ?? 0;
            const isCurrent = status.currentPhase === phase.key;
            return (
              <div key={phase.key} style={{ ...s.card, ...(isCurrent ? { borderColor: phase.color, background: phase.bg } : {}) }}>
                <div style={s.phaseRow}>
                  <div style={s.dot(phase.color)} />
                  <div>
                    <div style={s.phaseLabel}>
                      {phase.label}
                      {isCurrent && <span style={s.activeTag}>ACTIVE</span>}
                    </div>
                    <div style={s.phaseDesc}>{phase.desc}</div>
                  </div>
                  <div style={s.count(phase.color)}>{count} film{count !== 1 ? "s" : ""}</div>
                </div>
              </div>
            );
          })}

          <div style={s.btns}>
            <button
              style={s.btn("#7c3aed", promoting || status.currentPhase === "phase3")}
              disabled={promoting || status.currentPhase === "phase3"}
              onClick={promote}
            >
              {promoting ? "Promotion en cours..." : "⬆ Promouvoir vers phase suivante"}
            </button>
            <button
              style={s.btn("#6b7280", reverting || status.currentPhase === "phase1" || status.currentPhase === "idle")}
              disabled={reverting || status.currentPhase === "phase1" || status.currentPhase === "idle"}
              onClick={revert}
            >
              {reverting ? "Retour en cours..." : "⬇ Revenir à la phase précédente"}
            </button>
          </div>

          {msg && <div style={s.msgBox(msg.type)}>{msg.text}</div>}
        </>
      )}
    </div>
  );
}
