import { useQuery } from "@tanstack/react-query";
import { awardsApi } from "../../services/api.js";

const API_URL = "http://localhost:3000";

export default function Palmares() {
  const { data: awards, isLoading } = useQuery({
    queryKey: ["awards"],
    queryFn: awardsApi.getAll,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2">PALMARÈS</h1>
        <p className="opacity-60 mb-12">Les lauréats du festival Mars.A.I</p>

        {(!awards || awards.length === 0) ? (
          <p className="opacity-40 text-center py-20">Le palmarès sera annoncé prochainement.</p>
        ) : (
          <div className="space-y-8">
            {awards.map((award) => (
              <div key={award.id} className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <h2 className="text-xl font-bold text-purple-400 mb-1">{award.name}</h2>
                {award.description && <p className="opacity-50 text-sm mb-4">{award.description}</p>}
                {award.films && award.films.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {award.films.map((film) => (
                      <div key={film.id} className="flex gap-4 rounded-lg p-3" style={{ background: 'var(--bg-card)' }}>
                        <div className="w-24 h-14 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                          {film.thumbnail ? (
                            <img src={`${API_URL}${film.thumbnail}`} alt={film.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-20 text-xs">16:9</div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{film.title}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="opacity-30 text-sm">Aucun lauréat désigné</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
