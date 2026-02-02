import { useState } from "react";

const MAX_SECONDS = 60; // durée max autorisée

function getVideoDuration(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");

    video.preload = "metadata";
    video.src = url;

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      if (Number.isFinite(video.duration)) {
        resolve(video.duration);
      } else {
        reject(new Error("Durée non lisible"));
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Fichier vidéo invalide"));
    };
  });
}

export default function Upload() {
  const [error, setError] = useState(null);
  const [duration, setDuration] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoFile, setVideoFile] = useState(null);

  async function handleFileChange(e) {
    setError(null);
    setDuration(null);

    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    try {
      const d = await getVideoDuration(selectedFile);

      if (d > MAX_SECONDS) {
        setError(
          `Vidéo trop longue (${Math.ceil(d)}s). Maximum autorisé : ${MAX_SECONDS}s`
        );
        return;
      }

      setDuration(d);
      setVideoFile(selectedFile);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!videoFile) {
      setError("Choisissez une vidéo d'abord");
      return;
    }

    if (!title.trim()) {
      setError("Le titre est obligatoire");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("video", videoFile);

      const response = await fetch("http://localhost:3000/uploads", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'upload");
      }

      alert("Vidéo uploadée avec succès !");
      setTitle("");
      setVideoFile(null);
      setDuration(null);
      e.target.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Upload vidéo (max 1 minute)</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Titre de la vidéo</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Mon court métrage..."
              required
              className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Vidéo (MP4, MOV, WebM)</label>
            <input
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              onChange={handleFileChange}
              required
              className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-white/70 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white file:text-sm file:cursor-pointer"
            />
          </div>

          {duration !== null && (
            <p className="text-green-400 text-sm">
              Durée : {Math.ceil(duration)} secondes (OK)
            </p>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || !videoFile || !title.trim()}
            className="w-full py-2.5 rounded-lg font-medium text-white transition-colors bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-white/40 disabled:cursor-not-allowed"
          >
            {loading ? "Envoi en cours..." : "Uploader la vidéo"}
          </button>
        </form>
      </div>
    </div>
  );
}
