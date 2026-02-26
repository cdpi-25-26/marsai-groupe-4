import { useEffect, useState } from "react";
import { getEvents, createEvent, updateEvent, deleteEvent, getTypes } from "../../api/events.js";
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
    id: z.preprocess((val) => {
        if (val === "" || val === undefined || val === null) return undefined;
        return Number(val);
    }, z.number().optional()),
    title: z.string().min(1, "Le titre est requis"),
    description: z.string().optional(),
    location: z.string().optional(),
    type: z.string().min(1, "Le type est requis"),
    event_date: z.string().min(1, "La date est requise"),
})




function Events(){

    const [events, setEvents] = useState([]);
    const [types, setTypes] = useState([]);
    const [modeEdit, setModeEdit] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [sorting, setSorting] = useState([]);

    useEffect(() => {
        getEvents().then((data) => {
        setEvents(data.data);
        });

        getTypes().then((data) => {
            setTypes(data.data.types);
        });
    }, []);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const registerMutation = useMutation({
        mutationFn: async (newEvent) => {
            return await createEvent(newEvent);
        },
        onSuccess: (data, variables, context) => {
            window.location.reload();
        },
        onError: (error) => {
            console.error('Error creating event:', error);
            alert('Erreur lors de la création: ' + (error.response?.data?.error || error.message));
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            return await deleteEvent(id);
        },
        onSuccess: (data, variables, context) => {
            window.location.reload();
        },
        onError: (error) => {
            console.error('Error deleting event:', error);
            alert('Erreur lors de la suppression: ' + (error.response?.data?.error || error.message));
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (updatedEvent) => {
            return await updateEvent(updatedEvent.id, updatedEvent);
        },
        onSuccess: (data, variables, context) => {
            window.location.reload();
        },
        onError: (error) => {
            console.error('Error updating event:', error);
            alert('Erreur lors de la mise à jour: ' + (error.response?.data?.error || error.message));
        },
    });

    function onSubmit(data) {
        console.log('Form submitted with data:', data);
        if (modeEdit && data.id) {
            return updateMutation.mutate(data);
        } else {
            return registerMutation.mutate(data);
        }
    }

    function handleEdit(event) {
        setValue("id", event.id);
        setValue("title", event.title);
        setValue("description", event.description);
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

                                {Object.keys(errors).length > 0 && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                        <p className="font-medium">Erreurs de validation:</p>
                                        <ul className="list-disc list-inside">
                                            {Object.entries(errors).map(([key, error]) => (
                                                <li key={key}>{error.message}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField label="Title" id="title" type="text" register={register} required />
                                    <FormField label="Type" id="type" type="select" register={register} required options={types}/>
                                    <FormField label="Date" id="event_date" type="date" register={register} required />
                                    <FormField label="Localization" id="location" type="text" register={register} />
                                    <div className="md:col-span-2">
                                        <FormField label="Description" id="description" type="textarea" register={register} rows={3} />
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={handleReset}>Annuler</Button>
                                    <Button type="submit">Créer un evennement</Button>
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
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Modifier l'Evennement</DialogTitle>
                        <DialogDescription>
                            Modifiez les informations de l'evennement
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <input type="hidden" id="id" {...register("id")} />

                        {Object.keys(errors).length > 0 && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                <p className="font-medium">Erreurs de validation:</p>
                                <ul className="list-disc list-inside">
                                    {Object.entries(errors).map(([key, error]) => (
                                        <li key={key}>{error.message}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField label="Title" id="title" type="text" register={register} required />
                            <FormField label="Type" id="type" type="select" register={register} required options={types}/>
                            <FormField label="Date" id="event_date" type="date" register={register} required />
                            <FormField label="Localization" id="location" type="text" register={register} />
                            <div className="md:col-span-2">
                                <FormField label="Description" id="description" type="textarea" register={register} rows={3} />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleReset}>Annuler</Button>
                            <Button type="submit">Modifier l'evennement</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

        </section>

    
)
}

export default Events;
