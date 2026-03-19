# 🎬 MarsAI Festival — Livraison Projet

> Plateforme complète de gestion de festival de cinéma IA
> **Frontend** → https://front-two-olive.vercel.app
> **API** → https://marsai-api.fly.dev

---

## ✅ Ce qui est livré et fonctionnel

### 🌐 Site public
| Page | Description |
|------|-------------|
| **Page d'accueil** | Hero animé, aperçu des films, événements, sponsors, localisation Marseille |
| **Galerie des films** | Grille paginée avec filtres (outil IA, statut, recherche) + bannière glassmorphism |
| **Fiche film** | Lecteur YouTube intégré, synopsis, métadonnées, outils IA utilisés |
| **Palmarès** | Top 3 mis en valeur + mentions honorables |
| **Événements** | 4 événements créés (Ouverture, Masterclass, Projection, Clôture) avec filtres |
| **Réservations** | Formulaire de réservation avec compteur de capacité |
| **Contact** | Formulaire + carte Google Maps + infos transport Marseille |

### 🎥 Espace Jury
| Fonctionnalité | Description |
|----------------|-------------|
| **Interface de vote** | Cartes swipables (mobile + desktop), raccourcis clavier ←/→ |
| **Lecteur YouTube** | Visionnage obligatoire avant vote, bouton confirmation |
| **Filtres** | Par langue, par type (100% IA / Hybride) |
| **Undo** | Annulation du dernier vote (Ctrl+Z) |
| **Stats** | Toast avec résultats après chaque vote |
| **Redirection auto** | Le jury arrive directement sur sa page après login |

### 🎬 Espace Producteur
| Fonctionnalité | Description |
|----------------|-------------|
| **Dashboard** | Vue de ses films soumis avec statuts et phases |
| **Soumission** | Upload vidéo (MP4/MOV), thumbnail, sous-titres, synopsis FR/EN |
| **Profil** | Édition complète du profil |
| **Redirection auto** | Producteur arrive sur son dashboard après login |

### 🛠 Panel Admin
| Section | Description |
|---------|-------------|
| **Dashboard** | Statistiques globales (films, users, évaluations) |
| **Films** | CRUD complet, changement de statut, attribution de prix |
| **Utilisateurs** | Gestion des rôles (ADMIN / JURY / PRODUCER) |
| **Jury** | Assignation des films aux membres du jury |
| **Événements** | Création et gestion des événements |
| **🆕 Prix & Palmarès** | Page dédiée CRUD complet des récompenses |
| **🆕 Phases** | Gestion des phases du concours (Phase 1→2→3) avec promotion automatique des Top 50 |
| **Évaluations** | Tableau de bord des votes jury |
| **CMS** | Éditeur de traductions FR/EN |
| **Paramètres** | Configuration SMTP, sécurité |

### ⚙️ Infrastructure
| Élément | Détail |
|---------|--------|
| **Backend** | Node.js / Express / Sequelize — Fly.io (Paris CDG) |
| **Frontend** | React / Vite / Tailwind — Vercel (Edge Network) |
| **Base de données** | PostgreSQL — Fly Postgres (HA) |
| **Auth** | JWT 24h, roles RBAC (ADMIN / JURY / PRODUCER / PUBLIC) |
| **Migrations** | Auto-migration au déploiement via `sequelize-cli` |
| **CI** | Push GitHub → deploy automatique |

---

## ⏳ Ce qui reste pour un déploiement 100% production

### 🔴 Priorité haute (bloque des fonctionnalités)

| Manque | Impact | Effort |
|--------|--------|--------|
| **Credentials SMTP** (Brevo / Gmail) | Emails non envoyés : inscription, contact, réservation, notification lauréats, reset mdp | 10 min — créer compte Brevo gratuit |
| **Stockage fichiers S3** (Scaleway) | Les vidéos/images uploadées sont perdues au redémarrage du serveur | 1h — config bucket S3 |

### 🟡 Priorité moyenne

| Manque | Impact | Effort |
|--------|--------|--------|
| **Google OAuth YouTube** | Upload automatique des films sur YouTube désactivé | 2h — console Google Cloud |
| **Vraies miniatures films** | Cartes galerie affichent un placeholder | Fourni par les producteurs |

### 🟢 Optionnel / Cosmétique

| Manque | Impact | Effort |
|--------|--------|--------|
| Logos sponsors | Section sponsors avec texte seulement | Fourni par le client |
| Sous-domaine custom | Actuellement `front-two-olive.vercel.app` | 30 min — DNS |

---

## 📊 État global

```
Fonctionnalité         ██████████ 100%  ✅
Infrastructure         ████████░░  85%  ⚠️  (emails + stockage)
Contenu / Data         ████████░░  80%  ⚠️  (thumbnails, sponsors)
Production-ready       ████████░░  85%  → 100% après SMTP + S3
```

---

## 🔑 Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| ADMIN | admin@marsai.io | Admin123! |
| JURY | jury1@marsai.io | Jury123! |
| JURY | jury2@marsai.io | Jury123! |
| PRODUCTEUR | producer@marsai.io | Producer123! |

---

*Livraison MarsAI — Mars 2026*
