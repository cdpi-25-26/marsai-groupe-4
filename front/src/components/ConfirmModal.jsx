function ConfirmModal({ isOpen, onClose, onConfirm, data }) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 space-y-6">
        <h3 className="text-xl font-bold text-gray-900 text-center">
          Confirmer l'envoi
        </h3>

        <div className="space-y-3 text-gray-800">
          <p><strong>Titre :</strong> {data.title || "—"}</p>
          <p><strong>Titre traduit :</strong> {data.translated_title || "—"}</p>
          <p><strong>Synopsis :</strong> {data.synopsis || "—"}</p>
          <p><strong>Langue :</strong> {data.language || "—"}</p>
          <p><strong>Synopsis anglais :</strong> {data.synopsis_en || "—"}</p>
          <p><strong>Outils IA :</strong> {data.ai_tools || "—"}</p>
          <p><strong>Sous-titres :</strong> {data.subtitles?.name || "—"}</p>
          <p><strong>Vidéo :</strong> {data.video?.name || "—"}</p>
          <p><strong>Thumbnail :</strong> {data.thumbnail?.name || "—"}</p>
          <p><strong>Image 2 :</strong> {data.image_2?.name || "—"}</p>
          <p><strong>Image 3 :</strong> {data.image_3?.name || "—"}</p>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Confirmer et envoyer
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;