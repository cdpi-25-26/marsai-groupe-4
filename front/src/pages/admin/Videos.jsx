import { useQuery } from "@tanstack/react-query";
import { getVideos } from "../../api/videos.js";
import { useState } from "react";

//shadcn components
import { YouTubePlayer, YouTubePlayerControls } from "@/components/ui/youtube-video-player.jsx";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function Videos() {

	const [currentPage, setCurrentPage] = useState(1);
  	const limit = 6;

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["films", currentPage, limit],
    queryFn: () => getVideos(currentPage, limit),
	keepPreviousData: true,
  });

  if (isPending) {
    return <div>Chargement en cours...</div>;
  }

  if (isError) {
    return <div>Une erreur est survenue : {error.message}</div>;
  }


console.log(data)
    return data.data.showVideos.length > 0 ? (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 p-8 max-w-7xl mx-auto">
        {data.data.showVideos.map((video) => (
          <div key={video.id || video.title}>
            <h2 className="text-2xl font-bold">{video.title}</h2>

            <YouTubePlayer
              videoId={video.youtube_link}
              title={video.title}
              customThumbnail={
                video.thumbnail
                  ? `http://localhost:3000/uploads/images/${video.thumbnail}`
                  : "http://localhost:3000/uploads/images/thumbnail-placeholder.png"
              }
              defaultExpanded={false}
              className="mb-8"
            />

            <div>
              <p>
                <strong>Propriétaire:</strong>{" "}
                {video.user ? `${video.user.first_name} ${video.user.last_name}` : "N/A"}
              </p>
              <p><strong>Email:</strong> {video.user?.email || "N/A"}</p>
              <p>{video.synopsis}</p>
              <label>{video.ai_tools}</label>
              <label><small>{video.created_at}</small></label>
            </div>
          </div>
        ))}
      </div>

      {data.data.totalPages > 1 && (
        <Pagination className="pb-10">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: data.data.totalPages }, (_, i) => i + 1).map((page) => (
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
                onClick={() => setCurrentPage((p) => Math.min(p + 1, data.data.totalPages))}
                className={currentPage === data.data.totalPagesages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  ) : (
    <div>Aucune vidéo à afficher.</div>
  );
}

export default Videos;
