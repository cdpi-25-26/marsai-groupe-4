import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ConfirmModal from "@/components/ConfirmModal";
import { Sparkles } from "lucide-react";
import { Film } from "lucide-react";
import { CircleCheck } from "lucide-react";
import { Info } from "lucide-react";
import { Image } from "lucide-react";
import { useTranslation} from "react-i18next";
import { useContest } from "../../utils/phasestatus";

const MAX_SECONDS = 60;
const MAX_FILE_SIZE = 500 * 1024 * 1024;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

const uploadSchema = z.object({
  title: z.string().min(3).max(255),
  translated_title: z.string().max(255).optional(),
  synopsis: z.string().max(2000).optional(),
  language: z.string().max(100).optional(),
  synopsis_en: z.string().max(2000).optional(),
  youtube_link: z.string().url().optional().or(z.literal("")),
  ai_tools: z.string().max(1000).optional(),
  subtitles: z
    .any()
    .refine(
      (val) => !val || val instanceof File,
      "Veuillez sélectionner un fichier .srt",
    )
    .refine(
      (val) => !val || val.name.toLowerCase().endsWith(".srt"),
      "Seul le format .srt est autorisé",
    )
    .optional(),
  thumbnail: z
    .any()
    .refine(
      (val) => !val || val instanceof File,
      "Veuillez sélectionner une image",
    )
    .refine((val) => !val || val.size <= MAX_IMAGE_SIZE, "Max 5 Mo")
    .refine(
      (val) => !val || ACCEPTED_IMAGE_TYPES.includes(val.type),
      "jpg, png, webp, gif",
    )
    .optional(),
  image_2: z
    .any()
    .refine(
      (val) => !val || val instanceof File,
      "Veuillez sélectionner une image",
    )
    .refine((val) => !val || val.size <= MAX_IMAGE_SIZE, "Max 5 Mo")
    .refine(
      (val) => !val || ACCEPTED_IMAGE_TYPES.includes(val.type),
      "jpg, png, webp, gif",
    )
    .optional(),
  image_3: z
    .any()
    .refine(
      (val) => !val || val instanceof File,
      "Veuillez sélectionner une image",
    )
    .refine((val) => !val || val.size <= MAX_IMAGE_SIZE, "Max 5 Mo")
    .refine(
      (val) => !val || ACCEPTED_IMAGE_TYPES.includes(val.type),
      "jpg, png, webp, gif",
    )
    .optional(),
  video: z
    .any()
    .refine((val) => val instanceof File, "Veuillez sélectionner une vidéo")
    .refine((val) => val.size <= MAX_FILE_SIZE, "Max 500 Mo")
    .refine(
      (val) => ACCEPTED_VIDEO_TYPES.includes(val.type),
      "MP4, MOV, WebM seulement",
    )
    .refine(async (val) => {
      if (!val || !(val instanceof File)) return true;
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
  const { contestStatus, loading: statusLoading } = useContest();
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

  const { t } = useTranslation();

  // === BLOCAGE SELON LA PHASE  ===
  if (statusLoading) {
    return (
      <section className="py-40 bg-black text-white px-4 sm:px-6 text-center">
        <p className="text-xl text-gray-400">Chargement de l’état du concours...</p>
      </section>
    );
  }

  if (contestStatus?.currentPhase !== "phase1") {
    return (
      <section className="py-40 bg-black text-white px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-yellow-400 mb-8">
            Soumissions fermées
          </h2>
          <p className="text-xl sm:text-2xl text-gray-300 mb-6">
            Le concours est actuellement en{" "}
            <span className="font-semibold text-pink-500">
              {contestStatus?.phaseName || "phase inconnue"}
            </span>.
          </p>
          <p className="text-lg text-gray-400 mb-10">
            Les soumissions sont terminées. Revenez plus tard pour le palmarès !
          </p>
          <button
            onClick={() => window.location.href = "/palmares"}
            className="mt-8 px-10 py-5 bg-pink-600 hover:bg-pink-700 rounded-xl text-white font-bold text-lg transition duration-300"
          >
            Voir le palmarès
          </button>
        </div>
      </section>
    );
  }

  // === SI ON EST EN PHASE 1 → on affiche le formulaire ===
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

 
 
  // === FORMULAIRE NORMAL PHASE 1 QUAND Y A ZERO VIDEO EN PHASE 2 ET 3 ===
  return (
    <section className="py-40 bg-black text-white placeholder:bg-white px-4 sm:px-6  text-[15px] md:text-[15px]">
      <div className="flex flex-col justify-center mb-12 sm:mb-12 text-center">
        <div className="flex items-center gap-[5px] mb-4 sm:mb-6 text-[#f6339a]  w-full justify-center">
          <Sparkles 
  className="
    w-6 h-6        // 24px на мобилке
    
    sm:w-10 sm:h-10 // 40px от 1024px
  " 
/>
          <h2 className="uppercase text-[20px] sm:text-[24px] font-bold">
            {t("upload.call")}
          </h2>
          <Sparkles 
  className="
    w-6 h-6        // 
    
    sm:w-10 sm:h-10 
  " 
/>
        </div >

<div>
<span className="uppercase text-[32px] sm:text-[54px] font-bold "> {t("upload.drop_1")} </span>
        <span className="uppercase text-[32px] sm:text-[54px] font-bold text-[#2b7fff]">
{t("upload.drop_2")}  
        </span>
</div>
        
      </div>
      
      <div className="bg-gray-500/20 border mt-8 p-6 sm:p-9 border-white/10 rounded-[25px] shadow-[0_0_300px_rgba(255,0,128,0.400)] max-w-[1000px] mx-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col md:grid md:grid-cols-[40px_1fr] gap-4 items-center mt-8">
            <CircleCheck size={40} className="text-[#2b7fff] hidden md:flex" />
            <h2 className="uppercase text-[16px] tracking-[0.06em]">
             {t("upload.rules")}
            </h2>
          </div>

          <div className="grid grid-cols-[40px_1fr] gap-4 items-center mt-10">
            <Film size={39} className="text-[#c27aff] min-w-[39px]" />
            <h2 className="text-[22px] sm:text-[32px] text-[#c27aff] uppercase">
              {t("upload.first_title")}
            </h2>
          </div>
          
          <div className="mt-6">
            <div className="flex flex-col md:grid md:grid-cols-[40px_1fr] gap-4">
              <div></div>
              <div>
                <div className="flex flex-col xl:grid xl:grid-cols-2  gap-6">
                  <div className="flex flex-col">
                    <label className="uppercase text-[18px] text-white/40 sm:text-[22px] mb-1">
                      {t("upload.title")} * :
                    </label>
                    <input
                      className="bg-white/2 border-white/5 placeholder:text-white/40 border-[1px] rounded-[10px] p-[10px] mt-3"
                      {...register("title")}
                      placeholder={t("upload.placeholder_title")}
                    />
                    {errors.title && <p className="mt-2 text-white/40-400">{errors.title.message}</p>}
                  </div>

                  <div className="flex flex-col">
                    <label className="uppercase text-[18px] text-white/40 sm:text-[22px] mb-1">
                      {t("upload.title_trad")} * :
                    </label>
                    <input
                      className="bg-white/2 border-white/5 placeholder:text-white/40 border-[1px] rounded-[10px] p-[10px] mt-3"
                      {...register("translated_title")}
                      placeholder={t("upload.placeholder_trad_title")}
                    />
                    {errors.translated_title && (
                      <p className="mt-2 text-white/40-400">{errors.translated_title.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="uppercase text-[18px] text-white/40 sm:text-[22px] mb-1">
                      Langue (optionnel)
                    </label>
                    <input
                      className="bg-white/2 border-white/5 placeholder:text-white/40 border-[1px] rounded-[10px] p-[10px] mt-3 resize-none w-full flex items-start"
                      {...register("language")}
                      placeholder={t("upload.language_placeholder")}
                    />
                    {errors.language && <p className="mt-2 text-white/40-400">{errors.language.message}</p>}
                  </div>

                  <div className="flex flex-col">
                    <label className="uppercase text-[18px] text-white/40 sm:text-[22px] mb-1">
                      {t("upload.ai_type")} (optionnel)
                    </label>
                    <input
                      type="text"
                      className="bg-white/2 border-white/5 placeholder:text-white/40 border-[1px] rounded-[10px] p-[10px] mt-3 resize-none w-full"
                      {...register("ai_tools")}
                      rows={3}
                      placeholder={t("upload.ai_type_placeholder")}
                    />
                    {errors.ai_tools && <p className="mt-2 text-white/40-400">{errors.ai_tools.message}</p>}
                  </div>
                </div>

                <div className="flex flex-col mt-10">
                  <label className="uppercase text-[18px] text-white/40 sm:text-[22px] mb-1">Synopsis</label>
                  <textarea
                    className="bg-white/2 placeholder:text-white/40 border-white/5 border-[1px] rounded-[10px] p-[10px] mt-3 resize-none w-full h-[120px]"
                    {...register("synopsis")}
                    placeholder={t("upload.synopsis_placeholder")}
                  />
                  {errors.synopsis && <p className="mt-2 text-white/40-400">{errors.synopsis.message}</p>}
                </div>

                <div className="flex flex-col mt-10">
                  <label className="uppercase text-[18px] text-white/40 sm:text-[22px] mb-1">
                    {t("upload.synopsis_english")} (optionnel)
                  </label>
                  <textarea
                    className="bg-white/2 placeholder:text-white/40 border-white/5 border-[1px] rounded-[10px] p-[10px] mt-3 resize-none w-full h-[120px]"
                    {...register("synopsis_en")}
                    rows={4}
                    placeholder={t("upload.synopsis_english")}
                  />
                  {errors.synopsis_en && <p className="mt-2 text-white/40-400">{errors.synopsis_en.message}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[40px_1fr] gap-4 items-center mt-10">
            <Film size={39} className="text-[#c27aff] min-w-[39px]" />
            <h2 className="text-[22px] sm:text-[32px] text-[#c27aff] uppercase">
              {t("upload.second_title")}
            </h2>
          </div>

          <div className="mt-10">
            <div className="md:grid md:grid-cols-[40px_1fr] gap-4">
              <div></div>
              <div className="flex flex-col lg:grid lg:grid-cols-2  gap-6">
                <div className="flex flex-col">
                  <label className="uppercase text-[18px] placeholder:text-white/40 text-white/40 sm:text-[22px] mb-1">Vidéo *</label>
                  <input
                    type="file"
                    accept={ACCEPTED_VIDEO_TYPES.join(",")}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setValue("video", file, { shouldValidate: true });
                    }}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-[10px] cursor-pointer w-full mt-3"
                  >
                    <span className="text-white/40">
                      {watch("video") ? watch("video").name.slice(0, 30) + '...' : t("upload.selected_vid")}
                    </span>
                  </label>
                  {errors.video && (
                    <p className="mt-2 text-white/40-400">{errors.video.message}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="uppercase text-[18px] placeholder:text-white/40 text-white/40 sm:text-[22px] mb-1">
                    {t("upload.subtitle")} (.srt) (optionnel)
                  </label>
                  <input
                    className="hidden"
                    type="file"
                    id="sous-titre-upload"
                    accept=".srt"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setValue("subtitles", file, { shouldValidate: true });
                      }
                    }}
                  />
                  <label
                    htmlFor="sous-titre-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-[10px] cursor-pointer w-full mt-3"
                  >
                    <span className="text-white/40">
                      {watch("subtitles")
                        ? watch("subtitles").name.slice(0, 30) + '...'
                        : t("upload.selected_sub")}
                    </span>
                  </label>
                  {errors.subtitles && <p className="mt-2 text-white/40-400">{errors.subtitles.message}</p>}
                </div>

                <div className="flex flex-col col-span-2 mt-6">
                  <label className="uppercase text-[18px] text-white/40 sm:text-[22px] mb-1">Thumbnail (optionnel)</label>
                  <input
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setValue("thumbnail", file, { shouldValidate: true });
                      }
                    }}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <label
                    htmlFor="thumbnail-upload"
                    className="flex items-center gap-2 p-3 sm:p-6 bg-white/5 border border-white/10 rounded-[10px] cursor-pointer w-full min-h-[100px] justify-center mt-3"
                  >
                    {watch("thumbnail") ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        {(() => {
                          const file = watch("thumbnail");
                          const previewUrl = URL.createObjectURL(file);
                          return (
                            <img 
                              src={previewUrl} 
                              alt="preview" 
                              className="max-w-full full aspect-video rounded-[10px] object-cover"
                              onLoad={() => URL.revokeObjectURL(previewUrl)}
                            />
                          );
                        })()}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Image size={30} className="text-zinc-500" />
                        <span className="text-white/40 text-sm">{t("upload.selected_img")}</span>
                      </div>
                    )}
                  </label>
                  {errors.thumbnail && (
                    <p className="mt-2 text-white/40-400">{errors.thumbnail.message}</p>
                  )}
                </div>

                <div className="col-span-2 mt-12">
                  <h3 className="uppercase text-[18px] text-white/40 sm:text-[22px] mb-5">
                    {t("upload.title_gallery")} <span className="text-white/40 text-sm ml-2">(Stills - Max 2)</span>
                  </h3>
                  
                  <div className="flex flex-col xl:grid xl:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <input
                        type="file"
                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setValue("image_2", file, { shouldValidate: true });
                          }
                        }}
                        className="hidden"
                        id="image-2-upload"
                      />
                      <label
                        htmlFor="image-2-upload"
                        className="flex items-center justify-center  gap-2 p-3 sm:p-6 bg-white/5 border border-white/10 rounded-[10px] cursor-pointer min-h-[120px]"
                      >
                        {watch("image_2") ? (
                          <div className="relative w-full h-full flex items-center justify-center">
                            {(() => {
                              const file = watch("image_2");
                              const previewUrl = URL.createObjectURL(file);
                              return (
                                <img 
                                  src={previewUrl} 
                                  alt="preview 2" 
                                  className="max-w-full max-h-full aspect-video rounded-[10px] object-cover"
                                  onLoad={() => URL.revokeObjectURL(previewUrl)}
                                />
                              );
                            })()}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <Image size={30} className="text-zinc-500" />
                            <span className="text-white/40 text-sm text-center">
                              Image 2<br/>(optionnel)
                            </span>
                          </div>
                        )}
                      </label>
                      {errors.image_2 && <p className="mt-2 text-white/40-400 text-sm">{errors.image_2.message}</p>}
                    </div>

                    <div className="flex flex-col">
                      <input
                        type="file"
                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setValue("image_3", file, { shouldValidate: true });
                          }
                        }}
                        className="hidden"
                        id="image-3-upload"
                      />
                      <label
                        htmlFor="image-3-upload"
                        className="flex items-center justify-center gap-2 p-3 sm:p-6 bg-white/5 border border-white/10 rounded-[10px] cursor-pointer min-h-[120px]"
                      >
                        {watch("image_3") ? (
                          <div className="relative w-full h-full flex items-center justify-center">
                            {(() => {
                              const file = watch("image_3");
                              const previewUrl = URL.createObjectURL(file);
                              return (
                                <img 
                                  src={previewUrl} 
                                  alt="preview 3" 
                                  className="max-w-full max-h-full aspect-video rounded-[10px] object-cover"
                                  onLoad={() => URL.revokeObjectURL(previewUrl)}
                                />
                              );
                            })()}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <Image size={30} className="text-zinc-500" />
                            <span className="text-white/40 text-sm text-center">
                              Image 3<br/>(optionnel)
                            </span>
                          </div>
                        )}
                      </label>
                      {errors.image_3 && <p className="mt-2 text-white/40-400 text-sm">{errors.image_3.message}</p>}
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
<div className="flex w-full justify-center mt-14">
            <button 
              type="submit" 
              disabled={loading}
              className="min-h-20 w-full md:w-[60%] px-6 bg-[#741748] border border-white/10 text-[16px] sm:text-[16px] rounded-[13px] font-bold uppercase hover:bg-[#ffffff10] duration-300 cursor-pointer transition-colors disabled:opacity-50"
            >
              {loading ? "Envoi en cours..." : t("upload.upload_button")}
            </button>
          </div>
          

          {serverError && <p className="mt-6 text-white/40-400 text-center">{serverError}</p>}
        </form>

        <ConfirmModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={confirmSubmit}
          data={tempData}
        />
      </div>
    </section>
  );
}