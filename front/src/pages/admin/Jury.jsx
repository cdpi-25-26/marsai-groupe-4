import { useEffect, useState } from "react";
import { getJuryMembers, getJuryFilms, assignFilmToJury, unassignFilmFromJury } from "../../api/jury.js";
import { getAllVideos } from "../../api/videos.js";
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
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function Jury() {
  const [jurys, setJurys] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [selectedJury, setSelectedJury] = useState(null);
  const [assignedFilms, setAssignedFilms] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    loadJuryMembers();
    loadAllVideos();
  }, []);

  async function loadJuryMembers() {
    try {
      const { data } = await getJuryMembers();
      setJurys(data.juryMembers || []);
    } catch (error) {
      console.error("Error loading jury members:", error);
    }
  }

  async function loadAllVideos() {
    try {
      const { data } = await getAllVideos();
      setAllVideos(data.showVideos || []);
    } catch (error) {
      console.error("Error loading videos:", error);
    }
  }

  async function handleOpenAssignModal(jury) {
    setSelectedJury(jury);
    setLoading(true);
    setIsDialogOpen(true);
    
    try {
      const { data } = await getJuryFilms(jury.id);
      setAssignedFilms(data.assignedFilms || []);
    } catch (error) {
      console.error("Error loading assigned films:", error);
      setAssignedFilms([]);
    } finally {
      setLoading(false);
    }
  }

  function isFilmAssigned(filmId) {
    return assignedFilms.some(film => film.id === filmId);
  }

  const assignMutation = useMutation({
    mutationFn: async ({ filmId, userId }) => {
      return await assignFilmToJury(filmId, userId);
    },
    onSuccess: () => {
      // Refresh assigned films
      if (selectedJury) {
        getJuryFilms(selectedJury.id).then(({ data }) => {
          setAssignedFilms(data.assignedFilms || []);
        });
      }
    },
    onError: (error) => {
      console.error('Error assigning film:', error);
      alert(error.response?.data?.error || "Erreur lors de l'assignation");
    },
  });

  const unassignMutation = useMutation({
    mutationFn: async ({ filmId, userId }) => {
      return await unassignFilmFromJury(filmId, userId);
    },
    onSuccess: () => {
      // Refresh assigned films
      if (selectedJury) {
        getJuryFilms(selectedJury.id).then(({ data }) => {
          setAssignedFilms(data.assignedFilms || []);
        });
      }
    },
    onError: (error) => {
      console.error('Error unassigning film:', error);
      alert(error.response?.data?.error || "Erreur lors de la suppression");
    },
  });

  function handleToggleAssignment(film) {
    if (!selectedJury) return;
    
    const isAssigned = isFilmAssigned(film.id);
    
    if (isAssigned) {
      unassignMutation.mutate({ filmId: film.id, userId: selectedJury.id });
    } else {
      assignMutation.mutate({ filmId: film.id, userId: selectedJury.id });
    }
  }

  const columns = [
    {
      accessorKey: "first_name",
      header: "Prénom",
    },
    {
      accessorKey: "last_name", 
      header: "Nom",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const jury = row.original;
        return (
          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => handleOpenAssignModal(jury)}
            >
              Assign Videos
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: jurys,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="bg-background rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Membres du Jury</h2>
        </div>

        {jurys.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      Aucun membre du jury trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Aucun membre du jury à afficher.
          </div>
        )}
      </div>

      {/* Video Assignment Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Assigner des vidéos - {selectedJury?.first_name} {selectedJury?.last_name}
            </DialogTitle>
            <DialogDescription>
              Cliquez sur "Add" pour assigner une vidéo ou "Remove" pour la retirer
            </DialogDescription>
          </DialogHeader>
          
          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : (
            <div className="space-y-3">
              {allVideos.length > 0 ? (
                allVideos.map((video) => {
                  const isAssigned = isFilmAssigned(video.id);
                  const isPending = assignMutation.isPending || unassignMutation.isPending;
                  
                  return (
                    <div 
                      key={video.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{video.title}</h3>
                        {video.translated_title && (
                          <p className="text-sm text-gray-600">{video.translated_title}</p>
                        )}
                        <div className="flex gap-4 mt-1">
                          <span className="text-xs text-gray-500">
                            Status: <span className="font-medium">{video.status}</span>
                          </span>
                          {video.duration && (
                            <span className="text-xs text-gray-500">
                              Durée: {video.duration}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        variant={isAssigned ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleToggleAssignment(video)}
                        disabled={isPending}
                      >
                        {isAssigned ? "Remove" : "Add"}
                      </Button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Aucune vidéo disponible
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default Jury;