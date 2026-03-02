// src/pages/Profile.jsx
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getProfileById } from '../../api/profile.js';

export default function Profile() {
  const { t } = useTranslation();
  const { id } = useParams();

  const { data: apiResponse, isLoading, error } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => getProfileById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  // Le vrai utilisateur est dans apiResponse.data
  const user = apiResponse?.data;

  console.log("[Profile] apiResponse complet :", apiResponse);
  console.log("[Profile] user extrait :", user);

  if (isLoading) {
    return <div className="text-center py-20 text-gray-400">Chargement du profil...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">Erreur : {error.message}</div>;
  }

  if (!user) {
    return <div className="text-center py-20 text-gray-400">Profil non trouvé</div>;
  }

  return (
    <div className="bg-black text-white min-h-screen px-6 py-16">
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold tracking-wide">{t('profile.title') || "Mon Profil"}</h1>
        <p className="text-gray-400 mt-3 tracking-widest text-sm">
          {t('profile.subtitle') || "Vos informations personnelles"}
        </p>
      </section>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
        <div className="space-y-6 bg-gray-900/50 p-8 rounded-xl border border-gray-800">
          <h2 className="text-2xl font-semibold border-b border-pink-500 pb-2">
            {t('profile.personal_info') || "Informations personnelles"}
          </h2>
          <p><strong>{t('profile.first_name') || "Prénom"} :</strong> {user.first_name || "—"}</p>
          <p><strong>{t('profile.last_name') || "Nom"} :</strong> {user.last_name || "—"}</p>
          <p><strong>{t('profile.email') || "Email"} :</strong> {user.email || "—"}</p>
          <p><strong>{t('profile.role') || "Rôle"} :</strong> {user.role || "—"}</p>
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
          <p><strong>{t('profile.phone') || "Téléphone"} :</strong> {user.phone || "—"}</p>
          <p><strong>{t('profile.mobile') || "Entreprise"} :</strong> {user.mobile || "—"}</p>
          <p><strong>{t('profile.country') || "Pays"} :</strong> {user.country || "—"}</p>
          <p><strong>{t('profile.city') || "Ville"} :</strong> {user.city || "—"}</p>
        </div>
      </div>
    </div>
  );
}