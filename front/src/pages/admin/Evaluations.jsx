import { useEffect, useState } from "react";
import { getEvaluations } from "../../api/evaluations.js";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

function Evaluations() {
  const [evaluations, setEvaluations] = useState([]);
  const [sorting, setSorting] = useState([]);

  useEffect(() => {
    getEvaluations()
      .then((res) => setEvaluations(Array.isArray(res.data) ? res.data : (res.data.evaluations || [])))
      .catch(() => {});
  }, []);

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      header: "Film",
      accessorFn: (row) => row.film?.title || `Film #${row.film_id}`,
    },
    {
      header: "Jury",
      accessorFn: (row) => row.jury ? `${row.jury.first_name} ${row.jury.last_name}` : `User #${row.user_id}`,
    },
    {
      accessorKey: "decision",
      header: "Decision",
      cell: ({ row }) => {
        const v = row.getValue("decision");
        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${v === "YES" ? "bg-green-100 text-green-800" : v === "MAYBE" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
            {v}
          </span>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleDateString("fr-FR"),
    },
  ];

  const table = useReactTable({
    data: evaluations,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  });

  const yesCount = evaluations.filter((e) => e.decision === "YES").length;
  const noCount = evaluations.filter((e) => e.decision === "NO").length;

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Evaluations du Jury</h2>
          <div className="flex gap-4 text-sm">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
              YES: {yesCount}
            </span>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full font-medium">
              NO: {noCount}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full font-medium">
              Total: {evaluations.length}
            </span>
          </div>
        </div>

        {evaluations.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
        ) : (
          <div className="text-gray-500">Aucune evaluation trouvée.</div>
        )}
      </div>
    </section>
  );
}

export default Evaluations;
