import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listFilms } from "../../api/films";
import FilmCard from "../../components/FilmCard";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Gallerie() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [typeIA, setTypeIA] = useState("");
  const [pays, setPays] = useState("");
  const [statut, setStatut] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 9;

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["gallerie", currentPage, limit],
    queryFn: () => listFilms(currentPage, limit),
    keepPreviousData: true,
  });

  const UPLOADS_BASE = "http://localhost:3000";

  const toFilmCardShape = (video) => {
    const thumb = video?.thumbnail
      ? `${UPLOADS_BASE}/${video.thumbnail}`
      : `${UPLOADS_BASE}/thumbnail-placeholder.png`;

    const youtubeIdOrUrl = (video?.youtube_link ?? "") || (video?.youtube_video_id ?? "");
    const youtubeUrl =
      youtubeIdOrUrl && !String(youtubeIdOrUrl).startsWith("http")
        ? `https://www.youtube.com/watch?v=${youtubeIdOrUrl}`
        : youtubeIdOrUrl;

    return {
      id: video?.id,
      title: video?.title,
      translated_title: video?.translated_title ?? "",
      duration: video?.duration ?? "",
      synopsis: video?.synopsis ?? "",
      status: video?.status ?? "",
      ai_tools: video?.ai_tools ?? "",
      youtube_link: youtubeUrl,
      thumbnail: thumb,
      image_2: "",
      image_3: "",
    };
  };

  const Shell = ({ children }) => (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* gradient flou */}
      <div className="pointer-events-none fixed inset-0 opacity-40">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#7b2cff]/30 blur-3xl" />
        <div className="absolute top-20 right-[-120px] h-[420px] w-[420px] rounded-full bg-[#ff4fd8]/20 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-6xl px-6 pb-14 pt-12">
        {children}
      </main>
    </div>
  );

  if (isPending) {
    return (
      <Shell>
        <section className="mb-10">
          <h1 className="m-0 text-[44px] md:text-[56px] leading-[0.95] font-black tracking-[-1.5px]">
            {t("gallery.title")} <br />
            {t("gallery.title2")}{" "}
            <span className="bg-gradient-to-r from-[#ff4fd8] to-[#7b2cff] bg-clip-text text-transparent">
              {t("gallery.title3")}
            </span>
          </h1>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: limit }).map((_, i) => (
            <div
              key={i}
              className="h-[420px] rounded-3xl border border-white/10 bg-white/5 animate-pulse"
            />
          ))}
        </div>

        <div className="mt-10 text-center text-white/70">
          {t("gallery.loading")}
        </div>
      </Shell>
    );
  }

  if (isError) {
    return (
      <Shell>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-lg font-bold">{t("gallery.no_video")}</div>
          <div className="mt-2 text-white/70">{error?.message}</div>
        </div>
      </Shell>
    );
  }

  const videos = data?.data?.showVideos ?? [];
  const totalPages = data?.data?.totalPages ?? 1;

  if (videos.length === 0) {
    return (
      <Shell>
        <section className="mb-10">
          <h1 className="m-0 text-[44px] md:text-[56px] leading-[0.95] font-black tracking-[-1.5px]">
            {t("gallery.title")} <br />
            {t("gallery.title2")}{" "}
            <span className="bg-gradient-to-r from-[#ff4fd8] to-[#7b2cff] bg-clip-text text-transparent">
              {t("gallery.title3")}
            </span>
          </h1>
        </section>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white/70">
          {t("gallery.no_video")}
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      {/* Title + subtitle */}
      <section className="mb-10">
        <h1 className="m-0 text-[44px] md:text-[56px] leading-[0.95] font-black tracking-[-1.5px]">
          {t("gallery.title")} <br />
          {t("gallery.title2")}{" "}
          <span className="bg-gradient-to-r from-[#ff4fd8] to-[#7b2cff] bg-clip-text text-transparent">
            {t("gallery.title3")}
          </span>
        </h1>

      </section>

      {/* Filters in a nice panel */}
      <section className="mb-10">
        <div className="mb-12">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <select
              className="h-12 rounded-2xl px-4 pr-10 text-sm font-bold text-white outline-none
                         bg-gradient-to-r from-[#7b2cff] to-[#FF2B7F]
                         shadow-[0_10px_30px_rgba(123,44,255,0.15)]"
              value={typeIA}
              onChange={(e) => setTypeIA(e.target.value)}
            >
              <option value="">{t("gallery.type")}</option>
              <option value="CHATGPT">{t("gallery.AI_1")}</option>
              <option value="Midjourney">{t("gallery.AI_2")}</option>
              <option value="Runway">{t("gallery.AI_3")}</option>
            </select>

            <select
              className="h-12 rounded-2xl px-4 pr-10 text-sm font-bold text-white outline-none
                         bg-gradient-to-r from-[#7b2cff] to-[#FF2B7F]
                         shadow-[0_10px_30px_rgba(255,79,216,0.12)]"
              value={statut}
              onChange={(e) => setStatut(e.target.value)}
            >
              <option value="">{t("gallery.status")}</option>
              <option value="published">{t("gallery.published")}</option>
              <option value="pending">{t("gallery.pending")}</option>
            </select>
          </div>

        </div>
      </section>

      {/* Gallery grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video) => (
  <div
    key={video.id || video.title}
    onClick={() => navigate(`/films/${video.id}`)}
    className="cursor-pointer"
  >
    <FilmCard film={toFilmCardShape(video)} />
  </div>
))}

      </div>

      {/* Paginations */}
      <div className="mt-12 flex justify-center">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </Shell>
  );
}