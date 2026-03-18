import { Trophy, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { fetchAwards } from "../../api/awards";

const UPLOADS_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Palmares() {
  const { t } = useTranslation();
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAwards = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAwards();
        setAwards(data);
      } catch (err) {
        setError(err.message || "Erreur lors du chargement du palmarès");
      } finally {
        setLoading(false);
      }
    };
    loadAwards();
  }, []);

  const getThumbnailUrl = (thumbnail) => {
    if (thumbnail) return `${UPLOADS_BASE}/uploads/images/${thumbnail}`;
    return `${UPLOADS_BASE}/uploads/images/thumbnail-placeholder.png`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-400">Chargement du palmarès...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-red-400">{error}</p>
      </div>
    );
  }

  if (!awards || awards.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-400">Aucun prix attribué pour le moment.</p>
      </div>
    );
  }

  const topWinners = awards.slice(0, 3);
  const otherWinners = awards.slice(3);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-yellow-400 text-black p-4 rounded-2xl">
              <Trophy size={32} />
            </div>
          </div>
          <h1 className="text-5xl font-bold tracking-wide">PALMARÈS</h1>
          <p className="text-yellow-400 mt-2 font-semibold">
            {new Date().toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).toUpperCase()}
          </p>
          <div className="flex justify-center gap-16 mt-10 text-center">
            <div>
              <p className="text-3xl font-bold">{awards.length}</p>
              <p className="text-gray-500 text-sm">{t("palmares.laureat")}</p>
            </div>
          </div>
        </div>

        {/* Top 3 gagnants */}
        {topWinners.length > 0 && (
          <section className="mb-24">
            <h2 className="text-3xl font-bold text-center mb-12">
              🏆 {t("palmares.winners")}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {topWinners.map((award, index) => (
                <div
                  key={award.id}
                  className={`bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm ${
                    index === 0 ? "ring-2 ring-yellow-400 scale-105" : ""
                  } transition-all duration-300 hover:scale-105`}
                >
                  <div className="aspect-video relative overflow-hidden rounded-xl mb-4">
                    <img
                      src={getThumbnailUrl(award.Film?.thumbnail)}
                      alt={award.Film?.title || "Film"}
                      onError={(e) => {
                        e.target.src = `${UPLOADS_BASE}/uploads/images/thumbnail-placeholder.png`;
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>

                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-xl line-clamp-2">
                      {award.Film?.title || "Sans titre"}
                    </h3>
                    <Trophy className="h-8 w-8 text-yellow-400 flex-shrink-0 mt-1" />
                  </div>

                  <p className="text-pink-400 font-semibold text-lg mb-2">
                    {award.prize || "Prix spécial"}
                  </p>

                  {award.description && (
                    <p className="text-gray-300 text-sm line-clamp-3">
                      {award.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Mentions honorables */}
        {otherWinners.length > 0 && (
          <section className="mb-24">
            <h2 className="text-3xl font-bold text-center mb-12 text-purple-400 flex items-center justify-center gap-3">
              <Sparkles className="text-pink-400" /> {t("palmares.honorable_mention")}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {otherWinners.map((award) => (
                <div
                  key={award.id}
                  className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-pink-500/50 transition-all duration-300"
                >
                  <div className="aspect-video relative overflow-hidden rounded-xl mb-4">
                    <img
                      src={getThumbnailUrl(award.Film?.thumbnail)}
                      alt={award.Film?.title || "Film"}
                      onError={(e) => {
                        e.target.src = `${UPLOADS_BASE}/uploads/images/thumbnail-placeholder.png`;
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  <h3 className="font-semibold text-base line-clamp-2 mb-2">
                    {award.Film?.title || "Sans titre"}
                  </h3>

                  <p className="text-pink-400 text-sm font-medium">
                    {award.prize || "Prix spécial"}
                  </p>

                  {award.description && (
                    <p className="text-gray-400 text-xs mt-2 line-clamp-2">
                      {award.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
