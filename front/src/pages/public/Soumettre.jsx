import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { filmsApi, authApi } from "../../services/api.js";

export default function Soumettre() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [loginError, setLoginError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  // Film form state
  const [filmData, setFilmData] = useState({
    title: "", original_title: "", translated_title: "", duration: "",
    type: "hybride", language: "", synopsis: "", synopsis_en: "",
    creative_process: "", ai_tools: "", youtube_link: "", rgpd_accepted: false,
  });
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [srtFile, setSrtFile] = useState(null);

  const loginMutation = useMutation({
    mutationFn: async () => {
      const result = await authApi.login(loginData.email, loginData.password);
      return result;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("first_name", data.first_name);
      localStorage.setItem("email", data.email);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data.id);
      if (data.role === "ADMIN") {
        window.location.href = "/admin/films";
        return;
      }
      if (data.role === "JURY") {
        window.location.href = "/jury/mes-films";
        return;
      }
      window.location.reload();
    },
    onError: (err) => setLoginError(err.message),
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      Object.entries(filmData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (videoFile) formData.append("video_file", videoFile);
      if (imageFile) formData.append("thumbnail", imageFile);
      if (srtFile) formData.append("subtitles", srtFile);
      return filmsApi.create(formData);
    },
    onSuccess: () => setSubmitSuccess(true),
    onError: (err) => setSubmitError(err.message),
  });

  if (submitSuccess) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-green-400 mb-4">Film soumis avec succès !</h1>
          <p className="opacity-60 mb-8">Votre film a été enregistré et sera examiné par notre équipe.</p>
          <button onClick={() => navigate("/")} className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">SOUMETTRE MON FILM</h1>
        <p className="opacity-60 mb-8">Inscrivez votre court-métrage IA au festival Mars.A.I</p>

        {!isLoggedIn ? (
          <div className="rounded-xl p-6 mb-8" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <h2 className="text-lg font-semibold mb-4">Connectez-vous pour soumettre</h2>
            {loginError && <p className="text-red-400 text-sm mb-3">{loginError}</p>}
            <div className="space-y-3">
              <input
                type="email" placeholder="Email"
                className="w-full rounded-lg px-4 py-2.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              />
              <input
                type="password" placeholder="Mot de passe"
                className="w-full rounded-lg px-4 py-2.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
              <button
                onClick={() => loginMutation.mutate()}
                disabled={loginMutation.isPending}
                className="w-full bg-purple-600 text-white py-2.5 rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {loginMutation.isPending ? "Connexion..." : "Se connecter"}
              </button>
              <p className="text-sm text-center opacity-40">
                Pas de compte ? <a href="/auth/register" className="text-purple-400 hover:underline">S'inscrire</a>
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); submitMutation.mutate(); }} className="space-y-6">
            {submitError && <p className="text-red-400 text-sm">{submitError}</p>}

            <div className="rounded-xl p-6 space-y-4" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <h2 className="text-lg font-semibold text-white">Informations du film</h2>

              <div>
                <label className="text-sm block mb-1 opacity-60">Titre *</label>
                <input type="text" required className="w-full rounded-lg px-4 py-2.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  value={filmData.title} onChange={(e) => setFilmData({ ...filmData, title: e.target.value })} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm block mb-1 opacity-60">Titre original</label>
                  <input type="text" className="w-full rounded-lg px-4 py-2.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                    value={filmData.original_title} onChange={(e) => setFilmData({ ...filmData, original_title: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm block mb-1 opacity-60">Titre anglais</label>
                  <input type="text" className="w-full rounded-lg px-4 py-2.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                    value={filmData.translated_title} onChange={(e) => setFilmData({ ...filmData, translated_title: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm block mb-1 opacity-60">Durée (sec)</label>
                  <input type="number" className="w-full rounded-lg px-4 py-2.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                    value={filmData.duration} onChange={(e) => setFilmData({ ...filmData, duration: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm block mb-1 opacity-60">Type</label>
                  <select className="w-full rounded-lg px-4 py-2.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                    value={filmData.type} onChange={(e) => setFilmData({ ...filmData, type: e.target.value })}>
                    <option value="hybride">Hybride</option>
                    <option value="total_ia">100% IA</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm block mb-1 opacity-60">Langue</label>
                  <input type="text" className="w-full rounded-lg px-4 py-2.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                    value={filmData.language} onChange={(e) => setFilmData({ ...filmData, language: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="text-sm block mb-1 opacity-60">Synopsis</label>
                <textarea rows={3} className="w-full rounded-lg px-4 py-2.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  value={filmData.synopsis} onChange={(e) => setFilmData({ ...filmData, synopsis: e.target.value })} />
              </div>

              <div>
                <label className="text-sm block mb-1 opacity-60">Synopsis (anglais)</label>
                <textarea rows={3} className="w-full rounded-lg px-4 py-2.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  value={filmData.synopsis_en} onChange={(e) => setFilmData({ ...filmData, synopsis_en: e.target.value })} />
              </div>

              <div>
                <label className="text-sm block mb-1 opacity-60">Processus créatif</label>
                <textarea rows={3} className="w-full rounded-lg px-4 py-2.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  value={filmData.creative_process} onChange={(e) => setFilmData({ ...filmData, creative_process: e.target.value })} />
              </div>

              <div>
                <label className="text-sm block mb-1 opacity-60">Outils IA utilisés</label>
                <textarea rows={2} className="w-full rounded-lg px-4 py-2.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  value={filmData.ai_tools} onChange={(e) => setFilmData({ ...filmData, ai_tools: e.target.value })} />
              </div>

              <div>
                <label className="text-sm block mb-1 opacity-60">URL YouTube</label>
                <input type="url" className="w-full rounded-lg px-4 py-2.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  value={filmData.youtube_link} onChange={(e) => setFilmData({ ...filmData, youtube_link: e.target.value })} />
              </div>
            </div>

            <div className="rounded-xl p-6 space-y-4" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <h2 className="text-lg font-semibold text-white">Fichiers</h2>

              <div>
                <label className="text-sm block mb-1 opacity-60">Vidéo (MP4/MOV, max 300MB)</label>
                <input type="file" accept=".mp4,.mov" className="w-full text-sm opacity-60"
                  onChange={(e) => setVideoFile(e.target.files[0])} />
              </div>

              <div>
                <label className="text-sm block mb-1 opacity-60">Image principale (JPEG/PNG/WebP)</label>
                <input type="file" accept=".jpg,.jpeg,.png,.webp" className="w-full text-sm opacity-60"
                  onChange={(e) => setImageFile(e.target.files[0])} />
              </div>

              <div>
                <label className="text-sm block mb-1 opacity-60">Sous-titres (SRT)</label>
                <input type="file" accept=".srt" className="w-full text-sm opacity-60"
                  onChange={(e) => setSrtFile(e.target.files[0])} />
              </div>
            </div>

            <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1"
                  checked={filmData.rgpd_accepted} onChange={(e) => setFilmData({ ...filmData, rgpd_accepted: e.target.checked })} />
                <span className="text-sm opacity-60">
                  J'accepte que mes données personnelles soient traitées dans le cadre du festival Mars.A.I conformément au RGPD. *
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitMutation.isPending || !filmData.rgpd_accepted}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-semibold"
            >
              {submitMutation.isPending ? "Envoi en cours..." : "SOUMETTRE MON FILM"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
