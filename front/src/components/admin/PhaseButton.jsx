import { useContest } from '../../utils/phasestatus.jsx';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export default function PhaseSwitcherButton() {
  const { contestStatus, loading: statusLoading } = useContest();
  const queryClient = useQueryClient();

  const promoteMutation = useMutation({
  mutationFn: async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Aucun token. Veuillez vous reconnecter.");

    const res = await axios.post('http://localhost:3000/phase/promote', {
      edition_year: contestStatus?.currentEdition,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },
  onSuccess: () => {
    console.log("Phase suivante activée !");
    queryClient.invalidateQueries({ queryKey: ['contestStatus'] });
    queryClient.invalidateQueries({ queryKey: ['videos'] });
    queryClient.refetchQueries({ queryKey: ['contestStatus'] }); 
    setTimeout(() => window.location.reload(), 500);
  },
  onError: (err) => {
    console.log("Erreur : " + (err.response?.data?.error || err.message));
  },
});

const demoteMutation = useMutation({
  mutationFn: async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Aucun token. Veuillez vous reconnecter.");

    const res = await axios.post('http://localhost:3000/phase/revert', {
      edition_year: contestStatus?.currentEdition,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },
  onSuccess: () => {
    console.log("Retour à la phase précédente !");
    queryClient.invalidateQueries({ queryKey: ['contestStatus'] });
    queryClient.invalidateQueries({ queryKey: ['videos'] });
    queryClient.refetchQueries({ queryKey: ['contestStatus'] }); 
    setTimeout(() => window.location.reload(), 500);
  },
  onError: (err) => {
   console.log("Erreur : " + (err.response?.data?.error || err.message));
  },
});

  if (statusLoading) {
    return (
      <Button disabled variant="outline" className="w-full justify-start gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Chargement...</span>
      </Button>
    );
  }

  if (!contestStatus) {
    return (
      <Button disabled variant="outline" className="w-full justify-start gap-2">
        <span>Statut indisponible</span>
      </Button>
    );
  }

  const currentPhase = contestStatus.currentPhase;

  // Texte du bouton principal
  let mainButtonText = "Passer à la phase suivante";
  let mainDisabled = false;

  if (currentPhase === "phase1") {
    mainButtonText = "Publier le Top 50 (Phase 2)";
  } else if (currentPhase === "phase2") {
    mainButtonText = "Finaliser le palmarès (Phase 3)";
  } else if (currentPhase === "phase3") {
    mainButtonText = "Concours terminé";
    mainDisabled = true;
  } else {
    mainButtonText = "Aucun concours actif";
    mainDisabled = true;
  }

  return (
    <div className="space-y-2">
      {/* Bouton principal : passer à la suivante */}
      <Button
        onClick={() => promoteMutation.mutate()}
        disabled={mainDisabled || promoteMutation.isPending}
        variant="outline"
        className={`
          w-full justify-start gap-2 
          border-pink-500/30 
          hover:bg-pink-900/30 
          hover:text-pink-300 
          transition-colors
          ${mainDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {promoteMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
        <span>{mainButtonText}</span>
      </Button>

      {/* Bouton revenir en arrière */}
      <Button
        variant="outline"
        className="
          w-full justify-start gap-2 
          border-red-500/30 
          hover:bg-red-900/30 
          hover:text-red-300 
          transition-colors
        "
        disabled={currentPhase === "phase1" || demoteMutation.isPending}
        onClick={() => {
          if (!confirm("Revenir en arrière supprimera les prix et les sélections. Continuer ?")) return;
          demoteMutation.mutate();
        }}
      >
        {demoteMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowLeft className="h-4 w-4" />
        )}
        <span>Revenir en phase précédente</span>
      </Button>
    </div>
  );
}