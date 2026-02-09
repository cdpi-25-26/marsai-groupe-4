import { Trophy, Sparkles } from "lucide-react";

export default function Palmares() {

  // 👉 AUTOMATIC DATE
  const today = new Date();
  const formattedDate = today
    .toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();

  const topWinners = [
    { place: 2, title: "CODE QUANTIQUE", studio: "Dystopia", prize: "PRIX DES HACKERS" },
    { place: 1, title: "LE DERNIER HUMAIN", studio: "Ethereal", prize: "GRAND PRIX" },
    { place: 3, title: "MÉMOIRES VIRTUELLES", studio: "Dystopia", prize: "PRIX DE L'INNOVATION" },
  ];

  const specialMentions = [
    "PRIX DE L'INNOVATION TECHNOLOGIQUE",
    "PRIX DU PUBLIC",
    "MEILLEURE DIRECTION ARTISTIQUE",
    "MEILLEUR SCÉNARIO ORIGINAL",
    "BRILLANCE NARRATIVE",
    "PRIX COUP DE CŒUR DU JURY",
  ];

  const allWinners = [
    "LE DERNIER HUMAIN",
    "CODE QUANTIQUE",
    "MÉMOIRES VIRTUELLES",
    "NEURAL ODYSSEY",
    "PIXEL PERFECT",
    "RÊVES SYNTHÉTIQUES",
    "ALGORITHMES D'AMOUR",
    "LEVEL NUMÉRIQUE",
  ];

  return (
    <div className="bg-black text-white min-h-screen px-6">

      {/* HERO */}
      <section className="text-center py-20">
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-400 text-black p-4 rounded-2xl shadow-lg">
            <Trophy size={32} />
          </div>
        </div>

        <h1 className="text-5xl font-bold tracking-wide">PALMARÈS</h1>
        <p className="text-gray-400 mt-3 tracking-widest text-sm">
          FESTIVAL MARSAI — ÉDITION INAUGURALE
        </p>

        {/* ✅ AUTOMATIC DATE */}
        <p className="text-yellow-400 mt-2 font-semibold">{formattedDate}</p>

        <div className="flex justify-center gap-16 mt-10 text-center">
          <div>
            <p className="text-3xl font-bold">247</p>
            <p className="text-gray-500 text-sm">FILMS SOUMIS</p>
          </div>
          <div>
            <p className="text-3xl font-bold">23</p>
            <p className="text-gray-500 text-sm">LAURÉATS</p>
          </div>
          <div>
            <p className="text-3xl font-bold">42K</p>
            <p className="text-gray-500 text-sm">SPECTATEURS</p>
          </div>
        </div>
      </section>

      {/* TOP 3 */}
      <section className="max-w-6xl mx-auto mb-24">
        <h2 className="text-xl mb-8 font-semibold">🏆 GAGNANTS</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {topWinners.map((film) => (
            <div
              key={film.title}
              className={`bg-white/5 p-6 rounded-3xl border border-white/10 transition hover:scale-105 ${
                film.place === 1
                  ? "ring-2 ring-yellow-400 shadow-yellow-400/30 shadow-lg"
                  : ""
              }`}
            >
              <div className="text-yellow-400 font-bold text-xl mb-2">
                #{film.place}
              </div>

              <div className="h-40 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl mb-4"></div>

              <h3 className="text-lg font-bold">{film.title}</h3>
              <p className="text-gray-400 text-sm">{film.studio}</p>
              <p className="text-pink-400 text-sm mt-2">{film.prize}</p>

              <button className="mt-4 text-sm underline hover:text-pink-400">
                VOIR LE FILM →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SPECIAL MENTIONS */}
      <section className="max-w-6xl mx-auto mb-24">
        <h2 className="text-3xl font-bold text-center mb-12 text-purple-400 flex items-center justify-center gap-3">
          <Sparkles className="text-pink-400" /> MENTIONS SPÉCIALES
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {specialMentions.map((title) => (
            <div
              key={title}
              className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:scale-105 transition"
            >
              <div className="h-36 bg-gradient-to-br from-pink-500 to-indigo-500 rounded-xl mb-4"></div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-gray-400 text-sm mt-2">
                Description courte du prix attribué à cette œuvre.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ALL WINNERS */}
      <section className="max-w-6xl mx-auto mb-32">
        <h2 className="text-3xl font-bold text-center mb-12">
          TOUS LES LAURÉATS
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          {allWinners.map((film, i) => (
            <div
              key={i}
              className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:scale-105 transition"
            >
              <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-3"></div>
              <h3 className="font-semibold text-sm">{film}</h3>
              <p className="text-gray-400 text-xs">Catégorie</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
