import { useEffect, useState } from "react";
import { deleteUser, getUsers, updateUser, getRoles, createUser } from "../../api/users.js";
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
  // Champs de notre formulaire
  id: z.number().optional(),
  first_name: z.string(),
  last_name: z.string(),
  password: z.string(),
  mobile: z.string().optional(),
  email: z.string(),
  phone: z.string().optional(),
  birth_date: z.string().optional(),
  street: z.string().optional(),
  postal_code: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  biography: z.string().optional(),
  current_job: z.string().optional(),
  portfolio_url: z.string().optional(),
  youtube_url: z.string().optional(),
  instagram_url: z.string().optional(),
  linkedin_url: z.string().optional(),
  facebook_url: z.string().optional(),
  tiktok_ur: z.string().optional(),
  discovery_source: z.string().optional(),
  role: z.string(),
});

function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [modeEdit, setModeEdit] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sorting, setSorting] = useState([]);

  useEffect(() => {
    getUsers().then((data) => {
      setUsers(data.data);
    });
    
    getRoles().then((data) => {
      setRoles(data.data.roles);
    });
  }, []);

  const { register, handleSubmit, setValue } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useMutation({
    mutationFn: async (newUser) => {
      return await createUser(newUser);
    },
    onSuccess: (data, variables, context) => {
      window.location.reload();
    },
  });

  function onSubmit(data) {
    return registerMutation.mutate(data);
  }

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await deleteUser(id);
    },
    onSuccess: (data, variables, context) => {
      window.location.reload();
    },
  });

  function handleDelete(id) {
    if (confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      deleteMutation.mutate(id);
    }
  }

  const updateMutation = useMutation({
    mutationFn: async (updatedUser) => {
      return await updateUser(updatedUser.id, updatedUser);
    },
    onSuccess: (data, variables, context) => {
      window.location.reload();
    },
  });

    function handleEdit(user) {
      setValue("id", user.id);
      setValue("first_name", user.first_name);
      setValue("last_name", user.last_name);
      setValue("password", "");
      setValue("mobile", user.mobile || "0606060606");
      setValue("email", user.email);
      setValue("phone", user.phone || "0606060606");
      setValue("birth_date", user.birth_date || "01/01/1999");
      setValue("street", user.street || "street");
      setValue("postal_code", user.postal_code || "06060");
      setValue("city", user.city || "Cannes");
      setValue("country", user.country || "France");
      setValue("biography", user.biography || "Something");
      setValue("current_job", user.current_job || "Unemployed");
      setValue("portfolio_url", user.portfolio_url || "https://google.com");
      setValue("youtube_url", user.youtube_url || "https://google.com");
      setValue("instagram_url", user.instagram_url || "https://google.com");
      setValue("linkedin_url", user.linkedin_url || "https://google.com");
      setValue("facebook_url", user.facebook_url || "https://google.com");
      setValue("tiktok_ur", user.tiktok_ur || "https://google.com");
      setValue("discovery_source", user.discovery_source || "https://google.com");
      setValue("role", user.role);
      setIsDialogOpen(true);
      setModeEdit(true);
  }

    function handleReset() {
      setValue("id", undefined);
      setValue("first_name", "");
      setValue("last_name", "");
      setValue("password", "");
      setValue("mobile", "");
      setValue("email", "");
      setValue("phone", "");
      setValue("birth_date", "");
      setValue("street", "");
      setValue("postal_code", "");
      setValue("city", "");
      setValue("country", "");
      setValue("biography", "");
      setValue("current_job", "");
      setValue("portfolio_url", "");
      setValue("youtube_url", "");
      setValue("instagram_url", "");
      setValue("linkedin_url", "");
      setValue("facebook_url", "");
      setValue("tiktok_ur", "");
      setValue("discovery_source", "");
      setValue("role", "");
      setIsDialogOpen(false);
      setModeEdit(false);
    }

    function onUpdate(updatedUser) {
      console.log(updateUser);
      updateMutation.mutate(updatedUser);
    }

  // Define table columns
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
      accessorKey: "role",
      header: "Rôle",
      cell: ({ row }) => (
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          {row.getValue("role")}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => handleEdit(user)}
            >
              Modifier
            </Button>
            <Button 
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(user.id)}
            >
              Supprimer
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: users,
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
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Liste des utilisateurs</h2>
          <Dialog open={isDialogOpen && !modeEdit} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) handleReset();
          }}>
            <DialogTrigger asChild>
              <Button>Créer un utilisateur</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Créer un utilisateur</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour créer un nouvel utilisateur
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input type="hidden" id="id" {...register("id")} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-2">
                  <FormField label="Prénom" id="first_name" register={register} required />
                  <FormField label="Nom" id="last_name" register={register} required />
                  <FormField label="Email" id="email" type="email" register={register} required />
                  <FormField label="Mot de passe" id="password" type="password" register={register} required />
                  <FormField label="Mobile" id="mobile" register={register} />
                  <FormField label="Téléphone" id="phone" register={register} />
                  <FormField label="Date de naissance" id="birth_date" type="date" register={register} />
                  <FormField label="Rue" id="street" register={register} />
                  <FormField label="Code postal" id="postal_code" register={register} />
                  <FormField label="Ville" id="city" register={register} />
                  <FormField label="Pays" id="country" register={register} />
                  <FormField label="Emploi actuel" id="current_job" register={register} />
                </div>

                <FormField label="Biographie" id="biography" type="textarea" register={register} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Portfolio URL" id="portfolio_url" type="url" register={register} />
                  <FormField label="YouTube URL" id="youtube_url" type="url" register={register} />
                  <FormField label="Instagram URL" id="instagram_url" type="url" register={register} />
                  <FormField label="LinkedIn URL" id="linkedin_url" type="url" register={register} />
                  <FormField label="Facebook URL" id="facebook_url" type="url" register={register} />
                  <FormField label="TikTok URL" id="tiktok_ur" type="url" register={register} />
                  <FormField label="Source de découverte" id="discovery_source" register={register} />
                  <FormField label="Rôle" id="role" type="select" register={register} options={roles} />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleReset}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    Créer un utilisateur
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {users.length > 0 ? (
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
                        Aucun utilisateur trouvé.
                      </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">Aucun utilisateur trouvé.</div>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={isDialogOpen && modeEdit} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) handleReset();
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier un utilisateur</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'utilisateur
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
            <input type="hidden" id="id" {...register("id")} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Prénom" id="first_name" register={register} required />
              <FormField label="Nom" id="last_name" register={register} required />
              <FormField label="Email" id="email" type="email" register={register} required />
              <FormField label="Mot de passe" id="password" type="password" register={register} placeholder="Laisser vide pour ne pas changer" />
              <FormField label="Mobile" id="mobile" register={register} />
              <FormField label="Téléphone" id="phone" register={register} />
              <FormField label="Date de naissance" id="birth_date" type="date" register={register} />
              <FormField label="Rue" id="street" register={register} />
              <FormField label="Code postal" id="postal_code" register={register} />
              <FormField label="Ville" id="city" register={register} />
              <FormField label="Pays" id="country" register={register} />
              <FormField label="Emploi actuel" id="current_job" register={register} />
            </div>

            <FormField label="Biographie" id="biography" type="textarea" register={register} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Portfolio URL" id="portfolio_url" type="url" register={register} />
              <FormField label="YouTube URL" id="youtube_url" type="url" register={register} />
              <FormField label="Instagram URL" id="instagram_url" type="url" register={register} />
              <FormField label="LinkedIn URL" id="linkedin_url" type="url" register={register} />
              <FormField label="Facebook URL" id="facebook_url" type="url" register={register} />
              <FormField label="TikTok URL" id="tiktok_ur" type="url" register={register} />
              <FormField label="Source de découverte" id="discovery_source" register={register} />
              <FormField label="Rôle" id="role" type="select" register={register} options={roles} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleReset}>
                Annuler
              </Button>
              <Button type="submit">
                Mettre à jour
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default Users;
