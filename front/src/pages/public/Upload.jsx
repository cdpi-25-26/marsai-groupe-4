import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const MAX_SECONDS = 60;
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 Mo
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 Mo
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

const uploadSchema = z.object({
  title: z
    .string()
    .min(3, "Le titre doit faire au moins 3 caractères")
    .max(255, "Le titre est trop long (max 255 caractères)"),
  translated_title: z
    .string()
    .max(255, "Le titre traduit est trop long")
    .optional(),
  synopsis: z
    .string()
    .max(2000, "Le synopsis est trop long (max 2000 caractères)")
    .optional(),
  language: z.string().max(100, "La langue est trop longue").optional(),
  synopsis_en: z
    .string()
    .max(2000, "Le synopsis en anglais est trop long")
    .optional(),
  youtube_link: z
    .string()
    .url("Lien YouTube invalide")
    .optional()
    .or(z.literal("")),
  ai_tools: z.string().max(1000, "Les outils IA sont trop longs").optional(),
  subtitles: z.string().max(2000, "Les sous-titres sont trop longs").optional(),
  thumbnail: z
    .any()
    .refine(
      (val) => !val || val instanceof File,
      "Veuillez sélectionner une image pour le thumbnail",
    )
    .refine(
      (val) => !val || val.size <= MAX_IMAGE_SIZE,
      "Thumbnail trop lourd (max 5 Mo)",
    )
    .refine(
      (val) =>
        !val ||
        ACCEPTED_IMAGE_TYPES.includes(val.type),
      "Format thumbnail non autorisé (jpg, png, webp, gif)",
    )
    .optional(),
  image_2: z
    .any()
    .refine(
      (val) => !val || val instanceof File,
      "Veuillez sélectionner une image",
    )
    .refine(
      (val) => !val || val.size <= MAX_IMAGE_SIZE,
      "Image 2 trop lourde (max 5 Mo)",
    )
    .refine(
      (val) =>
        !val ||
        ACCEPTED_IMAGE_TYPES.includes(val.type),
      "Format image 2 non autorisé",
    )
    .optional(),
  image_3: z
    .any()
    .refine(
      (val) => !val || val instanceof File,
      "Veuillez sélectionner une image",
    )
    .refine(
      (val) => !val || val.size <= MAX_IMAGE_SIZE,
      "Image 3 trop lourde (max 5 Mo)",
    )
    .refine(
      (val) =>
        !val ||
        ACCEPTED_IMAGE_TYPES.includes(val.type),
      "Format image 3 non autorisé",
    )
    .optional(),
  video: z
    .any()
    .refine((val) => val instanceof File, "Veuillez sélectionner une vidéo")
    .refine(
      (val) => val.size <= MAX_FILE_SIZE,
      "La vidéo ne doit pas dépasser 500 Mo",
    )
    .refine(
      (val) => ACCEPTED_VIDEO_TYPES.includes(val.type),
      "Format non autorisé (MP4, MOV, WebM seulement)",
    )
    .refine(async (val) => {
      if (!(val instanceof File)) return false;
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
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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
      subtitles: "",
      thumbnail: null,
      image_2: null,
      image_3: null,
      video: null,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError(null);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("translated_title", data.translated_title || "");
      formData.append("synopsis", data.synopsis || "");
      formData.append("language", data.language || "");
      formData.append("synopsis_en", data.synopsis_en || "");
      formData.append("youtube_link", data.youtube_link || "");
      formData.append("ai_tools", data.ai_tools || "");
      formData.append("subtitles", data.subtitles || "");
      if (data.thumbnail) formData.append("thumbnail", data.thumbnail);
      if (data.image_2) formData.append("image_2", data.image_2);
      if (data.image_3) formData.append("image_3", data.image_3);
      formData.append("video", data.video);

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

      alert("Vidéo uploadée avec succès !");
      reset();
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-2xl space-y-8">
      <h2 className="text-3xl font-bold text-gray-900 text-center">Upload Vidéo</h2>

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
          <label className="block text-sm font-medium text-gray-700">Sous-titres (optionnel)</label>
          <textarea
            {...register("subtitles")}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Sous-titres ou notes supplémentaires"
          />
          {errors.subtitles && <p className="mt-1 text-sm text-red-600">{errors.subtitles.message}</p>}
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

        <button type="submit" disabled={loading}>
          {loading ? "Envoi en cours..." : "Uploader"}
        </button>
      </form>
    </div>
  );
}