import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import { getProfileById, updateProfile } from '../../api/profile.js'; 
import { getRecentUploads } from '../../api/upload.js';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { useEffect } from 'react';

const profileSchema = z.object({
  first_name: z.string().min(1, "Le prénom est requis"),
  last_name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  birth_date: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  biography: z.string().optional(),
  current_job: z.string().optional(),
  portfolio_url: z.string().url("URL invalide").optional().or(z.literal("")),
  youtube_channel: z.string().url("URL invalide").optional().or(z.literal("")),
});



export default function Profile() {
  const { t } = useTranslation();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: apiResponse, isLoading, error } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => getProfileById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

const { data: recentVideos, isLoading: videosLoading } = useQuery({
  queryKey: ['recentVideos', id],
  queryFn: () => getRecentUploads(id),
  enabled: !!id && !!localStorage.getItem("token"),
});

  const user = apiResponse?.data;

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: user || {},
  });

  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user, reset]);

  const updateMutation = useMutation({
    mutationFn: (updatedData) => updateProfile(id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries(['profile', id]); 
      setIsEditing(false);
      alert(t('profile.update_success') || "Profil mis à jour !");
    },
    onError: (err) => {
      alert(err.message || t('profile.update_error') || "Erreur lors de la mise à jour");
    },
  });

  const onSubmit = (data) => {
    updateMutation.mutate(data);
  };

  if (isLoading) return <div className="text-center py-20 text-gray-400">Chargement...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Erreur : {error.message}</div>;
  if (!user) return <div className="text-center py-20 text-gray-400">Profil non trouvé</div>;

  return (
    <div className="bg-black text-white min-h-screen px-6 py-16">
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold tracking-wide">{t('profile.title') || "Mon Profil"}</h1>
        <p className="text-gray-400 mt-3 tracking-widest text-sm">
          {t('profile.subtitle') || "Vos informations personnelles"}
        </p>
      </section>

    <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {t('profile.recent_videos') || "Mes vidéos récentes"}
        </h2>

        {videosLoading ? (
          <p className="text-center text-gray-400 py-8 animate-pulse">
            Chargement des vidéos récentes...
          </p>
        ) : recentVideos?.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {recentVideos.map((video) => (
              <div key={video.id} className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-pink-500 transition">
               <div className="aspect-video bg-black relative">
  {video.thumbnail ? (
    <img 
      src={`http://localhost:3000/${video.thumbnail}`}   
      alt={video.title || "Vidéo"}
      className="w-full h-full object-cover"
      onError={(e) => {
        e.target.src = '/placeholder-thumbnail.jpg';
        e.target.onerror = null;
      }}
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-gray-500">
      Pas de miniature
    </div>
  )}
</div>

                <div className="p-4">
                  <h3 className="font-semibold line-clamp-2">{video.title || "Sans titre"}</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(video.created_at).toLocaleDateString('fr-FR')}
                  </p>

                 
                
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Vous n'avez pas encore uploadé de vidéo.
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {!isEditing && (
          <div className="text-right mb-6">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-full transition text-white font-medium"
            >
              <Pencil size={18} />
              {t('profile.edit_profile') || "Modifier mon profil"}
            </button>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-gray-900/50 p-8 rounded-xl border border-gray-800">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">{t('profile.first_name') || "Prénom"}</label>
                <input {...register('first_name')} className="w-full p-3 bg-black border border-gray-600 rounded-lg" />
                {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('profile.last_name') || "Nom"}</label>
                <input {...register('last_name')} className="w-full p-3 bg-black border border-gray-600 rounded-lg" />
                {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('profile.email') || "Email"}</label>
                <input {...register('email')} className="w-full p-3 bg-black border border-gray-600 rounded-lg" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('profile.phone') || "Téléphone"}</label>
                <input {...register('phone')} className="w-full p-3 bg-black border border-gray-600 rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('profile.mobile') || "Mobile"}</label>
                <input {...register('mobile')} className="w-full p-3 bg-black border border-gray-600 rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('profile.birth_date') || "Date de naissance"}</label>
                <input type="date" {...register('birth_date')} className="w-full p-3 bg-black border border-gray-600 rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('profile.country') || "Pays"}</label>
                <input {...register('country')} className="w-full p-3 bg-black border border-gray-600 rounded-lg" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">{t('profile.biography') || "Biographie"}</label>
                <textarea {...register('biography')} rows={4} className="w-full p-3 bg-black border border-gray-600 rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('profile.current_job') || "Emploi actuel"}</label>
                <input {...register('current_job')} className="w-full p-3 bg-black border border-gray-600 rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('profile.portfolio_url') || "Portfolio URL"}</label>
                <input {...register('portfolio_url')} className="w-full p-3 bg-black border border-gray-600 rounded-lg" placeholder="https://" />
              </div>

              
            </div>

            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg transition disabled:opacity-50"
              >
                {updateMutation.isPending ? "Enregistrement..." : t('profile.save') || "Enregistrer"}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 bg-gray-900/50 p-8 rounded-xl border border-gray-800">
              <h2 className="text-2xl font-semibold border-b border-pink-500 pb-2">
                {t('profile.personal_info') || "Informations personnelles"}
              </h2>
              <p><strong>{t('profile.first_name') || "Prénom"} :</strong> {user.first_name || "—"}</p>
              <p><strong>{t('profile.last_name') || "Nom"} :</strong> {user.last_name || "—"}</p>
              <p><strong>{t('profile.email') || "Email"} :</strong> {user.email || "—"}</p>
              <p><strong>{t('profile.phone') || "Téléphone"} :</strong> {user.phone || "—"}</p>
              <p><strong>{t('profile.city') || "Ville"} :</strong> {user.city || "—"}</p>
              <p><strong>{t('profile.country') || "Pays"} :</strong> {user.country || "—"}</p>
              <p>
                <strong>{t('profile.created_at') || "Inscrit le"} :</strong>{' '}
                {user.created_at ? (
                  <time dateTime={user.created_at}>
                    {new Date(user.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                ) : "—"}
              </p>
            </div>

            <div className="space-y-6 bg-gray-900/50 p-8 rounded-xl border border-gray-800">
              <h2 className="text-2xl font-semibold border-b border-pink-500 pb-2">
                {t('profile.other_info') || "Autres informations"}
              </h2>
            
              <p><strong>{t('profile.mobile') || "Mobile"} :</strong> {user.mobile || "—"}</p>
              <p>
                <strong>{t('profile.birth_date') || "Date de naissance"} :</strong>{' '}
                {user.birth_date ? (
                  <time dateTime={user.birth_date}>
                    {new Date(user.birth_date).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                ) : "—"}
              </p>
              <p><strong>{t('profile.street') || "Rue"} :</strong> {user.street || "—"}</p>
              <p><strong>{t('profile.postal_code') || "Code postal"} :</strong> {user.postal_code || "—"}</p>
              <p>
                <strong>{t('profile.biography') || "Biographie"} :</strong>{' '}
                {user.biography ? (
                  <span className="whitespace-pre-wrap block mt-1 text-gray-300">{user.biography}</span>
                ) : "—"}
              </p>
              <p><strong>{t('profile.current_job') || "Emploi actuel"} :</strong> {user.current_job || "—"}</p>
              <p>
                <strong>{t('profile.portfolio_url') || "Portfolio"} :</strong>{' '}
                {user.portfolio_url ? (
                  <a href={user.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:underline break-all">
                    {user.portfolio_url}
                  </a>
                ) : "—"}
              </p>
            </div>
          </div>
        )}
      </div>



    </div>
  );
}