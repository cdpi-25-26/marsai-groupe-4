import { Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useCallback } from "react";
import { fetchAwards } from "../../api/awards";

export default function Palmares() {
  const { t } = useTranslation();
  const [awards, setAwards] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAwards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAwards();
      setAwards(data);
    } catch (err) {
      setError(err.message);
      setAwards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAwards();
  }, [loadAwards]);

  const today = new Date();
  const formattedDate = today
    .toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();

  if (loading) {
    return <div className="text-white p-20 text-center">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="text-white p-20 text-center">
        <p>Erreur: {error}</p>
        <button 
          onClick={loadAwards} 
          className="mt-4 bg-yellow-400 text-black px-6 py-2 rounded-xl font-bold"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!awards?.length) {
    return <div className="text-white p-20 text-center">Aucune récompense</div>;
  }

  const topWinners = awards.slice(0, 3);

  return (
    <div className="bg-black text-white min-h-screen px-6">
      <section className="text-center py-20">
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-400 text-black p-4 rounded-2xl">
            <Trophy size={32} />
          </div>
        </div>
        <h1 className="text-5xl font-bold tracking-wide">PALMARÈS</h1>
        <p className="text-yellow-400 mt-2 font-semibold">{formattedDate}</p>
      </section>

      <section className="max-w-6xl mx-auto mb-24">
        <h2 className="text-xl mb-8 font-semibold">🏆 {t("palmares.winners")}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {topWinners.map((award, index) => (
            <div
              key={award.id}
              className={`bg-white/5 p-6 rounded-3xl border border-white/10 ${
                index === 0 ? "ring-2 ring-yellow-400" : ""
              }`}
            >
              <div className="text-yellow-400 font-bold text-xl mb-2">#{index + 1}</div>
              <img
                src={`http://localhost:3000/uploads/images|| 'placeholder.jpg'}`}
                alt={award.Film?.title || "Film"}
                onError={(e) => e.target.src = "https://via.placeholder.com/300x200/333/fff?text=FILM"}
                className="h-40 w-full object-cover rounded-xl mb-4"
              />
              <h3 className="text-lg font-bold">{award.Film?.title || "Sans titre"}</h3>
              <p className="text-pink-400 text-sm mt-2">{award.prize}</p>
              <p className="text-gray-400 text-xs mt-2">{award.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto mb-32">
        <h2 className="text-3xl font-bold text-center mb-12">{t("palmares.all_laureat")}</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {awards.map((award) => (
            <div key={award.id} className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <img
                src={`http://localhost:3000/uploads/images || 'placeholder.jpg'}`}
                alt={award.Film?.title || "Film"}
                onError={(e) => e.target.src = "https://via.placeholder.com/200x150/333/fff?text=FILM"}
                className="h-40 w-full object-cover rounded-xl mb-3"
              />
              <h3 className="font-semibold text-sm">{award.Film?.title || "Sans titre"}</h3>
              <p className="text-gray-400 text-xs">{award.prize}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
