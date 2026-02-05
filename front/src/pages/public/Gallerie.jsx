import React, { useState, useMemo } from "react";
import FilmCard from "../../components/FilmCard";

export default function GalerieDesFilmsPage() {
  const [typeIA, setTypeIA] = useState("");
  const [pays, setPays] = useState("");
  const [statut, setStatut] = useState("");
  const [page, setPage] = useState(1);

  const films = useMemo(
    () => [
      { id: 1, title: "NEURAL ODYSSEY", category: "ART NUMÉRIQUE", ai: "CHATGPT", rank: "#3", director: "Nom du réalisateur", origin: "France" },
      { id: 2, title: "NEURAL ODYSSEY", category: "ART NUMÉRIQUE", ai: "Midjourney", rank: "#2", director: "Nom du réalisateur", origin: "USA" },
      { id: 3, title: "NEURAL ODYSSEY", category: "ART NUMÉRIQUE", ai: "Runway", rank: "#1", director: "Nom du réalisateur", origin: "France" },
      { id: 4, title: "NEURAL ODYSSEY", category: "ART NUMÉRIQUE", ai: "CHATGPT", rank: "#3", director: "Nom du réalisateur", origin: "USA" },
      { id: 5, title: "NEURAL ODYSSEY", category: "ART NUMÉRIQUE", ai: "Midjourney", rank: "#4", director: "Nom du réalisateur", origin: "France" },
      { id: 6, title: "NEURAL ODYSSEY", category: "ART NUMÉRIQUE", ai: "Runway", rank: "#5", director: "Nom du réalisateur", origin: "USA" },
    ],
    []
  );

  const pageSize = 6;

  const totalPages = Math.max(1, Math.ceil(films.length / pageSize));

  const visibleFilms = useMemo(() => {
    const start = (page - 1) * pageSize;
    return films.slice(start, start + pageSize);
  }, [films, page]);

  return (
    <div className="min-h-screen bg-black text-white font-sans p-4">
      <main className="mx-auto max-w-[1180px] px-6 pb-10 pt-10">
        {/* Title */}
        <section className="mb-36">
          <h1 className="m-0 text-[56px] leading-[0.95] font-black tracking-[-1.5px]">
            LA GALERIE <br />
            DES{" "}
            <span className="bg-gradient-to-r from-[#ff4fd8] to-[#7b2cff] bg-clip-text text-transparent">
              FILMS
            </span>
          </h1>
        </section>

        {/* Filters */}
        <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <select
            className="rounded-2xl px-4 py-4 pr-10 text-sm font-bold text-white outline-none bg-gradient-to-r from-[#7b2cff] to-[#FF2B7F]"
            value={typeIA}
            onChange={(e) => setTypeIA(e.target.value)}
          >
            <option value="">Type d’IA</option>
            <option value="CHATGPT">CHATGPT</option>
            <option value="Midjourney">Midjourney</option>
            <option value="Runway">Runway</option>
          </select>

          <select
            className="rounded-2xl px-4 py-4 pr-10 text-sm font-bold text-white outline-none bg-gradient-to-r from-[#7b2cff] to-[#FF2B7F]"
            value={pays}
            onChange={(e) => setPays(e.target.value)}
          >
            <option value="">Pays d’origine</option>
            <option value="France">France</option>
            <option value="USA">USA</option>
          </select>

          <select
            className="rounded-2xl px-4 py-4 pr-10 text-sm font-bold text-white outline-none bg-gradient-to-r from-[#7b2cff] to-[#FF2B7F]"
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
          >
            <option value="">Statut</option>
            <option value="published">Publié</option>
            <option value="pending">En attente</option>
          </select>
        </section>

        {/* Gallery */}
        <section className="grid grid-cols-1 gap-20 md:grid-cols-2 lg:grid-cols-3">
          {visibleFilms.map((film) => (
            <FilmCard key={film.id} film={film} />
          ))}
        </section>

        {/* Pagination */}
        <section className="mt-12 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="grid h-9 w-9 place-items-center rounded-xl text-black/70 transition hover:bg-black/5 disabled:opacity-40"
              disabled={page === 1}
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`grid h-9 w-9 place-items-center rounded-xl text-sm font-black transition
                  ${page === n ? "bg-[#7b2cff] text-white" : "text-black/70 hover:bg-black/5"}`}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="grid h-9 w-9 place-items-center rounded-xl text-black/70 transition hover:bg-black/5 disabled:opacity-40"
              disabled={page === totalPages}
            >
              ›
            </button>
          </div>

          <div className="text-[11px] font-black tracking-widest text-white/50">
            PAGE {page} SUR {totalPages} — {films.length} FILMS TROUVÉS
          </div>
        </section>
      </main>
    </div>
  );
}
