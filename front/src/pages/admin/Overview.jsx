import { useQuery } from "@tanstack/react-query";
import { getStats } from "../../api/overview.js";
import { Users, Video, Clapperboard, User } from "lucide-react";

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className={`rounded-xl p-3 ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold text-card-foreground">{value}</p>
      </div>
    </div>
  );
}

function Overview() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["overview"],
    queryFn: getStats,
  });

  const formatCompact = (number) => {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(number);
};



let test = 100000;
let test2 = 1000000;
let test3 = 10000

  if (isPending) {
    return (
      <div className="p-6 text-muted-foreground animate-pulse">Chargement en cours...</div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-destructive">Une erreur est survenue : {error.message}</div>
    );
  }

  const stats = data.data;
  console.log(stats)

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-sm text-muted-foreground mt-1">Vue d'ensemble de la plateforme</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Total Utilisateurs" value={stats.totalUsers} color="bg-blue-500" />
        <StatCard icon={Video} label={`Total Vidéos${stats.date ? ` — ${stats.date}` : ""}`} value={stats.totalVideos} color="bg-purple-500" />
        <StatCard icon={Clapperboard} label="Réalisateurs actifs" value={stats.producerCount} color="bg-pink-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent users */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Utilisateurs récents</h2>
          {stats.recentUsers && stats.recentUsers.length > 0 ? (
            <div className="space-y-3">
              {stats.recentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 font-bold text-sm shrink-0">
                    {user.first_name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{user.first_name} {user.last_name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Aucun utilisateur trouvé.</p>
          )}
        </div>

        {/* Recent videos */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Vidéos récentes</h2>
          {stats.recentVideos && stats.recentVideos.length > 0 ? (
            <div className="space-y-3">
              {stats.recentVideos.map((video) => (
                <div key={video.id} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-500/20 text-pink-400 shrink-0">
                    <Video size={16} />
                  </div>
                  <p className="font-semibold text-sm text-foreground">{video.title || `Vidéo #${video.id}`}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Aucune vidéo trouvée.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Overview;
