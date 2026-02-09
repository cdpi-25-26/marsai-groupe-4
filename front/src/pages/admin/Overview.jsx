import { useQuery } from "@tanstack/react-query";
import { getStats } from "../../api/overview.js";

function Overview() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["overview"],
    queryFn: getStats,
  });

  if (isPending) {
    return <div>Chargement en cours...</div>;
  }

  if (isError) {
    return <div>Une erreur est survenue : {error.message}</div>;
  }

  const stats = data.data;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Tableau de bord - Vue d'ensemble</h1>
      
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", flex: 1 }}>
          <h3>Total Utilisateurs</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{stats.totalUsers}</p>
        </div>
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", flex: 1 }}>
          <h3>Total Vidéos</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{stats.totalVideos}</p>
        </div>
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", flex: 1 }}>
          <h3>Comptes Réalisateur actifs</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{stats.producerCount}</p>
        </div>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h2>Utilisateurs récents</h2>
        {stats.recentUsers && stats.recentUsers.length > 0 ? (
          <div style={{ display: "grid", gap: "10px" }}>
            {stats.recentUsers.map((user) => (
              <div key={user.id} style={{ padding: "10px", border: "1px solid #eee", borderRadius: "4px" }}>
                <strong>{user.first_name} {user.last_name}</strong>
                <p style={{ margin: "5px 0 0 0", color: "#666" }}>{user.email}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucun utilisateur trouvé.</p>
        )}
      </div>

      <div>
        <h2>Vidéos récentes</h2>
        {stats.recentVideos && stats.recentVideos.length > 0 ? (
          <div style={{ display: "grid", gap: "10px" }}>
            {stats.recentVideos.map((video) => (
              <div key={video.id} style={{ padding: "10px", border: "1px solid #eee", borderRadius: "4px" }}>
                <strong>{video.title || `Video #${video.id}`}</strong>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucune vidéo trouvée.</p>
        )}
      </div>
    </div>
  );
}

export default Overview;