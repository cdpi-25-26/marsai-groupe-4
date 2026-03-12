import { useQuery } from "@tanstack/react-query";
import { getVideos, deleteVideo, updateVideo } from "../../api/videos.js";
import { useState, Fragment } from "react";
import { CircleX, Pencil } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { YouTubePlayer } from "@/components/ui/youtube-video-player.jsx";
import { ChevronDown, ChevronRight, Users } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assignPrize } from "../../api/phase.js";

function Videos() {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedVideoId, setExpandedVideoId] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const limit = 10;
  const queryClient = useQueryClient();
  const [prizeDialogOpen, setPrizeDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);


 

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["films", currentPage, limit],
    queryFn: () => getVideos(currentPage, limit),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await deleteVideo(id);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(["films"]);
      window.location.reload();
    },
    onError: (error) => {
      alert(
        "Erreur lors de la suppression: " +
          (error.response?.data?.error || error.message),
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return await updateVideo(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["films"]);
      setIsEditDialogOpen(false);
      setEditingVideo(null);
    },
    onError: (error) => {
      alert(
        "Erreur lors de la mise à jour: " +
          (error.response?.data?.error || error.message),
      );
    },
  });

  function handleEdit(video) {
    setEditingVideo(video);
    setIsEditDialogOpen(true);
  }

  function handleUpdateVideo(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      title: formData.get("title"),
      translated_title: formData.get("translated_title"),
      synopsis: formData.get("synopsis"),
      synopsis_en: formData.get("synopsis_en"),
      status: formData.get("status"),
      ai_tools: formData.get("ai_tools"),
      language: formData.get("language"),
      duration: formData.get("duration"),
      youtube_link: formData.get("youtube_link"),
    };
    updateMutation.mutate({ id: editingVideo.id, data });
  }

  function handleDelete(id) {
    if (confirm("Voulez-vous vraiment supprimer cet video ?")) {
      deleteMutation.mutate(id);
    }
  }

  const toggleVideoExpand = (videoId) => {
    setExpandedVideoId(expandedVideoId === videoId ? null : videoId);
  };

  const columns = [
    {
      accessorKey: "title",
      header: "Titre",
      cell: ({ row }) => {
        const video = row.original;
        const isExpanded = expandedVideoId === video.id;
        return (
          <button
            onClick={() => toggleVideoExpand(video.id)}
            className="flex items-center gap-2 text-left hover:text-blue-600 transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            <span className="font-medium hover:cursor-pointer">
              {video.title}
            </span>
          </button>
        );
      },
    },
    {
      accessorKey: "user",
      header: "Propriétaire",
      cell: ({ row }) => {
        const user = row.original.user;
        return user ? `${user.first_name} ${user.last_name}` : "N/A";
      },
    },
    {
      accessorKey: "user.email",
      header: "Email",
      cell: ({ row }) => row.original.user?.email || "N/A",
    },
    {
      accessorKey: "juryMembers",
      header: "Jury Assigné",
      cell: ({ row }) => {
        const juryMembers = row.original.juryMembers || [];
        return (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span>
              {juryMembers.length > 0
                ? juryMembers
                    .map((j) => `${j.first_name} ${j.last_name}`)
                    .join(", ")
                : "Aucun jury"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Date de création",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return date.toLocaleDateString("fr-FR");
      },
    },
    {
      id: "actions",
  header: "",
  cell: ({ row }) => {
    const video = row.original;

    // Affiche le bouton en phase 2 (attribuer) ET phase 3 (modifier)
    if (video.phase_status !== "phase2" && video.phase_status !== "phase3") {
      return null;
    }

    return (
      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedVideo(video);
            setPrizeDialogOpen(true);
          }}
        >
          {video.phase_status === "phase3" ? "Modifier le prix" : "Attribuer un prix"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleEdit(video)}
          className="hover:cursor-pointer"
        >
          <Pencil />
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDelete(video.id)}
          className="hover:cursor-pointer"
        >
          <CircleX />
        </Button>
      </div>
    );
  },
    },
  ];

  const table = useReactTable({
    data: data?.data?.showVideos || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  if (isPending) {
    return (
      <div className="container mx-auto px-4 py-8">Chargement en cours...</div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        Une erreur est survenue : {error.message}
      </div>
    );
  }

  const handleAssignPrize = (video) => {
    setSelectedVideo(video);
    setPrizeDialogOpen(true);
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="bg-background rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Liste des vidéos</h2>
        </div>

        {data.data.showVideos.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => {
                    const video = row.original;
                    const isExpanded = expandedVideoId === video.id;
                    return (
                      <Fragment key={row.id}>
                        <TableRow>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                        {isExpanded && (
                          <TableRow>
                            <TableCell
                              colSpan={columns.length}
                              className="bg-gray-50"
                            >
                              <div className="p-4 space-y-4">
                                <div className="max-w-4xl">
                                  <YouTubePlayer
                                    videoId={video.youtube_link}
                                    title={video.title}
                                    customThumbnail={
                                      video.thumbnail
                                        ? `http://localhost:3000/uploads/images/${video.thumbnail}`
                                        : "http://localhost:3000/uploads/images/thumbnail-placeholder.png"
                                    }
                                    defaultExpanded={false}
                                    className="mb-4"
                                  />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">
                                      Synopsis
                                    </h4>
                                    <p className="text-gray-600">
                                      {video.synopsis ||
                                        "Aucun synopsis disponible"}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">
                                      Outils IA utilisés
                                    </h4>
                                    <p className="text-gray-600">
                                      {video.ai_tools || "Non spécifié"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Aucune vidéo trouvée.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Aucune vidéo à afficher.
          </div>
        )}

    <Dialog open={prizeDialogOpen} onOpenChange={setPrizeDialogOpen}>
  <DialogContent className="max-w-lg">
    <DialogHeader>
      <DialogTitle>
        {selectedVideo?.phase_status === "phase3" 
          ? "Modifier le prix de" 
          : "Attribuer un prix à"} {selectedVideo?.title}
      </DialogTitle>
    </DialogHeader>

    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const prizeData = {
          name: formData.get("name")?.trim() || "Prix spécial",
          prize: formData.get("prize")?.trim() || "Trophy",
          description: formData.get("description")?.trim() || null,
          edition_year: selectedVideo?.edition_year || 2026,
        };

        try {
          await assignPrize(selectedVideo.id, prizeData);
          console.log(
            selectedVideo?.phase_status === "phase3" 
              ? "Prix modifié avec succès !" 
              : "Prix attribué avec succès !"
          );
          setPrizeDialogOpen(false);
          queryClient.invalidateQueries(["videos"]);
        } catch (err) {
          console.log("Erreur : " + (err.response?.data?.error || err.message));
        }
      }}
      className="space-y-6"
    >
      {/* Nom du prix */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Nom du prix / Catégorie *
        </label>
        <input
          type="text"
          name="name"
          required
          placeholder="Ex: Best AI Use, Grand Prix, Mention spéciale..."
          defaultValue={selectedVideo?.awards?.[0]?.name || ""}
          className="
            w-full p-3 
            bg-white/5 
            border border-white/20 
            rounded-xl 
            text-white 
            focus:outline-none 
            focus:ring-2 
            focus:ring-pink-500/50 
            focus:border-pink-500/40
          "
        />
        <p className="mt-1 text-xs text-gray-400">
          Le nom du prix ou de la catégorie (ex: Best Film, Prix du Jury)
        </p>
      </div>

      {/* Type de récompense (prize) */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Type de récompense *
        </label>
        <input
          type="text"
          name="prize"
          required
          placeholder="Ex: Trophy, Certificate, Médaille, Diplôme..."
          defaultValue={selectedVideo?.awards?.[0]?.prize || "Trophy"}
          className="
            w-full p-3 
            bg-white/5 
            border border-white/20 
            rounded-xl 
            text-white 
            focus:outline-none 
            focus:ring-2 
            focus:ring-pink-500/50 
            focus:border-pink-500/40
          "
        />
        <p className="mt-1 text-xs text-gray-400">
          Le type de prix physique ou symbolique (ex: Trophy, Certificate)
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Description (optionnel)
        </label>
        <textarea
          name="description"
          rows={4}
          defaultValue={selectedVideo?.awards?.[0]?.description || ""}
          className="
            w-full p-3 
            bg-white/5 
            border border-white/20 
            rounded-xl 
            text-white 
            focus:outline-none 
            focus:ring-2 
            focus:ring-pink-500/50 
            focus:border-pink-500/40
            resize-y
          "
          placeholder="Détails du prix, contexte, justification..."
        />
      </div>

      {/* Boutons */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setPrizeDialogOpen(false)}
        >
          Annuler
        </Button>
        <Button type="submit">
          {selectedVideo?.phase_status === "phase3" ? "Modifier" : "Attribuer"}
        </Button>
      </div>
    </form>
  </DialogContent>
</Dialog>

        {data.data.totalPages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from(
                { length: data.data.totalPages },
                (_, i) => i + 1,
              ).map((page) => (
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
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, data.data.totalPages))
                  }
                  className={
                    currentPage === data.data.totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la vidéo</DialogTitle>
            <DialogDescription>
              Modifiez les informations de la vidéo ci-dessous.
            </DialogDescription>
          </DialogHeader>

          {editingVideo && (
            <form onSubmit={handleUpdateVideo} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingVideo.title}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="translated_title">Titre traduit</Label>
                  <Input
                    id="translated_title"
                    name="translated_title"
                    defaultValue={editingVideo.translated_title || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Langue</Label>
                  <Input
                    id="language"
                    name="language"
                    defaultValue={editingVideo.language || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Durée</Label>
                  <Input
                    id="duration"
                    name="duration"
                    defaultValue={editingVideo.duration || ""}
                    placeholder="ex: 5:30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select name="status" defaultValue={editingVideo.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="submitted">Soumis</SelectItem>
                      <SelectItem value="under_review">En révision</SelectItem>
                      <SelectItem value="rejected">Rejeté</SelectItem>
                      <SelectItem value="selected">Sélectionné</SelectItem>
                      <SelectItem value="finalist">Finaliste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube_link">Lien YouTube</Label>
                  <Input
                    id="youtube_link"
                    name="youtube_link"
                    defaultValue={editingVideo.youtube_link || ""}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="synopsis">Synopsis</Label>
                <Textarea
                  id="synopsis"
                  name="synopsis"
                  defaultValue={editingVideo.synopsis || ""}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="synopsis_en">Synopsis (Anglais)</Label>
                <Textarea
                  id="synopsis_en"
                  name="synopsis_en"
                  defaultValue={editingVideo.synopsis_en || ""}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ai_tools">Outils IA utilisés</Label>
                <Textarea
                  id="ai_tools"
                  name="ai_tools"
                  defaultValue={editingVideo.ai_tools || ""}
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending
                    ? "Enregistrement..."
                    : "Enregistrer"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default Videos;
