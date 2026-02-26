import { useEffect, useState } from 'react';

function ConfirmModal({ isOpen, onClose, onConfirm, data }) {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      const timer = setTimeout(() => setShouldAnimate(true), 10);
      document.body.style.overflow = 'hidden';
      return () => clearTimeout(timer);
    } else {
      setShouldAnimate(false);
      const timer = setTimeout(() => setIsMounted(false), 300);
      document.body.style.overflow = 'auto';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isMounted) return null;

  const formatVal = (val, limit = 40) => {
    if (!val) return "—";
    const text = typeof val === 'string' ? val : val.name; 
    if (!text) return "—";
    return text.length > limit ? text.slice(0, limit) + '...' : text;
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-in-out
        ${shouldAnimate ? 'opacity-100 backdrop-blur-md bg-black/60' : 'opacity-0 backdrop-blur-0 bg-black/0'}`}
      onClick={onClose}
    >
      <div
        className={`bg-zinc-900/90 border border-white/10 rounded-2xl px-6 py-8 max-w-2xl w-full space-y-6 shadow-2xl transform transition-all duration-300
          ${shouldAnimate 
            ? 'scale-100 translate-y-0 opacity-100 ease-[cubic-bezier(0.34,1.56,0.64,1)]' 
            : 'scale-95 translate-y-4 opacity-0 ease-in'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-white text-center uppercase tracking-[3px]">
          Confirmer l'envoi
        </h3>

      
        <div className="space-y-4 text-sm text-gray-400 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar border-y border-white/5 py-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <p><strong className="text-gray-200 block text-[10px] uppercase tracking-wider">Titre</strong> 
                <span className="text-gray-300">{formatVal(data.title)}</span></p>
              
              <p><strong className="text-gray-200 block text-[10px] uppercase tracking-wider">Titre traduit</strong> 
                <span className="text-gray-300">{formatVal(data.translated_title)}</span></p>
              
              <p><strong className="text-gray-200 block text-[10px] uppercase tracking-wider">Langue</strong> 
                <span className="text-gray-300">{data.language || "—"}</span></p>

              <p><strong className="text-gray-200 block text-[10px] uppercase tracking-wider">Outils IA</strong> 
                <span className="text-gray-300">{formatVal(data.ai_tools)}</span></p>
            </div>

            <div className="space-y-3">
              <p><strong className="text-gray-200 block text-[10px] uppercase tracking-wider">Synopsis</strong> 
                <span className="text-gray-300 italic">"{formatVal(data.synopsis, 60)}"</span></p>
              
              <p><strong className="text-gray-200 block text-[10px] uppercase tracking-wider">Synopsis Anglais</strong> 
                <span className="text-gray-300 italic">"{formatVal(data.synopsis_en, 60)}"</span></p>
            </div>
          </div>

          <hr className="border-white/5" />

      
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-white/5 p-3 rounded-lg">
            <div>
              <strong className="text-[#741748] block text-[10px] uppercase font-bold">Vidéo</strong>
              <span className="text-xs text-gray-300 truncate block">{formatVal(data.video?.name, 20)}</span>
            </div>
            <div>
              <strong className="text-[#741748] block text-[10px] uppercase font-bold">Sous-titres</strong>
              <span className="text-xs text-gray-300 truncate block">{formatVal(data.subtitles?.name, 20)}</span>
            </div>
            <div>
              <strong className="text-[#741748] block text-[10px] uppercase font-bold">Thumbnail</strong>
              <span className="text-xs text-gray-300 truncate block">{formatVal(data.thumbnail?.name, 20)}</span>
            </div>
            <div>
              <strong className="text-[#741748] block text-[10px] uppercase font-bold">Image 2</strong>
              <span className="text-xs text-gray-300 truncate block">{formatVal(data.image_2?.name, 20)}</span>
            </div>
            <div>
              <strong className="text-[#741748] block text-[10px] uppercase font-bold">Image 3</strong>
              <span className="text-xs text-gray-300 truncate block">{formatVal(data.image_3?.name, 20)}</span>
            </div>
          </div>
        </div>

  
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-5 py-3 uppercase text-xs font-bold bg-white/5 text-white border border-white/10 rounded-xl hover:bg-white/0 transition-all cursor-pointer"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-5 py-3 uppercase text-xs font-bold bg-[#741748] text-white border border-white/10 rounded-xl hover:bg-white/0 shadow-lg shadow-[#741748]/20 transition-all active:scale-95 cursor-pointer"
          >
            Confirmer et envoyer
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;