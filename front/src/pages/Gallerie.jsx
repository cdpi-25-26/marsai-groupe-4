import React, { useState, useMemo } from "react";
import Icon from '../assets/Gallerie_svg/Icon.svg';
import Globe from '../assets/Gallerie_svg/Globe.svg'


export default function GalerieDesFilmsPage() {
  const [typeIA, setTypeIA] = useState("");
  const [pays, setPays] = useState("");
  const [statut, setStatut] = useState("");
  const [page, setPage] = useState(1);

  const films = useMemo(
    () => [
      {
        id: 1,
        title: "NEURAL ODYSSEY",
        category: "ART NUMÉRIQUE",
        ai: "CHATGPT",
        rank: "#3",
        director: "Nom du réalisateur",
        origin: "Pays",
      },
      {
        id: 2,
        title: "NEURAL ODYSSEY",
        category: "ART NUMÉRIQUE",
        ai: "CHATGPT",
        rank: "#3",
        director: "Nom du réalisateur",
        origin: "Pays",
      },
      {
        id: 3,
        title: "NEURAL ODYSSEY",
        category: "ART NUMÉRIQUE",
        ai: "CHATGPT",
        rank: "#3",
        director: "Nom du réalisateur",
        origin: "Pays",
      },
      {
        id: 4,
        title: "NEURAL ODYSSEY",
        category: "ART NUMÉRIQUE",
        ai: "CHATGPT",
        rank: "#3",
        director: "Nom du réalisateur",
        origin: "Pays",
      },
      {
        id: 5,
        title: "NEURAL ODYSSEY",
        category: "ART NUMÉRIQUE",
        ai: "CHATGPT",
        rank: "#3",
        director: "Nom du réalisateur",
        origin: "Pays",
      },
      {
        id: 6,
        title: "NEURAL ODYSSEY",
        category: "ART NUMÉRIQUE",
        ai: "CHATGPT",
        rank: "#3",
        director: "Nom du réalisateur",
        origin: "Pays",
      },
    ],
    []
  );

  const pageSize = 6;
  const totalPages = 2;

  const visibleFilms = useMemo(() => {
    const start = (page - 1) * pageSize;
    return films.slice(start, start + pageSize);
  }, [films, page]);

  return (
    <div className="min-h-screen bg-black text-white font-sans p-4">
      {/* Header */}

      {/* Title */}
      <main className="mx-auto max-w-[1180px] px-6 pb-10 pt-10">
        <section className="mb-8">
          <h1 className="m-0 text-[56px] leading-[0.95] font-black tracking-[-1.5px]">
            LA GALERIE <br />
            DES {" "}
            <span className="bg-gradient-to-r from-[#ff4fd8] to-[#7b2cff] bg-clip-text text-transparent">FILMS</span>
          </h1>
        </section>

        {/* Filters */}
        <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <select className="rounded-2xl px-4 py-4 pr-10 text-sm font-bold text-white outline-none bg-gradient-to-r from-[#7b2cff] to-[#FF2B7F]" value={typeIA} onChange={(e) => setTypeIA(e.target.value)}>
            <option value="">Type d’IA</option>
            <option value="CHATGPT">CHATGPT</option>
            <option value="Midjourney">Midjourney</option>
            <option value="Runway">Runway</option>
          </select>

          <select className="rounded-2xl px-4 py-4 pr-10 text-sm font-bold text-white outline-none bg-gradient-to-r from-[#7b2cff] to-[#FF2B7F]" value={pays} onChange={(e) => setPays(e.target.value)}>
            <option value="">Pays d’origine</option>
            <option value="France">France</option>
            <option value="USA">USA</option>
          </select>

          <select className="rounded-2xl px-4 py-4 pr-10 text-sm font-bold text-white outline-none bg-gradient-to-r from-[#7b2cff] to-[#FF2B7F]" value={statut} onChange={(e) => setStatut(e.target.value)}>
            <option value="">Statut</option>
            <option value="published">Publié</option>
            <option value="pending">En attente</option>
          </select>
        </section>

        {/* Gallery */}
      <section className="grid grid-cols-1 gap-20 md:grid-cols-2 lg:grid-cols-3">
  {visibleFilms.map((film) => (
    <div key={film.id} className="w-full">
      
      <article className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/5 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
        <div className="flex justify-between items-start p-4">
          <div className="flex flex-col gap-2">
            <span className="inline-flex rounded-full border border-purple-500/50 bg-purple-600/30 px-4 py-2 text-[10px] font-black tracking-wide">
              {film.category}
            </span>

            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-black tracking-wide text-white/90">
              {film.ai}
            </span>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2">
            <img src={Icon} alt="Icon" className="h-4 w-4" />
            <span className="font-black text-white">{film.rank}</span>
          </span>
        </div>

        <div className="aspect-[3/4] w-full" />
      </article>

      <div className="mt-6">
        <h2 className="text-2xl font-extrabold tracking-widest text-white">
          {film.title}
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-10">
          <div>
            <div className="text-[12px] font-black tracking-widest text-white/50">
              RÉALISATEUR
            </div>
            <div className="mt-3 text-lg font-semibold text-white/90 whitespace-nowrap">
              {film.director}
            </div>
          </div>

         <div className="text-right">
  <div className="text-[12px] font-black tracking-widest text-white/50">
    ORIGINE
  </div>

  <div className="mt-3 flex items-center justify-end gap-2 text-xl font-semibold text-white/90">
    <img src={Globe} alt="Globe" className="h-4 w-4 opacity-80" />
    <span>{film.origin}</span>
  </div>
</div>

        </div>
      </div>
    </div>
  ))}
</section>


        {/* Pagination */}
     <section className="mt-12 flex flex-col items-center gap-4">
  {/* ПАНЕЛЬ ПАГИНАЦИИ */}
  <div className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
    {/* PREV */}
    <button
      onClick={() => setPage((p) => Math.max(1, p - 1))}
      className="grid h-9 w-9 place-items-center rounded-xl text-black/70 transition hover:bg-black/5 disabled:opacity-40"
      disabled={page === 1}
    >
      ‹
    </button>

    {/* PAGE 1 */}
    <button
      onClick={() => setPage(1)}
      className={`grid h-9 w-9 place-items-center rounded-xl text-sm font-black transition
        ${page === 1 ? "bg-[#7b2cff] text-white" : "text-black/70 hover:bg-black/5"}`}
    >
      1
    </button>

    {/* PAGE 2 */}
    <button
      onClick={() => setPage(2)}
      className={`grid h-9 w-9 place-items-center rounded-xl text-sm font-black transition
        ${page === 2 ? "bg-[#7b2cff] text-white" : "text-black/70 hover:bg-black/5"}`}
    >
      2
    </button>

    {/* NEXT */}
    <button
      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
      className="grid h-9 w-9 place-items-center rounded-xl text-black/70 transition hover:bg-black/5 disabled:opacity-40"
      disabled={page === totalPages}
    >
      ›
    </button>
  </div>

  {/* ТЕКСТ КАК НА СКРИНЕ */}
  <div className="text-[11px] font-black tracking-widest text-white/50">
    PAGE {page} SUR {totalPages} — 12 FILMS TROUVÉS
  </div>
</section>

      </main>
    </div>
  );
}
