import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ConfirmModal from "@/components/ConfirmModal";

const MAX_SECONDS = 60;
const MAX_FILE_SIZE = 500 * 1024 * 1024;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

const uploadSchema = z.object({
  title: z.string().min(3).max(255),
  translated_title: z.string().max(255).optional(),
  synopsis: z.string().max(2000).optional(),
  language: z.string().max(100).optional(),
  synopsis_en: z.string().max(2000).optional(),
  youtube_link: z.string().url().optional().or(z.literal("")),
  ai_tools: z.string().max(1000).optional(),
  subtitles: z.any()
    .refine((val) => !val || val instanceof File, "Veuillez sélectionner un fichier .srt")
    .refine((val) => !val || val.name.toLowerCase().endsWith(".srt"), "Seul le format .srt est autorisé")
    .optional(),
  thumbnail: z.any()
    .refine((val) => !val || val instanceof File, "Veuillez sélectionner une image")
    .refine((val) => !val || val.size <= MAX_IMAGE_SIZE, "Max 5 Mo")
    .refine((val) => !val || ACCEPTED_IMAGE_TYPES.includes(val.type), "jpg, png, webp, gif")
    .optional(),
  image_2: z.any()
    .refine((val) => !val || val instanceof File, "Veuillez sélectionner une image")
    .refine((val) => !val || val.size <= MAX_IMAGE_SIZE, "Max 5 Mo")
    .refine((val) => !val || ACCEPTED_IMAGE_TYPES.includes(val.type), "jpg, png, webp, gif")
    .optional(),
  image_3: z.any()
    .refine((val) => !val || val instanceof File, "Veuillez sélectionner une image")
    .refine((val) => !val || val.size <= MAX_IMAGE_SIZE, "Max 5 Mo")
    .refine((val) => !val || ACCEPTED_IMAGE_TYPES.includes(val.type), "jpg, png, webp, gif")
    .optional(),
  video: z.any()
    .refine((val) => val instanceof File, "Veuillez sélectionner une vidéo")
    .refine((val) => val.size <= MAX_FILE_SIZE, "Max 500 Mo")
    .refine((val) => ACCEPTED_VIDEO_TYPES.includes(val.type), "MP4, MOV, WebM seulement")
    .refine(async (val) => {
      if (!val || !(val instanceof File)) return true; // ← null → OK (champ optionnel)
      try {
        const duration = await getVideoDuration(val);
        return duration <= MAX_SECONDS;
      } catch {
        return false;
      }
    }, `La vidéo ne doit pas dépasser ${MAX_SECONDS} secondes`),
});

function getVideoDuration(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = url;

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Fichier invalide"));
    };
  });
}

export default function Upload() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempData, setTempData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: "",
      translated_title: "",
      synopsis: "",
      language: "",
      synopsis_en: "",
      youtube_link: "",
      ai_tools: "",
      subtitles: null,
      thumbnail: null,
      image_2: null,
      image_3: null,
      video: null,
    },
  });

  const onSubmit = (data) => {
    setTempData(data);
    setIsModalOpen(true);
  };

  const confirmSubmit = async () => {
    setIsModalOpen(false);
    setLoading(true);
    setServerError(null);

    try {
      const formData = new FormData();
      formData.append("title", tempData.title);
      formData.append("translated_title", tempData.translated_title || "");
      formData.append("synopsis", tempData.synopsis || "");
      formData.append("language", tempData.language || "");
      formData.append("synopsis_en", tempData.synopsis_en || "");
      formData.append("youtube_link", tempData.youtube_link || "");
      formData.append("ai_tools", tempData.ai_tools || "");
      if (tempData.subtitles) formData.append("subtitles", tempData.subtitles);
      if (tempData.thumbnail) formData.append("thumbnail", tempData.thumbnail);
      if (tempData.image_2) formData.append("image_2", tempData.image_2);
      if (tempData.image_3) formData.append("image_3", tempData.image_3);
      formData.append("video", tempData.video);

      const response = await fetch("http://localhost:3000/uploads", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'upload");
      }

      alert("Tout a été envoyé avec succès !");
      reset();
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Upload Vidéo & Images
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Titre *</label>
          <input
            {...register("title")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Titre de la vidéo"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        {/* Titre traduit */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Titre traduit (optionnel)</label>
          <input
            {...register("translated_title")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Translated title"
          />
          {errors.translated_title && <p className="mt-1 text-sm text-red-600">{errors.translated_title.message}</p>}
        </div>

        {/* Synopsis */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Synopsis (optionnel)</label>
          <textarea
            {...register("synopsis")}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Description du film"
          />
          {errors.synopsis && <p className="mt-1 text-sm text-red-600">{errors.synopsis.message}</p>}
        </div>

        {/* Langue */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Langue (optionnel)</label>
          <input
            {...register("language")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Français, Anglais, etc."
          />
          {errors.language && <p className="mt-1 text-sm text-red-600">{errors.language.message}</p>}
        </div>

        {/* Synopsis anglais */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Synopsis en anglais (optionnel)</label>
          <textarea
            {...register("synopsis_en")}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="English synopsis"
          />
          {errors.synopsis_en && <p className="mt-1 text-sm text-red-600">{errors.synopsis_en.message}</p>}
        </div>

        
        {/* Outils IA */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Outils IA (optionnel)</label>
          <textarea
            {...register("ai_tools")}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Midjourney, Runway, Luma, etc."
          />
          {errors.ai_tools && <p className="mt-1 text-sm text-red-600">{errors.ai_tools.message}</p>}
        </div>

        {/* Sous-titres */}
       <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Sous-titres (.srt) (optionnel)
  </label>
  <input
    type="file"
    accept=".srt"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) {
        setValue("subtitles", file, { shouldValidate: true });
      }
    }}
    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition cursor-pointer"
  />
  {errors.subtitles && (
    <p className="mt-1 text-sm text-red-600">{errors.subtitles.message}</p>
  )}
  {watch("subtitles") && (
    <p className="mt-2 text-sm text-green-600">
      Fichier sélectionné : {watch("subtitles").name}
    </p>
  )}
</div>

        {/* Vidéo */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Vidéo *</label>
          <input
            type="file"
            accept={ACCEPTED_VIDEO_TYPES.join(",")}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setValue("video", file, { shouldValidate: true });
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.video && <p className="mt-1 text-sm text-red-600">{errors.video.message}</p>}
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Thumbnail (optionnel)</label>
          <input
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setValue("thumbnail", file, { shouldValidate: true });
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.thumbnail && <p className="mt-1 text-sm text-red-600">{errors.thumbnail.message}</p>}
        </div>

        {/* Image 2 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Image 2 (optionnel)</label>
          <input
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setValue("image_2", file, { shouldValidate: true });
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.image_2 && <p className="mt-1 text-sm text-red-600">{errors.image_2.message}</p>}
        </div>

        {/* Image 3 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Image 3 (optionnel)</label>
          <input
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setValue("image_3", file, { shouldValidate: true });
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.image_3 && <p className="mt-1 text-sm text-red-600">{errors.image_3.message}</p>}
        </div>

        {serverError && <p className="text-red-600 font-medium">{serverError}</p>}

        {serverError && <p className="text-red-600 font-medium text-center">{serverError}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 px-8 rounded-xl text-white font-semibold text-lg transition-all
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg"}`}
        >
          {loading ? "Envoi en cours..." : "Uploader"}
        </button>
      </form>


      <ConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmSubmit}
        data={tempData}
      />
    </div>
  );
}