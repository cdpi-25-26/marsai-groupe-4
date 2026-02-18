import { useEffect, useState } from "react";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../../api/events.js";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import FormField from "@/components/FormField";


const registerSchema = z.object({

    id: z.number().optional(),
    title: z.string(),
    description: z.string().optional(),
    location: z.string().optional(),
    type: z.string(),
    event_date: z.string(),
})




function Events(){

    const [events, setEvents] = useState([]);
    const [modeEdit, setModeEdit] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [sorting, setSorting] = useState([]);

    useEffect(() => {
        getEvents().then((data) => {
        setEvents(data.data);
        });
    }, []);

    const { register, handleSubmit, setValue } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const registerMutation = useMutation({
        mutationFn: async (newEvent) => {
            return await createEvent(newEvent);
        },
        onSuccess: (data, variables, context) => {
            window.location.reload();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            return await deleteEvent(id);
        },
        onSuccess: (data, variables, context) => {
            window.location.reload();
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (updatedEvent) => {
            return await updateEvent(updatedEvent.id, updatedEvent);
        },
        onSuccess: (data, variables, context) => {
            window.location.reload();
        },
    });

    function onSubmit(data) {
        return registerMutation.mutate(data);
    }

    function handleEdit(event) {
        setValue("id", event.id);
        setValue("title", event.title);
        setValue("description", event.last_name);
        setValue("location", event.location);
        setValue("type", event.type);
        setValue("event_date", event.event_date);

        setIsDialogOpen(true);
        setModeEdit(true);

    }

    function handleReset() {
        setValue("id", undefined);
        setValue("title", "");
        setValue("description", "");
        setValue("location", "");
        setValue("type", "");
        setValue("event_date", "");

        setIsDialogOpen(false);
        setModeEdit(false);
    }
    
    function onUpdate(updateEvent) {
        console.log(updateEvent);
        updateMutation.mutate(updateEvent);
    }


    function handleDelete(id) {
        if (confirm("Voulez-vous vraiment supprimer cet evennement?")) {
            deleteMutation.mutate(id);
        }
    }

    const columns = [

        {
            accessorKey: "title",
            header: "Title",
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {row.getValue("type")}
                </span>
            ),
        },
        {
            accessorKey: "location",
            header: "Location",
        },
        {
            accessorKey: "event_date",
            header: "Date",
        },
        {
            accessorKey: "description",
            header: "Description"
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const event = row.original;
                return (
                    <div className="flex gap-2 justify-end">
                        <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(event)}
                        >
                            Modifier
                        </Button>
                        <Button 
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(event.id)}
                        >
                            Supprimer
                        </Button>
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data: events,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
        onSortingChange: setSorting,
    })

    return (
        <section className="container mx-auto px-4 py-8">

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Liste des Evennements</h2>
                    <Dialog open={isDialogOpen && !modeEdit} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) handleReset();
                    }} >
                        <DialogTrigger asChild>
                            <Button>Créer un Evennement</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Créer un Evennement</DialogTitle>
                                <DialogDescription>
                                    Remplissez les informations pour créer un nouvel evennement
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <input type="hidden" id="id" {...register("id")} />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-2">
                                    <FormField label="Title" id="title" register={register} required />
                                    <FormField label="Description" id="description" register={register} required />
                                    <FormField label="Localization" id="location" register={register} required />
                                    <FormField label="Type" id="type" register={register} required />
                                    <FormField label="Date" id="event_date" register={register} required />
                                </div>

                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={handleReset}>Annuler</Button>
                                    <Button type="submit">Créer un utilisateur</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                
                {events.length > 0 ? (
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
                                            Aucun evennement trouvé.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                ) : (
                    <div>Aucun evennement trouvé.</div>
                )}
            </div>

            <Dialog open={isDialogOpen && modeEdit} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) handleReset();
            }}>
                
            </Dialog>

        </section>

    
)
}

export default Events;
