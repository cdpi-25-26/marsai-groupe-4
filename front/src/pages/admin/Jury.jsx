import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  getEvaluations,
  getFilmsToEvaluate,
  createEvaluation,
  updateEvaluation,
  deleteEvaluation,
} from "../../api/evaluations.js";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const evaluationSchema = z.object({
  id: z.number().optional(),
  film_id: z.coerce.number().min(1, "Veuillez sélectionner un film"),
  decision: z.enum(["YES", "MAYBE", "NO"], { required_error: "Veuillez choisir une décision" }),
  comment: z.string().optional(),
});

function Jury() {
  const [evaluations, setEvaluations] = useState([]);
  const [films, setFilms] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(evaluationSchema),
    defaultValues: { film_id: "", decision: "MAYBE", comment: "" },
  });

  const decision = watch("decision");

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    getEvaluations().then((res) => setEvaluations(res.data));
    getFilmsToEvaluate().then((res) => setFilms(res.data));
  }

  const createMutation = useMutation({
    mutationFn: (data) => createEvaluation(data),
    onSuccess: () => {
      handleCloseCreate();
      loadData();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateEvaluation(data.id, data),
    onSuccess: () => {
      handleCloseEdit();
      loadData();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteEvaluation(id),
    onSuccess: () => loadData(),
  });

  function onSubmitCreate(data) {
    createMutation.mutate(data);
  }

  function onSubmitEdit(data) {
    updateMutation.mutate(data);
  }

  function handleEdit(evaluation) {
    setValue("id", evaluation.id);
    setValue("film_id", evaluation.film_id);
    setValue("decision", evaluation.decision);
    setValue("comment", evaluation.comment || "");
    setIsEditOpen(true);
  }

  function handleDelete(id) {
    if (confirm("Supprimer cette évaluation ?")) {
      deleteMutation.mutate(id);
    }
  }

  function handleCloseCreate() {
    reset({ film_id: "", decision: "MAYBE", comment: "" });
    setIsCreateOpen(false);
  }

  function handleCloseEdit() {
    reset({ film_id: "", decision: "MAYBE", comment: "" });
    setIsEditOpen(false);
  }

  const decisionColors = {
    YES: "bg-green-100 text-green-800",
    MAYBE: "bg-yellow-100 text-yellow-800",
    NO: "bg-red-100 text-red-800",
  };

  const columns = [
    {
      accessorKey: "film",
      header: "Film",
      cell: ({ row }) => row.original.film?.title || `Film #${row.original.film_id}`,
    },
    {
      accessorKey: "jury",
      header: "Jury",
      cell: ({ row }) => {
        const j = row.original.jury;
        return j ? `${j.first_name} ${j.last_name}` : "—";
      },
    },
    {
      accessorKey: "decision",
      header: "Décision",
      cell: ({ row }) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${decisionColors[row.getValue("decision")] || ""}`}
        >
          {row.getValue("decision")}
        </span>
      ),
    },
    { accessorKey: "comment", header: "Commentaire" },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={() => handleEdit(row.original)}>
            Modifier
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDelete(row.original.id)}>
            Supprimer
          </Button>
        </div>
      ),
    },
  ];

  // Pagination
  const totalPages = Math.max(Math.ceil(evaluations.length / limit), 1);
  const paginatedData = evaluations.slice((currentPage - 1) * limit, currentPage * limit);

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  });

  function DecisionButtons() {
    return (
      <div className="flex gap-3">
        {["YES", "MAYBE", "NO"].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setValue("decision", d)}
            className={`px-4 py-2 rounded-lg font-medium text-sm border-2 transition ${
              decision === d
                ? d === "YES"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : d === "NO"
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-yellow-500 bg-yellow-50 text-yellow-700"
                : "border-gray-200 text-gray-500"
            }`}
          >
            {d}
          </button>
        ))}
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Évaluations du jury</h2>

          {/* Create Dialog */}
          <Dialog
            open={isCreateOpen}
            onOpenChange={(open) => {
              if (!open) handleCloseCreate();
              setIsCreateOpen(open);
            }}
          >
            <DialogTrigger asChild>
              <Button>Évaluer un film</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Évaluer un film</DialogTitle>
                <DialogDescription>Donnez votre avis sur un film</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Film *</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    {...register("film_id")}
                  >
                    <option value="">Sélectionner un film</option>
                    {films.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.title}
                      </option>
                    ))}
                  </select>
                  {errors.film_id && (
                    <p className="text-red-500 text-sm mt-1">{errors.film_id.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Décision *</label>
                  <DecisionButtons />
                  {errors.decision && (
                    <p className="text-red-500 text-sm mt-1">{errors.decision.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Commentaire</label>
                  <textarea
                    className="w-full border rounded-lg px-3 py-2"
                    rows={3}
                    {...register("comment")}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleCloseCreate}>
                    Annuler
                  </Button>
                  <Button type="submit">Soumettre</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((h) => (
                    <TableHead key={h.id}>
                      {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
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
                    Aucune évaluation.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-4">
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
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseEdit();
          setIsEditOpen(open);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier l'évaluation</DialogTitle>
            <DialogDescription>Modifiez votre avis sur ce film</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitEdit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Décision *</label>
              <DecisionButtons />
              {errors.decision && (
                <p className="text-red-500 text-sm mt-1">{errors.decision.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Commentaire</label>
              <textarea
                className="w-full border rounded-lg px-3 py-2"
                rows={3}
                {...register("comment")}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseEdit}>
                Annuler
              </Button>
              <Button type="submit">Mettre à jour</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default Jury;
