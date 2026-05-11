# La Malédiction de Drakenhall

**La Malédiction de Drakenhall** est un jeu original de type **livre-jeu RPG** : paragraphes numérotés, choix, dés, combats, mana, dextérité, apprentissage de sorts et inventaire.

## Lancer le jeu en local

```bash
npm install
npm run dev
```

Puis ouvrir l'adresse affichée dans le terminal, souvent :

```text
http://localhost:5173
```

## Construire la version finale

```bash
npm run build
```

Le site final sera généré dans le dossier `dist/`.

## Hébergement recommandé : Vercel

1. Créer un dépôt GitHub.
2. Envoyer ce dossier sur GitHub.
3. Aller sur Vercel.
4. Cliquer sur **Add New Project**.
5. Importer le dépôt GitHub.
6. Vercel détecte automatiquement Vite.
7. Cliquer sur **Deploy**.

## Structure du projet

```text
la-malediction-de-drakenhall/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json
├── public/
│   └── assets/
│       └── illustrations du jeu
└── src/
    ├── App.jsx
    ├── main.jsx
    └── index.css
```

## Vérification

Le projet a été testé avec `npm run build` : la compilation Vite fonctionne.

## Notes

Le jeu est conçu pour être jouable sur téléphone : interface responsive, boutons larges, texte lisible, feuille d'aventure sur le côté ou sous le texte selon l'écran.
