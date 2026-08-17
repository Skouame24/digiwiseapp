# Brief Stratégique & Positionnement — OWEKE V1
*Rédigé par l'Analyste Stratégique • Document de référence pour toute l'équipe (Design, Tech, UI, Sécurité)*

---

## 1. Déconstruction du Sujet & Problématique Centrale

### 1.1 Le Problème Réel de l'Utilisateur (La Douleur)
Les applications de rencontre traditionnelles (basées sur le swiping asymptomatique) souffrent de trois maux majeurs :
- **La fatigue du swipe (Swipe Fatigue)** : Des milliers de profils défilés sans connexion réelle.
- **Le Ghosting et les conversations mortes** : Des jours de clavardage textuel qui n'aboutissent jamais à une vraie rencontre.
- **Les faux profils et la déception du 1er RDV** : Un écart massif entre une photo retouchée/filtrée et la réalité physique et expressive en face-à-face.

### 1.2 La Solution OWEKE V1
OWEKE résout cette douleur en remplaçant le chat textuel par le **Speed Dating Vidéo Synchrone en Rotation Directe** :
- **Spontanéité & Vrai Visage** : Des rendez-vous vidéo courts (5 minutes) planifiés lors de soirées thématiques.
- **Zéro Temps Perdu** : L'algorithme *round-robin* gère les rotations automatiquement de binôme en binôme.
- **Confidentialité & Zéro Pression** : Les décisions se font à l'aveugle durant la phase *Soft View* (15s post-round). En cas de Coup de Cœur réciproque, le match est débloqué.

---

## 2. Périmètre Produit V1 & Garde-Fous

### 2.1 Périmètre In-Scope (Strictement inclus en V1)
- **Plateforme Web Responsive** (Next.js 16 + React 19 + Tailwind CSS) : 100% accessible sur mobile et desktop sans installation.
- **Réservation d'Événements & Paiement Stripe** : Achat de pass à l'événement par région/tranche d'âge.
- **Salle d'Attente & Salon VIP Synchrone**.
- **Salle de Date Vidéo Live (Agora RTC + WebRTC)** avec vumètre micro, contrôles caméra et disposition adaptable.
- **Phase Soft View & Prise de Note Privée**.
- **Gestion des Matchs Réciproques & Modal de Célébration**.

### 2.2 Périmètre Out-of-Scope (Explicitement exclus en V1)
- Application mobile native (iOS / Android).
- Conseillers amoureux / Love coaching individuel payant.
- Messagerie textuelle interne complexe et blog communautaire.

---

## 3. Public Cible (Personas)

- **Cible Principale (80%)** : Célibataires actifs de **25 à 45 ans** (Urbains et Périurbains).
  - *Profil* : Professionnels occupés, exigeants, lassés de perdre leur temps sur Tinder/Bumble.
  - *Besoin* : Rencontrer de "vraies" personnes rapidement, voir le sourire, entendre la voix et sentir la chimie en 5 minutes.
- **Cible Secondaire (20%)** : Célibataires 45-65 ans recherchant une plateforme sécurisée, encadrée et simple d'utilisation sans complexité technique.

---

## 4. Direction Artistique & Audit Visuel ("Luminous Warm Boutique")

- **Ambiance Émotionnelle** : Chaleureuse, Romantique, Premium, Énergique et Rassurante.
- **Palette de Couleurs** :
  - *Primaire* : Rose Crimson Élégant (`#e11d48` / `hsl(346.8 85% 53.3%)`).
  - *Accents* : Violet Améthyste / Rose Poudré & Ambre Doré.
  - *Arrière-plan* : Ivoire Lumineux (`#fbf8f5`) avec gradients radiaux doux.
- **Typographie** : Fonts modernes sans-serif (Inter, Outfit) à forte hiérarchie visuelle.
- **Micro-interactions** : Animations fluides Framer Motion (hover, pulse, particules de réactions émojis en direct).

---

## 5. Mots-Clés du Ton de Marque

- **Authentique** (Pas de faux profils, du direct vidéo pur).
- **Spontané** (5 minutes pour ressentir l'étincelle).
- **Sécurisé & Bienveillant** (Floutage d'urgence, signalement anonyme 1-clic).
- **Fluide & Sans Friction** (Aucune démarche compliquée).