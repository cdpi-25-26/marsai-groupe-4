import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { getUserById, updateUser } from '../../api/users.js';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect } from 'react';

// Schéma Zod pour validation du form update
const profileSchema = z.object({
  first_name: z.string().min(2, "Le prénom doit avoir au moins 2 caractères"),
  last_name: z.string().min(2, "Le nom doit avoir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  // Ajoute d'autres champs si besoin (ex: password, phone, etc.)
});

export default function Profile() {
  const { t } = useTranslation();
  const { id } = useParams(); // si /profile/:id, sinon utilise user connecté

  // Fetch user data
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id || 'me'), // 'me' pour user connecté si pas d'id
  });

  // Form pour update
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(profileSchema),
  });

  // Reset form avec user data quand chargé
  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      });
    }
  }, [user, reset]);

  // Mutation pour update
  const updateMutation = useMutation({
    mutationFn: (data) => updateUser(id || 'me', data),
    onSuccess: () => {
      // Refresh data ou toast succès
      alert(t('profile.update_success'));
    },
    onError: () => {
      alert(t('profile.update_error'));
    },
  });

  const onSubmit = (data) => {
    updateMutation.mutate(data);
  };

  if (isLoading) return <p>{t('profile.loading')}</p>;
  if (error) return <p>{t('profile.error')}</p>;
  if (!user) return <p>{t('profile.no_user')}</p>;

  return (
    <div className="bg-black text-white min-h-screen px-6 py-16">
      <section className="w-full max-w-4xl mb-20">
        <div className="flex items-center gap-3 text-pink-500 mb-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="uppercase tracking-widest text-sm">{t('profile.info')}</span>
        </div>

        <h1 className="text-5xl font-bold">{t('profile.title')}</h1>
        <p className="text-gray-400 mt-3 tracking-widest text-sm">
          {t('profile.subtitle')}
        </p>
      </section>

      {/* Infos utilisateur */}
      <section className="w-full max-w-4xl mb-20">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">{t('profile.personal_info')}</h2>
            <p><strong>{t('profile.first_name')}:</strong> {user.first_name}</p>
            <p><strong>{t('profile.last_name')}:</strong> {user.last_name}</p>
            <p><strong>{t('profile.email')}:</strong> {user.email}</p>
            <p><strong>{t('profile.role')}:</strong> {user.role}</p>
            <p><strong>{t('profile.created_at')}:</strong> 
              <time dateTime={user.created_at}>{new Date(user.created_at).toLocaleDateString(t('lang'), { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">{t('profile.other_info')}</h2>
            <p><strong>{t('profile.phone')}:</strong> {user.phone || t('profile.no_info')}</p>
            <p><strong>{t('profile.company')}:</strong> {user.company || t('profile.no_info')}</p>
            <p><strong>{t('profile.country')}:</strong> {user.country || t('profile.no_info')}</p>
            <p><strong>{t('profile.discovery_source')}:</strong> {user.discovery_source || t('profile.no_info')}</p>
          </div>
        </div>
      </section>

      {/* Form update */}
      <section className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-6">{t('profile.update_profile')}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-gray-900 p-8 rounded-xl">
          <div>
            <label className="block text-sm font-medium mb-2">{t('profile.first_name')}</label>
            <input
              {...register('first_name')}
              className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white focus:border-pink-500 focus:ring-pink-500"
            />
            {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('profile.last_name')}</label>
            <input
              {...register('last_name')}
              className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white focus:border-pink-500 focus:ring-pink-500"
            />
            {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('profile.email')}</label>
            <input
              {...register('email')}
              className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white focus:border-pink-500 focus:ring-pink-500"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
          >
            {t('profile.save_changes')}
          </button>
        </form>
      </section>
    </div>
  );
}