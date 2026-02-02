import { useEffect, useState } from "react";

import { deleteUser, getUsers, updateUser } from "../../api/users.js";
import { useMutation } from "@tanstack/react-query";

import { createUser } from "../../api/users.js";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const registerSchema = z.object({
  id: z.number().optional(),
  username: z.string(),
  password: z.string(),
});

function Users() {
  const [users, setUsers] = useState([]);
  const [modeEdit, setModeEdit] = useState(false);

  useEffect(() => {
    getUsers().then((data) => {
      setUsers(data.data);
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
    setValue("username", user.username);
    setValue("password", user.password);
    setModeEdit(true);
  }

  function handleReset() {
    setValue("id", undefined);
    setValue("username", "");
    setValue("password", "");
    setModeEdit(false);
  }

  function onUpdate(updatedUser) {
    console.log(updatedUser);
    updateMutation.mutate(updatedUser);
  }

  return (
    <section className="p-8">
      <div className="border-b border-white/10 pb-6 mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Liste des utilisateurs</h2>
        {users.length > 0 &&
          users.map((user) => (
            <div key={user.id} className="flex items-center gap-3 py-2">
              <span className="text-white font-medium">{user.username}</span>
              <span className="text-white/40 text-sm">{user.password}</span>
              <button
                onClick={() => handleEdit(user)}
                className="text-sm px-3 py-1 rounded-lg bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-colors"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="text-sm px-3 py-1 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
              >
                Delete
              </button>
            </div>
          ))}
        {users.length === 0 && <div className="text-white/40">Aucun utilisateur trouvé.</div>}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Créer un utilisateur</h2>
        <form
          onSubmit={modeEdit ? handleSubmit(onUpdate) : handleSubmit(onSubmit)}
          className="space-y-4 max-w-md"
        >
          <input type="hidden" id="id" {...register("id")} />
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-white/70 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Votre nom d'utilisateur"
              {...register("username")}
              required
              className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white/70 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Votre mot de passe"
              {...register("password")}
              required
              className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex gap-3">
            {modeEdit && (
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-lg border border-white/10 text-white/60 hover:border-white/30 transition-colors"
              >
                Annuler la modification
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors"
            >
              {modeEdit ? "Mettre à jour" : "Créer un utilisateur"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Users;
