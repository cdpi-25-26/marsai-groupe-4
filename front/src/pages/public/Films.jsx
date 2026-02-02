import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { filmsApi } from "../../services/api.js";

const API_URL = "http://localhost:3000";

export default function Films() {
  const { data: films, isLoading } = useQuery({
    queryKey: ["films", "public"],
    queryFn: filmsApi.getPublic,
  });

  const [search, setSearch] = useState("");
  const [type, setType] = useState("Tous");
  const [language, setLanguage] = useState("Toutes");
  const [selectedTags, setSelectedTags] = useState([]);
  const [sort, setSort] = useState("recent");

  const languages = useMemo(() => {
    if (!films) return [];
    const set = new Set(films.map((f) => f.language).filter(Boolean));
    return [...set].sort();
  }, [films]);

  const allTags = useMemo(() => {
    if (!films) return [];
    const map = new Map();
    films.forEach((f) =>
      f.tags?.forEach((t) => map.set(t.id, t.name))
    );
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [films]);

  const filtered = useMemo(() => {
    if (!films) return [];
    return films
      .filter((f) => {
        if (search && !f.title.toLowerCase().includes(search.toLowerCase())) return false;
        if (type === "Hybride" && f.type !== "hybrid") return false;
        if (type === "100% IA" && f.type !== "ai") return false;
        if (language !== "Toutes" && f.language !== language) return false;
        if (selectedTags.length > 0 && !selectedTags.every((tid) => f.tags?.some((t) => t.id === tid))) return false;
        return true;
      })
      .sort((a, b) => {
        switch (sort) {
          case "recent": return new Date(b.createdAt) - new Date(a.createdAt);
          case "oldest": return new Date(a.createdAt) - new Date(b.createdAt);
          case "az": return a.title.localeCompare(b.title);
          case "za": return b.title.localeCompare(a.title);
          default: return 0;
        }
      });
  }, [films, search, type, language, selectedTags, sort]);

  const toggleTag = (id) =>
    setSelectedTags((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2">SÉLECTION OFFICIELLE</h1>
        <p className="opacity-60 mb-8">Films retenus et finalistes du festival Mars.A.I</p>

        {/* Filters */}
        <div className="space-y-4 mb-8">
          {/* Row 1: Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Rechercher un film…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            >
              <option value="recent">Plus récents</option>
              <option value="oldest">Plus anciens</option>
              <option value="az">Titre A-Z</option>
              <option value="za">Titre Z-A</option>
            </select>
          </div>

          {/* Row 2: Type + Language */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex gap-1">
              {["Tous", "Hybride", "100% IA"].map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    type === t
                      ? "bg-purple-600 text-white"
                      : "border hover:border-purple-500/50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            {languages.length > 0 && (
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-lg px-4 py-1.5 text-sm focus:outline-none focus:border-purple-500" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              >
                <option value="Toutes">Toutes les langues</option>
                {languages.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            )}
          </div>

          {/* Row 3: Tags */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {allTags.map(([id, name]) => (
                <button
                  key={id}
                  onClick={() => toggleTag(id)}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                    selectedTags.includes(id)
                      ? "bg-purple-600 text-white"
                      : "bg-white/10 text-white/60 hover:bg-white/20"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Film grid */}
        {filtered.length === 0 ? (
          <p className="opacity-40 text-center py-20">Aucun film ne correspond aux filtres.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((film) => (
              <div key={film.id} className="rounded-xl overflow-hidden hover:border-purple-500/50 transition-all" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div className="aspect-video bg-gray-800 relative">
                  {film.thumbnail ? (
                    <img src={`${API_URL}${film.thumbnail}`} alt={film.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">16:9</div>
                  )}
                  {film.status === "finalist" && (
                    <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">FINALISTE</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{film.title}</h3>
                  <p className="opacity-50 text-sm mt-1">{film.language || ""}</p>
                  {film.tags && film.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {film.tags.map((tag) => (
                        <span key={tag.id} className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded">{tag.name}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
