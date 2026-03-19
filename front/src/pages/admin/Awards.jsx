import { useEffect, useState } from "react";
import instance from "../../api/config.js";
import { CircleX, Pencil, Trophy } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const PRIZE_TYPES = [
  "Grand Prix", "Prix du Jury", "Prix Spécial", "Prix du Public",
  "Mention Honorable", "Prix Technique", "Prix de la Créativité", "Prix Innovation IA",
];

const EMPTY_FORM = { film_id: "", name: "", prize: "", description: "", edition_year: 2026 };

export default function Awards() {
  const [awards, setAwards] = useState([]);
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [awardsRes, filmsRes] = await Promise.all([
        instance.get("admin/awards"),
        instance.get("films?page=1&limit=100&all=true"),
      ]);
      setAwards(awardsRes.data || []);
      setFilms(filmsRes.data?.films || filmsRes.data?.videos || []);
    } catch (e) {
      setError("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError("");
    setDialogOpen(true);
  }

  function openEdit(award) {
    setEditing(award);
    setForm({
      film_id: award.film_id ?? "",
      name: award.name ?? "",
      prize: award.prize ?? "",
      description: award.description ?? "",
      edition_year: award.edition_year ?? 2026,
    });
    setError("");
    setDialogOpen(true);
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer ce prix ?")) return;
    try {
      await instance.delete(`admin/awards/${id}`);
      setAwards((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Erreur lors de la suppression");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.film_id || !form.name || !form.prize) {
      setError("Film, nom et type de prix sont requis.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (editing) {
        const res = await instance.put(`admin/awards/${editing.id}`, form);
        setAwards((prev) => prev.map((a) => (a.id === editing.id ? res.data : a)));
      } else {
        const res = await instance.post("admin/awards", form);
        setAwards((prev) => [...prev, res.data]);
      }
      setDialogOpen(false);
      loadAll(); // reload to get film include
    } catch {
      setError("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  }

  const columns = [
    {
      accessorKey: "film",
      header: "Film",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.film?.title ?? `#${row.original.film_id}`}</span>
      ),
    },
    {
      accessorKey: "name",
      header: "Nom du prix",
      cell: ({ getValue }) => (
        <span className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-500" />
          {getValue()}
        </span>
      ),
    },
    {
      accessorKey: "prize",
      header: "Type",
      cell: ({ getValue }) => (
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
          {getValue()}
        </span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-500 max-w-xs truncate block">{getValue() || "—"}</span>
      ),
    },
    {
      accessorKey: "edition_year",
      header: "Édition",
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={() => openEdit(row.original)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDelete(row.original.id)}>
            <CircleX className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({ data: awards, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" /> Gestion des Prix
          </h1>
          <p className="text-sm text-gray-500 mt-1">{awards.length} prix attribués</p>
        </div>
        <Button onClick={openCreate} className="bg-purple-600 hover:bg-purple-700 text-white">
          + Nouveau prix
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Chargement...</div>
      ) : awards.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-xl text-gray-400">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Aucun prix attribué</p>
          <p className="text-sm mt-1">Cliquez sur "Nouveau prix" pour commencer</p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((h) => (
                    <TableHead key={h.id}>
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier le prix" : "Nouveau prix"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="space-y-1">
              <Label>Film *</Label>
              <Select
                value={String(form.film_id)}
                onValueChange={(v) => setForm((f) => ({ ...f, film_id: Number(v) }))}
              >
                <SelectTrigger><SelectValue placeholder="Choisir un film..." /></SelectTrigger>
                <SelectContent>
                  {films.map((film) => (
                    <SelectItem key={film.id} value={String(film.id)}>
                      {film.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Nom du prix *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="ex: Grand Prix MarsAI 2026"
              />
            </div>

            <div className="space-y-1">
              <Label>Type de prix *</Label>
              <Select
                value={form.prize}
                onValueChange={(v) => setForm((f) => ({ ...f, prize: v }))}
              >
                <SelectTrigger><SelectValue placeholder="Choisir un type..." /></SelectTrigger>
                <SelectContent>
                  {PRIZE_TYPES.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Description optionnelle..."
                rows={3}
              />
            </div>

            <div className="space-y-1">
              <Label>Édition (année)</Label>
              <Input
                type="number"
                value={form.edition_year}
                onChange={(e) => setForm((f) => ({ ...f, edition_year: Number(e.target.value) }))}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={saving} className="bg-purple-600 hover:bg-purple-700 text-white">
                {saving ? "Enregistrement..." : editing ? "Sauvegarder" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
