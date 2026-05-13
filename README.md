# Les Cendres d’Astréa — V4.2

Version livre-jeu propre avec **arborescence réécrite manuellement sur le début du Livre I** : moins de retours absurdes, transitions plus logiques, scènes bloquantes, quêtes mieux suivies, lancer de dés, sauvegarde, combats et illustrations noir et blanc.

## Corrections principales

- nouvelle clé de sauvegarde `les_cendres_astrea_v4_2_arborescence_propre` ;
- premiers chapitres réécrits pour éviter les boucles trop rapides ;
- progression cohérente : champ de bataille → camp/route → Val-Cendre → puits → cimetière → forêt ;
- pas de spoil sur le héros “choisi” ;
- début centré sur la marque inconnue et l’amnésie ;
- rencontres importantes bloquantes.

## Installation

```bash
npm install
npm run dev
```

## Déploiement Vercel

- Framework : Vite
- Build command : `npm run build`
- Output directory : `dist`

Ne pas ajouter `package-lock.json`, `postcss.config.js` ou `tailwind.config.js`.
