import { useQuery } from "@tanstack/react-query";
import { getStats } from "../../api/overview.js";

function Overview() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["overview"],
    queryFn: getStats,
  });

  if (isPending) {
    return <div className="p-8 text-white/60">Chargement en cours...</div>;
  }

  if (isError) {
    return <div className="p-8 text-red-400">Une erreur est survenue : {error.message}</div>;
  }

  const stats = data.data;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Tableau de bord - Vue d'ensemble</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-gray-900 border border-white/10 rounded-xl p-5">
          <h3 className="text-white/60 text-sm font-medium">Total Utilisateurs</h3>
          <p className="text-3xl font-bold text-white mt-1">{stats.totalUsers}</p>
        </div>
        <div className="bg-gray-900 border border-white/10 rounded-xl p-5">
          <h3 className="text-white/60 text-sm font-medium">Total Vidéos</h3>
          <p className="text-3xl font-bold text-white mt-1">{stats.totalVideos}</p>
        </div>
        <div className="bg-gray-900 border border-white/10 rounded-xl p-5">
          <h3 className="text-white/60 text-sm font-medium">Comptes Réalisateur actifs</h3>
          <p className="text-3xl font-bold text-white mt-1">{stats.producerCount}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Utilisateurs récents</h2>
        {stats.recentUsers && stats.recentUsers.length > 0 ? (
          <div className="space-y-2">
            {stats.recentUsers.map((user) => (
              <div key={user.id} className="bg-gray-900 border border-white/10 rounded-lg p-3">
                <strong className="text-white">{user.first_name} {user.last_name}</strong>
                <p className="text-white/50 text-sm mt-0.5">{user.email}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/40">Aucun utilisateur trouvé.</p>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Vidéos récentes</h2>
        {stats.recentVideos && stats.recentVideos.length > 0 ? (
          <div className="space-y-2">
            {stats.recentVideos.map((video) => (
              <div key={video.id} className="bg-gray-900 border border-white/10 rounded-lg p-3">
                <strong className="text-white">{video.title || `Video #${video.id}`}</strong>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/40">Aucune vidéo trouvée.</p>
        )}
      </div>
    </div>
  );
}

export default Overview;
