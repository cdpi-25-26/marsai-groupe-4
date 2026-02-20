import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getVideos, updateVideoStatus } from "../../api/videos.js";
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

const STATUS_OPTIONS = [
  { value: "submitted", label: "Submitted", color: "bg-gray-200 text-gray-800" },
  { value: "under_review", label: "Under Review", color: "bg-yellow-200 text-yellow-800" },
  { value: "selected", label: "Selected", color: "bg-green-200 text-green-800" },
  { value: "finalist", label: "Finalist", color: "bg-purple-200 text-purple-800" },
  { value: "rejected", label: "Rejected", color: "bg-red-200 text-red-800" },
];

function StatusBadge({ status }) {
  const option = STATUS_OPTIONS.find((o) => o.value === status) || STATUS_OPTIONS[0];
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${option.color}`}>
      {option.label}
    </span>
  );
}

function Videos() {

	const [currentPage, setCurrentPage] = useState(1);
  	const limit = 6;
	const queryClient = useQueryClient();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["films", currentPage, limit],
    queryFn: () => getVideos(currentPage, limit),
	keepPreviousData: true,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateVideoStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["films"] });
    },
  });

  if (isPending) {
    return <div>Chargement en cours...</div>;
  }

  if (isError) {
    return <div>Une erreur est survenue : {error.message}</div>;
  }


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

              <div className="mt-3 flex items-center gap-3">
                <StatusBadge status={video.status} />
                <select
                  value={video.status || "submitted"}
                  onChange={(e) =>
                    statusMutation.mutate({ id: video.id, status: e.target.value })
                  }
                  disabled={statusMutation.isPending}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
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
                className={currentPage === data.data.totalPages ? "pointer-events-none opacity-50" : ""}
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
