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
    return (
      <div
        className="p-20 text-center"
        style={{ color: "var(--palmares-text)" }}
      >
        Chargement...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="p-20 text-center"
        style={{ color: "var(--palmares-text)" }}
      >
        <p>Erreur: {error}</p>

        <button
          onClick={loadAwards}
          className="mt-4 px-6 py-2 rounded-xl font-bold"
          style={{
            background: "var(--palmares-accent)",
            color: "var(--palmares-accent-text)",
          }}
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!awards?.length) {
    return (
      <div
        className="p-20 text-center"
        style={{ color: "var(--palmares-text)" }}
      >
        Aucune récompense
      </div>
    );
  }

  const topWinners = awards.slice(0, 3);

  return (
    <div
      className="min-h-screen px-6"
      style={{
        background: "var(--palmares-bg)",
        color: "var(--palmares-text)",
      }}
    >

      <section className="text-center py-20">

        <div className="flex justify-center mb-6">

          <div
            className="p-4 rounded-2xl"
            style={{
              background: "var(--palmares-accent)",
              color: "var(--palmares-accent-text)",
            }}
          >
            <Trophy size={32} />
          </div>

        </div>

        <h1 className="text-5xl font-bold tracking-wide">
          PALMARÈS
        </h1>

        <p
          className="mt-2 font-semibold"
          style={{ color: "var(--palmares-accent)" }}
        >
          {formattedDate}
        </p>

      </section>

      <section className="max-w-6xl mx-auto mb-24">

        <h2 className="text-xl mb-8 font-semibold">
          🏆 {t("palmares.winners")}
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {topWinners.map((award, index) => (

            <div
              key={award.id}
              className={`p-6 rounded-3xl border ${
                index === 0 ? "ring-2" : ""
              }`}
              style={{
                background: "var(--palmares-card-bg)",
                borderColor: "var(--palmares-card-border)",
                ringColor: "var(--palmares-accent)",
              }}
            >

              <div
                className="font-bold text-xl mb-2"
                style={{ color: "var(--palmares-accent)" }}
              >
                #{index + 1}
              </div>

              <img
                src={`http://localhost:3000/uploads/images || 'placeholder.jpg'`}
                alt={award.Film?.title || "Film"}
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/300x200/333/fff?text=FILM")
                }
                className="h-40 w-full object-cover rounded-xl mb-4"
              />

              <h3 className="text-lg font-bold">
                {award.Film?.title || "Sans titre"}
              </h3>

              <p
                className="text-sm mt-2"
                style={{ color: "var(--palmares-prize)" }}
              >
                {award.prize}
              </p>

              <p
                className="text-xs mt-2"
                style={{ color: "var(--palmares-text-muted)" }}
              >
                {award.description}
              </p>

            </div>

          ))}

        </div>

      </section>

      <section className="max-w-6xl mx-auto mb-32">

        <h2 className="text-3xl font-bold text-center mb-12">
          {t("palmares.all_laureat")}
        </h2>

        <div className="grid md:grid-cols-4 gap-6">

          {awards.map((award) => (

            <div
              key={award.id}
              className="p-4 rounded-2xl border"
              style={{
                background: "var(--palmares-card-bg)",
                borderColor: "var(--palmares-card-border)",
              }}
            >

              <img
                src={`http://localhost:3000/uploads/images || 'placeholder.jpg'`}
                alt={award.Film?.title || "Film"}
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/200x150/333/fff?text=FILM")
                }
                className="h-40 w-full object-cover rounded-xl mb-3"
              />

              <h3 className="font-semibold text-sm">
                {award.Film?.title || "Sans titre"}
              </h3>

              <p
                className="text-xs"
                style={{ color: "var(--palmares-text-muted)" }}
              >
                {award.prize}
              </p>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}
