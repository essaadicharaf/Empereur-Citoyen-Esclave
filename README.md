# 👑 E•C•S — Empereur • Citoyen • Esclave

> Jeu de cartes stratégique et psychologique inspiré de l'univers de _Kaiji_, développé en JavaScript Vanilla et stylisé avec Tailwind CSS v4.

---

## 📖 Sommaire

- [Présentation](#-présentation)
- [Règles du Jeu](#-règles-du-jeu)
- [Fonctionnalités Clés](#-fonctionnalités-clés)
- [Architecture & Modularité](#-architecture--modularité)
- [Technologies Utilisées](#-technologies-utilisées)
- [Installation et Lancement Local](#-installation-et-lancement-local)

---

## 🃏 Présentation

**E•C•S (Empereur, Citoyen, Esclave)** est un duel asymétrique opposant un joueur à un ordinateur. Deux camps s'affrontent au cours d'un match structuré en **4 séries de 3 manches** (soit 12 manches au total) :

- Le camp de **l'Empereur** (dominant mais vulnérable au coup d'éclat).
- Le camp de **l'Esclave** (défavorisé mais capable de renverser la partie).

---

## ⚖️ Règles du Jeu

Chaque joueur dispose d'une main de 5 cartes : 1 carte spéciale et 4 cartes Citoyens.

| Carte Jouée     | Carte Adverse   | Résultat                  | Points     |
| :-------------- | :-------------- | :------------------------ | :--------- |
| **👑 Empereur** | **🛡️ Citoyen**  | Victoire de l'Empereur    | **+1 pt**  |
| **🛡️ Citoyen**  | **⛓️ Esclave**  | Victoire du Citoyen       | **+1 pt**  |
| **⛓️ Esclave**  | **👑 Empereur** | Coup d'éclat de l'Esclave | **+5 pts** |
| **🛡️ Citoyen**  | **🛡️ Citoyen**  | Égalité (cartes annulées) | **0 pt**   |

- **Inversion des rôles :** Toutes les 3 manches (séries 1, 2, 3 et 4), les rôles s'inversent automatiquement entre le joueur et l'ordinateur.
- **Fin de partie :** Au bout des 12 manches, le score final détermine l'issue du duel (Victoire, Défaite ou Match Nul).

---

## ✨ Fonctionnalités Clés

### 1. Gestion des Profils Joueurs (`index.html`)

- **CRUD complet :** Création, modification et suppression de profils locaux.
- **Validation stricte :** Regex (`^[A-Za-z0-9_]{3,15}$`) et détection des doublons d'insensibles à la casse.
- **Sélection active :** Définition du joueur actif persistant pour les duels.
- **Statistiques intégrées :** Nombre de parties jouées et victoires enregistrées.

### 2. Arène de Duel (`jeu.html`)

- **Distribution dynamique :** Génération des mains selon le camp actif.
- **Suspense de révélation :** Carte adverse posée face cachée (_Secret_) avant révélation synchronisée (1.1s).
- **HUD interactif :** Suivi en direct des manches (`X/12`), séries (`Y/4`), scores et avatar du joueur actif.
- **Gestion des abandons :** Forfait possible avec confirmation et enregistrement dédié.
- **Modal de fin de partie :** Récapitulatif avec scores finaux et options de revanche ou consultation du journal.

### 3. Historique & Filtres Combinés (`historique.html`)

- **Persistance :** Sauvegarde chronologique des matchs dans `localStorage`.
- **Filtres combinés temps réel :**
  - Recherche instantanée par pseudo.
  - Filtre par résultat (Tous, Victoires, Défaites, Abandons, Égalités).
  - Filtre temporel (Tout, Aujourd'hui, 7 derniers jours).
- **Suppression granulaire :** Suppression unitaire d'un match ou vidage complet de l'historique.
- **Anonymisation intelligente :** La suppression d'un profil conserve l'intégrité de l'historique en convertissant l'auteur en _"Joueur supprimé"_.
- **Empty State :** Affichage contextuel et soigné lorsqu'aucune partie n'est trouvée.

---

## 📁 Architecture & Modularité

Le code JavaScript est structuré sous forme de modules ES6 indépendants et réutilisables :

```text
Empereur-Citoyen-Esclave/
├── dist/
│   ├── input.css          # Fichier source Tailwind v4
│   └── output.css         # CSS minifié et compilé
├── images/                # Illustrations des cartes (emperor, citizen, slave)
├── src/
│   ├── game.js            # Moteur de règles du duel et génération des mains
│   ├── main.js            # Contrôleur principal et gestionnaires d'événements
│   ├── players.js         # Logique CRUD des profils et validation
│   ├── storage.js         # Couche d'accès et persistance LocalStorage
│   └── ui.js              # Fonctions de rendu dynamique et manipulation du DOM
├── index.html             # Page de gestion des profils
├── jeu.html               # Page de l'arène de jeu
├── historique.html        # Page du journal des parties
├── package.json           # Dépendances Tailwind CSS
└── README.md              # Documentation du projet
```

🛠️ Technologies Utilisées
HTML5 Sémantique

Tailwind CSS v4 (Framework utilitaire moderne)

JavaScript ES6+ (Modules, LocalStorage, Arrow Functions, Template Literals)

Git & GitHub (Gestion de version, Gitflow et GitHub Pages)

🚀 Installation et Lancement Local
Cloner le dépôt :
Bash

```
git clone [https://github.com/essaadicharaf/Empereur-Citoyen-Esclave.git](https://github.com/essaadicharaf/Empereur-Citoyen-Esclave.git)
cd Empereur-Citoyen-Esclave
```

Installer les dépendances :

Bash

```
npm install
```

Compiler les styles Tailwind :

Bash

# Compilation ponctuelle minifiée

```
npm run build
```

# Ou mode écoute (Watch) pour le développement

```
npm run watch
```

Lancer le projet :
Ouvrez `index.html` avec l'extension Live Server de VS Code ou directement dans votre navigateur.
