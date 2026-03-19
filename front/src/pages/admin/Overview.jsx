import { useQuery } from "@tanstack/react-query";
import { getStats } from "../../api/overview.js";
import {User, Video} from 'lucide-react';

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
    return <div>Chargement en cours...</div>;
  }

  if (isError) {
    return <div>Une erreur est survenue : {error.message}</div>;
  }

  const stats = data.data;
  console.log(stats)

  return (
    <div className="p-5">
      <h1 className="font-bold uppercase text-[38px] mb-6 text-gray-300 tracking-[2px]">
        Tableau de bord - Vue d'ensemble
      </h1>

      <div className="flex flex-col mb-[-10px]">
        <div className="grid grid-cols-3 w-full bg-gradient-to-r from-gray-300 via-rose-500 to-gray-600 font-bold text-[100px] bg-clip-text text-transparent">
          <div>
            <h3 className="text-[16px] mb-[-30px] font-bold uppercase text-gray-350 tracking-[1.4px]">
              Total Utilisateurs
            </h3>
            <p className="">{formatCompact(stats.totalUsers)}</p>
          </div>

          <div>
            <h3 className="text-[16px] mb-[-30px] font-bold uppercase text-gray-350 tracking-[1.4px]">
              Total Vidéos Edition: {stats.date}
            </h3>
            <p className="">{formatCompact(stats.totalVideos)}</p>
          </div>

          <div>
            <h3 className="text-[16px] mb-[-30px] font- uppercase text-gray-350 tracking-[1.4px]">
              Comptes Réalisateur actifs
            </h3>

            <p className="">{formatCompact(stats.producerCount)}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-[var(--table-title)] uppercase tracking-[2px] text-xl mb-4">Utilisateurs récents</h2>

        {stats.recentUsers && stats.recentUsers.length > 0 ? (
          <div className="grid gap-2.5">
            {stats.recentUsers.map((user) => (
              <div
                key={user.id}
                className="border border-[var(--overwiev-recentUsers-border)] text-[var(--overwiev-recentUsers-primary)] bg-[var(--overwiev-recentUsers-bg)] p-5 rounded-[var(--overwiev-rounded)] flex items-center gap-5"
              >
                <User size={40} className="text-[var(--overwiev-recentUsers-icon)]"/>
                <div>
                  <strong>
                  {user.first_name} {user.last_name}
                </strong>
                <p className="mt-1 text-[var(--overwiev-recentUsers-second-text)]">
                  {user.email}
                </p>
                </div>
                
              </div>
            ))}
          </div>
        ) : (
          <p>Aucun utilisateur trouvé.</p>
        )}
      </div>

      <div>
        <h2 className="text-gray-500 uppercase tracking-[2px] text-xl mb-4">Vidéos récentes</h2>

        {stats.recentVideos && stats.recentVideos.length > 0 ? (
          <div className="grid gap-2.5">
            {stats.recentVideos.map((video) => (
              <div
                key={video.id}
                className="p-2.5 border border-[var(--overwiev-recentUsers-border)] text-[var(--overwiev-recentUsers-primary)] bg-[var(--overwiev-recentUsers-bg)] p-5 rounded-[var(--overwiev-rounded)] flex items-center gap-5"
              >

                <Video size={38} className="text-[var(--overwiev-recentUsers-icon)]"/>
                <div>

                  <strong className="text-[var(--overwiev-recentUsers-icon)]">{video.title || `Video #${video.id}`}</strong>
                </div>
                
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
