import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Coins,
  Dice6,
  Footprints,
  Heart,
  RotateCcw,
  ScrollText,
  Shield,
  Skull,
  Sparkles,
  Sword,
  Zap,
} from "lucide-react";

const GAME_TITLE = "La Malédiction de Drakenhall";
const SUBTITLE = "Un livre-jeu RPG original à choix, dés, combats et magie";

const HEROES = {
  chevalier: {
    nom: "Chevalier errant",
    intro:
      "Tu as porté les armes pour des seigneurs oubliés. Ton bouclier est cabossé, mais ton courage reste intact.",
    pvMax: 36,
    manaMax: 8,
    attaque: 6,
    defense: 4,
    dexterite: 2,
    esprit: 2,
    sorts: ["Lueur"],
    objets: ["Épée longue", "Bouclier", "Ration"],
  },
  rodeuse: {
    nom: "Rôdeuse elfe",
    intro:
      "Les arbres parlent à ceux qui savent écouter. Tu connais la forêt, ses pistes et ses pièges.",
    pvMax: 28,
    manaMax: 12,
    attaque: 5,
    defense: 2,
    dexterite: 6,
    esprit: 3,
    sorts: ["Lueur"],
    objets: ["Arc d’if", "Dague", "Herbes de soin"],
  },
  mage: {
    nom: "Mage apprenti",
    intro:
      "Tu n’es pas encore un grand sorcier, mais tu sais lire les runes que les autres craignent de regarder.",
    pvMax: 24,
    manaMax: 24,
    attaque: 3,
    defense: 1,
    dexterite: 3,
    esprit: 7,
    sorts: ["Lueur", "Trait de givre", "Soin mineur"],
    objets: ["Bâton noueux", "Grimoire", "Craie rituelle"],
  },
  roublard: {
    nom: "Roublard des ruelles",
    intro:
      "Les serrures, les ombres et les mensonges sont tes vrais compagnons de voyage.",
    pvMax: 26,
    manaMax: 10,
    attaque: 5,
    defense: 2,
    dexterite: 7,
    esprit: 2,
    sorts: ["Lueur"],
    objets: ["Crochets", "Dague noire", "Cape sombre"],
  },
};

const SPELLS = {
  Lueur: {
    cout: 2,
    type: "utilitaire",
    description: "Éclaire les lieux sombres. Utile dans l’histoire, mais pas en combat.",
  },
  "Trait de givre": {
    cout: 4,
    type: "combat",
    degats: 7,
    description: "Un projectile bleu qui mord la chair et ralentit les morts.",
  },
  "Soin mineur": {
    cout: 5,
    type: "soin",
    soin: 10,
    description: "Restaure 10 PV pendant un combat.",
  },
  "Flamme spectrale": {
    cout: 6,
    type: "combat",
    degats: 10,
    description: "Très efficace contre les morts-vivants.",
  },
  "Bouclier d’éther": {
    cout: 5,
    type: "defense",
    description: "Réduit de moitié la prochaine attaque reçue.",
  },
};

const ENEMIES = {
  rat: { nom: "Rat géant", pv: 12, attaque: 3, defense: 0, xp: 1, or: 2 },
  brigand: { nom: "Brigand masqué", pv: 18, attaque: 5, defense: 1, xp: 2, or: 6 },
  squelette: { nom: "Squelette des cryptes", pv: 22, attaque: 5, defense: 2, xp: 3, or: 9 },
  spectre: { nom: "Spectre de Drakenhall", pv: 26, attaque: 6, defense: 1, xp: 4, or: 12 },
  gardien: { nom: "Gardien de la lune noire", pv: 42, attaque: 8, defense: 3, xp: 8, or: 25 },
};

const ART = {
  tavern: "/assets/adventurers_strategy_in_the_tavern.png",
  forest: "/assets/adventurers_in_a_haunted_forest.png",
  crypt: "/assets/epic_battle_in_the_cursed_crypt.png",
  castle: "/assets/journey_to_castle_drakehall.png",
  heroes: "/assets/heroes_of_the_mist_bound_courtyard.png",
};

const SECTIONS = {
  1: {
    titre: "La taverne du Corbeau Fendu",
    art: "tavern",
    image:
      "Une salle basse, des poutres noires, une carte tachée de cire et une fenêtre donnant sur un château lointain.",
    texte:
      "La pluie tombe sur les vitres de la taverne. Sur ta table repose une carte ancienne. Trois routes mènent au château de Drakenhall : la Vieille Forêt, les Marais Noirs et la route des cryptes. Le tavernier refuse de croiser ton regard. Il murmure seulement : « Ceux qui montent au château reviennent avec une ombre de plus. »",
    choix: [
      { label: "Prendre la Vieille Forêt", goto: 12 },
      { label: "Traverser les Marais Noirs", goto: 20 },
      { label: "Passer par les anciennes cryptes", goto: 30 },
      { label: "Fouiller discrètement la taverne", test: "dexterite", difficulte: 10, succes: 7, echec: 8 },
    ],
  },
  7: {
    titre: "Derrière les tonneaux",
    art: "tavern",
    image: "Une trappe dissimulée, un vieux sac de cuir et une fiole rouge posée dans la poussière.",
    texte:
      "Tu découvres une cachette oubliée. À l’intérieur, tu trouves une potion, quelques pièces et une page arrachée d’un grimoire. Les mots bougent sous tes yeux : « La flamme spectrale brûle ce qui n’est plus vivant. »",
    gain: { objet: "Potion de soin", or: 5, sort: "Flamme spectrale" },
    choix: [{ label: "Retourner à la carte", goto: 1 }],
  },
  8: {
    titre: "La mauvaise latte",
    art: "tavern",
    image: "Le plancher cède sous ton pied. Deux yeux rouges brillent sous les planches.",
    texte: "Tu appuies sur une latte piégée. Un rat énorme jaillit du plancher et te mord la botte. Tu dois combattre.",
    combat: "rat",
    victoire: 1,
  },
  12: {
    titre: "La Vieille Forêt",
    art: "forest",
    image: "Des arbres tordus, des corbeaux silencieux, une lumière bleue au fond des bois.",
    texte:
      "Le sentier s’enfonce entre des arbres si vieux qu’ils semblent te reconnaître. Au bout d’une heure, tu arrives devant deux pistes. La première descend vers une clairière bleutée. La seconde contourne la forêt par un ancien chemin de chasse.",
    choix: [
      { label: "Suivre la lumière bleue", test: "esprit", difficulte: 11, succes: 14, echec: 15 },
      { label: "Prendre le chemin de chasse", test: "dexterite", difficulte: 10, succes: 16, echec: 17 },
      { label: "Revenir à la taverne", goto: 1 },
    ],
  },
  14: {
    titre: "La pierre aux runes",
    art: "forest",
    image: "Une pierre levée couverte de symboles bleus, entourée de racines comme des doigts.",
    texte:
      "La lumière vient d’une pierre gravée. Lorsque tu poses la main dessus, ton esprit se remplit d’un sort oublié : Bouclier d’éther. Le pouvoir te traverse et restaure une partie de ta mana.",
    gain: { sort: "Bouclier d’éther", mana: 8 },
    choix: [{ label: "Continuer vers Drakenhall", goto: 40 }],
  },
  15: {
    titre: "Les murmures",
    art: "forest",
    image: "Des visages apparaissent dans l’écorce. Ils répètent ton nom jusqu’à te donner le vertige.",
    texte:
      "Tu suis la lumière, mais ce n’était qu’un piège de la forêt. Les murmures t’encerclent. Tu perds du temps, de l’énergie et un peu de courage.",
    degats: 5,
    mana: -3,
    choix: [{ label: "Fuir vers le château", goto: 40 }],
  },
  16: {
    titre: "Le vieux chemin de chasse",
    art: "forest",
    image: "Des empreintes fraîches dans la boue, une flèche brisée et un silence trop parfait.",
    texte:
      "Tu avances sans bruit. Grâce à ton agilité, tu évites un piège à loups rouillé. Dans une besace abandonnée, tu trouves des herbes de soin.",
    gain: { objet: "Herbes de soin", xp: 1 },
    choix: [{ label: "Rejoindre la route du château", goto: 40 }],
  },
  17: {
    titre: "Le piège du chasseur",
    art: "forest",
    image: "Des mâchoires de fer claquent dans la boue.",
    texte:
      "Tu poses le pied au mauvais endroit. Un piège rouillé se referme sur ta jambe. Tu parviens à te libérer, mais la douleur est vive.",
    degats: 7,
    choix: [{ label: "Boiter jusqu’au château", goto: 40 }],
  },
  20: {
    titre: "Les Marais Noirs",
    art: "castle",
    image: "Une eau sombre, des roseaux immobiles et des statues noyées regardant toutes vers le nord.",
    texte:
      "Les Marais Noirs sentent la vase et la cendre froide. Une barque flotte près du rivage. Plus loin, une route de pierres plates serpente entre les eaux. La barque est rapide, mais quelque chose bouge sous la surface.",
    choix: [
      { label: "Prendre la barque", test: "dexterite", difficulte: 12, succes: 22, echec: 23 },
      { label: "Suivre les pierres plates", goto: 24 },
      { label: "Revenir à la taverne", goto: 1 },
    ],
  },
  22: {
    titre: "La barque silencieuse",
    art: "castle",
    image: "Une barque glisse sans rame, poussée par un courant invisible.",
    texte:
      "Tu gardes l’équilibre malgré les remous. La barque file entre les roseaux et t’amène près du pont de Drakenhall. Dans le fond de la barque, tu trouves une pièce frappée d’un corbeau.",
    gain: { objet: "Pièce au corbeau", or: 8, xp: 1 },
    choix: [{ label: "Monter vers le château", goto: 40 }],
  },
  23: {
    titre: "Le rameur noyé",
    art: "castle",
    image: "Une main blanche sort de l’eau et agrippe le bord de la barque.",
    texte: "La barque penche brutalement. Une silhouette noyée se hisse à bord. Ses yeux sont deux trous de nuit. Tu dois combattre le spectre.",
    combat: "spectre",
    victoire: 40,
  },
  24: {
    titre: "Les pierres plates",
    art: "castle",
    image: "Chaque pierre porte un nom effacé. Certaines s’enfoncent sous ton poids.",
    texte: "Tu avances lentement, pierre après pierre. Le chemin est sûr, mais long. Le froid du marais te fatigue.",
    degats: 3,
    mana: -2,
    choix: [{ label: "Atteindre la route du château", goto: 40 }],
  },
  30: {
    titre: "Les cryptes anciennes",
    art: "crypt",
    image: "Trois arches de pierre descendent sous la terre. Une odeur de tombe ouverte remonte des marches.",
    texte:
      "Sous la chapelle ruinée, tu découvres les cryptes de Drakenhall. Trois arches se présentent devant toi. La première porte le symbole d’un livre. La deuxième celui d’une épée. La troisième celui d’un crâne couronné.",
    choix: [
      { label: "Entrer sous l’arche du livre", goto: 32 },
      { label: "Entrer sous l’arche de l’épée", goto: 34 },
      { label: "Entrer sous l’arche du crâne", goto: 36 },
      { label: "Revenir à la taverne", goto: 1 },
    ],
  },
  32: {
    titre: "Le grimoire humide",
    art: "crypt",
    image: "Un livre gonflé d’humidité repose sur un lutrin de pierre.",
    texte:
      "Le grimoire est presque illisible, mais une formule reste claire. En la prononçant, tu apprends Trait de givre. Les pages tombent ensuite en poussière.",
    gain: { sort: "Trait de givre", mana: 4, xp: 1 },
    choix: [{ label: "Sortir des cryptes", goto: 40 }],
  },
  34: {
    titre: "La salle des ossements",
    art: "crypt",
    image: "Des squelettes assis contre les murs tournent lentement la tête vers toi.",
    texte: "Une épée rouillée tombe d’un sarcophage. Aussitôt, les os se rassemblent. Un squelette armé se dresse devant toi.",
    combat: "squelette",
    victoire: 40,
  },
  36: {
    titre: "Le crâne couronné",
    art: "crypt",
    image: "Une couronne noire flotte au-dessus d’un crâne fendu.",
    texte: "Le crâne parle sans mâchoire : « Donne du sang et je donnerai du pouvoir. » Tu peux accepter le pacte ou refuser.",
    choix: [
      { label: "Accepter le pacte", goto: 37 },
      { label: "Refuser et fuir", test: "dexterite", difficulte: 11, succes: 40, echec: 38 },
    ],
  },
  37: {
    titre: "Le pacte noir",
    art: "crypt",
    image: "Une goutte de sang tombe sur la couronne. Des lettres rouges s’allument.",
    texte: "La douleur est brève, mais profonde. Tu apprends Flamme spectrale, au prix d’une blessure.",
    degats: 6,
    gain: { sort: "Flamme spectrale", mana: 6 },
    choix: [{ label: "Quitter les cryptes", goto: 40 }],
  },
  38: {
    titre: "Le rire sous terre",
    art: "crypt",
    image: "Les murs se resserrent et des mains osseuses sortent des fissures.",
    texte: "Tu fuis trop lentement. Des griffes t’entaillent avant que tu ne retrouves l’air libre.",
    degats: 8,
    choix: [{ label: "Courir jusqu’au château", goto: 40 }],
  },
  40: {
    titre: "La porte de Drakenhall",
    art: "castle",
    image: "Une herse noire, deux gargouilles et une serrure en forme d’œil fermé.",
    texte:
      "La porte du château est devant toi. Un œil de métal est gravé dans la serrure. Il ne s’ouvre qu’à ceux qui possèdent une clé, une ruse ou assez de force pour défier le fer.",
    choix: [
      { label: "Forcer la herse", test: "attaque", difficulte: 13, succes: 43, echec: 42 },
      { label: "Escalader le mur écroulé", test: "dexterite", difficulte: 12, succes: 43, echec: 41 },
      { label: "Utiliser la pièce au corbeau", requis: "Pièce au corbeau", goto: 44 },
    ],
  },
  41: {
    titre: "La chute",
    art: "castle",
    image: "Une pierre se détache et tombe dans le vide avec toi.",
    texte: "Tu glisses sur les pierres humides. La chute est rude, mais tu parviens à te relever dans la cour intérieure.",
    degats: 7,
    choix: [{ label: "Avancer dans la cour", goto: 45 }],
  },
  42: {
    titre: "Le fer mord",
    art: "castle",
    image: "La herse tremble, puis un mécanisme projette des éclats de métal.",
    texte: "La porte résiste. Un ancien piège se déclenche et t’arrache un cri. La herse finit tout de même par céder.",
    degats: 8,
    choix: [{ label: "Entrer dans la cour", goto: 45 }],
  },
  43: {
    titre: "La cour intérieure",
    art: "castle",
    image: "Une cour vide, une fontaine sèche et une statue tenant un livre ouvert.",
    texte:
      "Tu pénètres dans la cour de Drakenhall. La statue au centre tient un livre ouvert. Les pages tournent toutes seules. Une phrase apparaît : « La peur nourrit le gardien. »",
    choix: [
      { label: "Lire le livre", test: "esprit", difficulte: 12, succes: 46, echec: 47 },
      { label: "Ignorer le livre et entrer dans le donjon", goto: 50 },
    ],
  },
  44: {
    titre: "La serrure au corbeau",
    art: "castle",
    image: "La pièce noire s’enfonce dans l’œil de métal. La porte soupire comme une bête endormie.",
    texte:
      "La pièce au corbeau n’était pas une monnaie : c’était une clé. La herse s’ouvre sans bruit. Tu entres sans déclencher les pièges.",
    gain: { xp: 2, mana: 3 },
    choix: [{ label: "Avancer dans la cour", goto: 45 }],
  },
  45: {
    titre: "Le livre de pierre",
    art: "castle",
    image: "Une statue sans visage tient un livre dont les pages sont faites de pierre fine.",
    texte: "Une voix résonne dans la cour : « Celui qui veut survivre doit lire. » Le livre de pierre attend ta décision.",
    choix: [
      { label: "Lire le livre", test: "esprit", difficulte: 12, succes: 46, echec: 47 },
      { label: "Refuser et courir vers le donjon", goto: 50 },
    ],
  },
  46: {
    titre: "La phrase secrète",
    art: "castle",
    image: "Des lettres bleues quittent la pierre et tournent autour de ton poignet.",
    texte:
      "Tu comprends la vérité : le gardien est lié à la lune noire. La lumière magique peut fissurer son armure. Tu récupères ton souffle et ta mana.",
    gain: { mana: 10, xp: 2, objet: "Phrase secrète" },
    choix: [{ label: "Entrer dans le donjon", goto: 50 }],
  },
  47: {
    titre: "Le livre te lit",
    art: "castle",
    image: "Les pages se remplissent de tes souvenirs les plus sombres.",
    texte:
      "Tu ne lis pas le livre. C’est lui qui te lit. Une douleur glacée traverse ton crâne. Quand tu relèves la tête, la porte du donjon est ouverte.",
    degats: 5,
    mana: -4,
    choix: [{ label: "Entrer dans le donjon", goto: 50 }],
  },
  50: {
    titre: "Le Gardien de la lune noire",
    art: "crypt",
    image: "Une armure vide se lève devant un trône brisé. Dans son heaume, une lune noire brûle.",
    texte:
      "Le Gardien t’attend. Son épée ne reflète aucune lumière. Il parle d’une voix de tombe : « Encore un nom à écrire dans le livre. » C’est le combat final.",
    combat: "gardien",
    victoire: 99,
  },
  99: {
    titre: "Fin : la lune se brise",
    art: "castle",
    image: "La lune noire éclate au-dessus des tours. L’aube revient sur Drakenhall.",
    texte:
      "Le Gardien tombe à genoux. Son armure se vide en cendres. Au-dessus du château, la lune noire se fend puis disparaît. Tu as survécu à Drakenhall. Ton nom ne sera pas écrit parmi les morts.",
    fin: "victoire",
    choix: [],
  },
  100: {
    titre: "Fin : une page de plus",
    art: "crypt",
    image: "Un livre se referme dans le noir. Sur la couverture, ton nom apparaît en lettres grises.",
    texte:
      "Tes forces t’abandonnent. La dernière chose que tu entends est le bruit d’une plume qui écrit. Ton aventure s’achève ici.",
    fin: "mort",
    choix: [],
  },
};

function d6() {
  return Math.floor(Math.random() * 6) + 1;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function App() {
  const [heroType, setHeroType] = useState(null);
  const [hero, setHero] = useState(null);
  const [sectionId, setSectionId] = useState(1);
  const [log, setLog] = useState([]);
  const [roll, setRoll] = useState(null);
  const [combat, setCombat] = useState(null);
  const [shieldEther, setShieldEther] = useState(false);
  const [rewardedSections, setRewardedSections] = useState([]);

  const section = SECTIONS[sectionId];
  const score = useMemo(() => (hero ? hero.pv + hero.mana + hero.xp * 5 + hero.or : 0), [hero]);

  const addLog = (line) => setLog((l) => [line, ...l].slice(0, 9));

  const start = (type) => {
    const base = HEROES[type];
    setHeroType(type);
    setHero({
      ...base,
      pv: base.pvMax,
      mana: base.manaMax,
      xp: 0,
      or: 0,
      objets: [...base.objets],
      sorts: [...base.sorts],
    });
    setSectionId(1);
    setLog([`Tu es ${base.nom}. ${base.intro}`]);
    setRoll(null);
    setCombat(null);
    setShieldEther(false);
    setRewardedSections([]);
  };

  const restart = () => {
    setHeroType(null);
    setHero(null);
    setSectionId(1);
    setLog([]);
    setRoll(null);
    setCombat(null);
    setShieldEther(false);
    setRewardedSections([]);
  };

  const applyEffects = (id) => {
    const s = SECTIONS[id];
    if (!s || !hero) return;

    setHero((h) => {
      let n = { ...h, objets: [...h.objets], sorts: [...h.sorts] };
      const lines = [];
      const alreadyRewarded = rewardedSections.includes(id);

      if (s.degats) {
        n.pv = clamp(n.pv - s.degats, 0, n.pvMax);
        lines.push(`Tu perds ${s.degats} PV.`);
      }
      if (typeof s.mana === "number") {
        n.mana = clamp(n.mana + s.mana, 0, n.manaMax);
        lines.push(s.mana >= 0 ? `Tu récupères ${s.mana} mana.` : `Tu perds ${Math.abs(s.mana)} mana.`);
      }

      if (s.gain && !alreadyRewarded) {
        if (s.gain.objet && !n.objets.includes(s.gain.objet)) {
          n.objets.push(s.gain.objet);
          lines.push(`Objet obtenu : ${s.gain.objet}.`);
        }
        if (s.gain.sort && !n.sorts.includes(s.gain.sort)) {
          n.sorts.push(s.gain.sort);
          lines.push(`Nouveau sort appris : ${s.gain.sort}.`);
        }
        if (s.gain.or) {
          n.or += s.gain.or;
          lines.push(`Tu gagnes ${s.gain.or} pièces d’or.`);
        }
        if (s.gain.xp) {
          n.xp += s.gain.xp;
          lines.push(`Tu gagnes ${s.gain.xp} XP.`);
        }
        if (s.gain.mana) {
          n.mana = clamp(n.mana + s.gain.mana, 0, n.manaMax);
          lines.push(`Tu récupères ${s.gain.mana} mana.`);
        }
        setRewardedSections((r) => (r.includes(id) ? r : [...r, id]));
      }

      if (lines.length) setLog((l) => [...lines, ...l].slice(0, 9));
      if (n.pv <= 0) setTimeout(() => setSectionId(100), 80);
      return n;
    });
  };

  const gotoSection = (id) => {
    setSectionId(id);
    setRoll(null);
    setCombat(null);
    applyEffects(id);
  };

  const choose = (choice) => {
    if (choice.requis && !hero.objets.includes(choice.requis)) {
      addLog(`Impossible : il te manque ${choice.requis}.`);
      return;
    }

    if (choice.test) {
      const a = d6();
      const b = d6();
      const bonus = hero[choice.test] || 0;
      const total = a + b + bonus;
      const ok = total >= choice.difficulte;
      setRoll({ a, b, bonus, total, stat: choice.test, difficulte: choice.difficulte, ok });
      addLog(`Test de ${choice.test} : ${a} + ${b} + ${bonus} = ${total}. ${ok ? "Réussite." : "Échec."}`);
      setTimeout(() => gotoSection(ok ? choice.succes : choice.echec), 650);
      return;
    }

    gotoSection(choice.goto);
  };

  const startCombat = () => {
    const e = ENEMIES[section.combat];
    const bonus = section.combat === "gardien" && !hero.objets.includes("Phrase secrète") ? 8 : 0;
    setCombat({
      key: section.combat,
      nom: e.nom,
      pv: e.pv + bonus,
      pvMax: e.pv + bonus,
      attaque: e.attaque,
      defense: e.defense,
      xp: e.xp,
      or: e.or,
      journal: [`${e.nom} se prépare à frapper.`],
    });
  };

  const finishCombat = (enemy) => {
    setHero((h) => ({ ...h, xp: h.xp + enemy.xp, or: h.or + enemy.or }));
    addLog(`Victoire contre ${enemy.nom}. +${enemy.xp} XP, +${enemy.or} or.`);
    setCombat(null);
    setTimeout(() => gotoSection(section.victoire || 1), 500);
  };

  const enemyStrike = (enemy, currentHero) => {
    let damage = Math.max(1, enemy.attaque + d6() - currentHero.defense);
    if (shieldEther) {
      damage = Math.max(1, Math.floor(damage / 2));
      setShieldEther(false);
    }
    return damage;
  };

  const attackWeapon = () => {
    if (!combat || !hero) return;
    const damage = Math.max(1, hero.attaque + d6() - combat.defense);
    const enemyPv = clamp(combat.pv - damage, 0, combat.pvMax);

    if (enemyPv <= 0) {
      finishCombat(combat);
      return;
    }

    const taken = enemyStrike(combat, hero);
    const newPv = clamp(hero.pv - taken, 0, hero.pvMax);
    setCombat((c) => ({
      ...c,
      pv: enemyPv,
      journal: [`Tu attaques : ${damage} dégâts.`, `${combat.nom} riposte : ${taken} dégâts.`],
    }));
    setHero((h) => ({ ...h, pv: newPv }));
    if (newPv <= 0) setTimeout(() => gotoSection(100), 500);
  };

  const castSpell = (name) => {
    const spell = SPELLS[name];
    if (!spell || !hero.sorts.includes(name)) return;
    if (hero.mana < spell.cout) {
      addLog(`Pas assez de mana pour lancer ${name}.`);
      return;
    }

    setHero((h) => ({ ...h, mana: clamp(h.mana - spell.cout, 0, h.manaMax) }));

    if (spell.type === "soin") {
      setHero((h) => ({ ...h, pv: clamp(h.pv + spell.soin, 0, h.pvMax) }));
      setCombat((c) => ({ ...c, journal: [`Tu lances ${name} et récupères ${spell.soin} PV.`] }));
      return;
    }

    if (spell.type === "defense") {
      setShieldEther(true);
      setCombat((c) => ({ ...c, journal: [`Tu lances ${name}. La prochaine attaque sera réduite.`] }));
      return;
    }

    if (spell.type === "combat") {
      const bonusMortVivant = name === "Flamme spectrale" && ["squelette", "spectre", "gardien"].includes(combat.key) ? 4 : 0;
      const bonusSecret = hero.objets.includes("Phrase secrète") && combat.key === "gardien" ? 3 : 0;
      const damage = Math.max(1, spell.degats + d6() + hero.esprit + bonusMortVivant + bonusSecret - combat.defense);
      const enemyPv = clamp(combat.pv - damage, 0, combat.pvMax);

      if (enemyPv <= 0) {
        finishCombat(combat);
        return;
      }

      const taken = enemyStrike(combat, hero);
      const newPv = clamp(hero.pv - taken, 0, hero.pvMax);
      setCombat((c) => ({
        ...c,
        pv: enemyPv,
        journal: [`Tu lances ${name} : ${damage} dégâts.`, `${combat.nom} riposte : ${taken} dégâts.`],
      }));
      setHero((h) => ({ ...h, pv: newPv }));
      if (newPv <= 0) setTimeout(() => gotoSection(100), 500);
    }
  };

  const useItem = (item) => {
    if (!hero.objets.includes(item)) return;
    const heal = item === "Potion de soin" ? 14 : item === "Herbes de soin" ? 9 : item === "Ration" ? 5 : 0;
    if (!heal) return;

    setHero((h) => {
      const idx = h.objets.indexOf(item);
      const objets = [...h.objets];
      objets.splice(idx, 1);
      return { ...h, pv: clamp(h.pv + heal, 0, h.pvMax), objets };
    });
    addLog(`${item} utilisé : +${heal} PV.`);
  };

  if (!heroType || !hero) {
    return (
      <main className="min-h-screen bg-[#120d0a] p-4 text-stone-100 sm:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-[2rem] border border-amber-700/40 bg-[#1d1510] shadow-2xl">
            <div className="relative min-h-[280px] bg-black">
              <img src={ART.heroes} alt="Les héros de Drakenhall" className="absolute inset-0 h-full w-full object-cover opacity-55" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1d1510] via-[#1d1510]/60 to-transparent" />
              <div className="relative z-10 flex min-h-[280px] flex-col justify-end p-6 sm:p-8">
                <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Jeu original · livre-jeu RPG</p>
                <h1 className="mt-2 text-4xl font-black sm:text-6xl">{GAME_TITLE}</h1>
                <p className="mt-3 max-w-2xl text-lg text-stone-200">{SUBTITLE}</p>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="rounded-3xl border border-stone-700 bg-stone-950/50 p-5 text-lg leading-8 text-stone-200">
                <p>Choisis ton héros. Lis les paragraphes. Lance les dés. Fais tes choix. Survis aux combats.</p>
                <p className="mt-3 text-amber-200">
                  Règle : pour un test, lance 2 dés à 6 faces + ta caractéristique. Si le total atteint la difficulté, tu réussis.
                </p>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-4">
                {Object.entries(HEROES).map(([key, h]) => (
                  <button
                    key={key}
                    onClick={() => start(key)}
                    className="rounded-3xl border border-stone-700 bg-stone-900/80 p-5 text-left transition hover:-translate-y-1 hover:border-amber-400 hover:bg-stone-800"
                  >
                    <h2 className="text-xl font-black text-amber-200">{h.nom}</h2>
                    <p className="mt-2 text-sm leading-6 text-stone-300">{h.intro}</p>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-stone-300">
                      <span>PV {h.pvMax}</span>
                      <span>Mana {h.manaMax}</span>
                      <span>Attaque {h.attaque}</span>
                      <span>Défense {h.defense}</span>
                      <span>Dextérité {h.dexterite}</span>
                      <span>Esprit {h.esprit}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#120d0a] p-3 text-stone-100 sm:p-6">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1fr_360px]">
        <section className="overflow-hidden rounded-[2rem] border border-amber-800/40 bg-[#20170f] shadow-2xl">
          <div className="relative min-h-[260px] bg-black">
            <img src={ART[section.art] || ART.castle} alt="Illustration de la scène" className="absolute inset-0 h-full w-full object-cover opacity-55" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#20170f] via-[#20170f]/65 to-transparent" />
            <div className="relative z-10 flex min-h-[260px] flex-col justify-end p-5 sm:p-7">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Paragraphe {sectionId}</p>
                  <h1 className="mt-2 text-3xl font-black sm:text-5xl">{section.titre}</h1>
                </div>
                <button onClick={restart} className="rounded-2xl border border-stone-700 bg-stone-950/90 px-4 py-3 text-sm hover:bg-stone-800">
                  <RotateCcw className="mr-2 inline" size={16} /> Recommencer
                </button>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            <AnimatePresence mode="wait">
              <motion.div key={sectionId} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
                <div className="mb-6 rounded-3xl border border-amber-700/30 bg-black/30 p-5">
                  <div className="mb-2 flex items-center gap-2 text-amber-200">
                    <ScrollText size={20} /> Illustration textuelle
                  </div>
                  <p className="italic leading-7 text-stone-300">{section.image}</p>
                </div>

                <div className="rounded-3xl border border-stone-700 bg-[#f2dfb8] p-6 text-[#2a170b] shadow-inner">
                  <p className="whitespace-pre-line text-xl leading-9">{section.texte}</p>
                </div>

                {roll && (
                  <div className={`mt-5 rounded-3xl border p-4 ${roll.ok ? "border-emerald-500/50 bg-emerald-950/40" : "border-red-500/50 bg-red-950/40"}`}>
                    <p className="font-black"><Dice6 className="mr-2 inline" /> Jet de dés</p>
                    <p className="mt-1 text-stone-200">
                      {roll.a} + {roll.b} + {roll.stat} {roll.bonus} = <b>{roll.total}</b> contre difficulté {roll.difficulte}. {roll.ok ? "Réussite." : "Échec."}
                    </p>
                  </div>
                )}

                {section.combat && !combat && !section.fin && (
                  <button onClick={startCombat} className="mt-6 w-full rounded-3xl bg-red-800 px-5 py-4 text-xl font-black hover:bg-red-700">
                    <Sword className="mr-2 inline" /> Commencer le combat
                  </button>
                )}

                {combat && (
                  <div className="mt-6 rounded-3xl border border-red-500/40 bg-red-950/30 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.25em] text-red-300">Combat</p>
                        <h2 className="text-3xl font-black"><Skull className="mr-2 inline" /> {combat.nom}</h2>
                      </div>
                      <div className="text-right text-lg font-black">{combat.pv}/{combat.pvMax} PV</div>
                    </div>

                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-black/50">
                      <div className="h-full bg-red-500" style={{ width: `${(combat.pv / combat.pvMax) * 100}%` }} />
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <button onClick={attackWeapon} className="rounded-2xl bg-stone-100 px-4 py-3 font-black text-black hover:bg-amber-200">
                        <Sword className="mr-2 inline" size={18} /> Attaquer à l’arme
                      </button>
                      {hero.objets.some((o) => ["Potion de soin", "Herbes de soin", "Ration"].includes(o)) && (
                        <button
                          onClick={() => useItem(hero.objets.find((o) => ["Potion de soin", "Herbes de soin", "Ration"].includes(o)))}
                          className="rounded-2xl bg-emerald-700 px-4 py-3 font-black hover:bg-emerald-600"
                        >
                          <Heart className="mr-2 inline" size={18} /> Utiliser un soin
                        </button>
                      )}
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {hero.sorts.map((s) => {
                        const spell = SPELLS[s];
                        const disabled = !spell || spell.type === "utilitaire" || hero.mana < spell.cout;
                        return (
                          <button
                            key={s}
                            disabled={disabled}
                            onClick={() => castSpell(s)}
                            className="rounded-2xl border border-blue-400/30 bg-blue-950/40 px-4 py-3 text-left disabled:cursor-not-allowed disabled:opacity-40 hover:bg-blue-900/60"
                          >
                            <b><Sparkles className="mr-2 inline" size={17} /> {s}</b>
                            <span className="ml-2 text-sm text-blue-200">{spell?.cout ?? 0} mana</span>
                            <p className="mt-1 text-sm text-stone-300">{spell?.description}</p>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-stone-200">
                      {combat.journal.map((j, i) => (
                        <p key={i} className="rounded-2xl bg-black/30 p-3">{j}</p>
                      ))}
                    </div>
                  </div>
                )}

                {!section.combat && !section.fin && (
                  <div className="mt-7 space-y-3">
                    {section.choix.map((choice, index) => {
                      const locked = choice.requis && !hero.objets.includes(choice.requis);
                      return (
                        <button
                          key={index}
                          onClick={() => choose(choice)}
                          className={`w-full rounded-3xl border p-4 text-left transition ${locked ? "border-stone-800 bg-stone-900/40 text-stone-500" : "border-amber-600/40 bg-stone-950 hover:border-amber-300 hover:bg-stone-900"}`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-lg font-black">{choice.label}</span>
                            {choice.test && (
                              <span className="rounded-full bg-amber-900/50 px-3 py-1 text-sm text-amber-200">Test {choice.test} {choice.difficulte}</span>
                            )}
                            {choice.requis && <span className="rounded-full bg-stone-800 px-3 py-1 text-sm">Requis : {choice.requis}</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {section.fin && (
                  <div className="mt-7 rounded-3xl border border-amber-600/40 bg-black/30 p-5">
                    <h2 className="text-2xl font-black">{section.fin === "victoire" ? "Victoire" : "Défaite"}</h2>
                    <p className="mt-2 text-stone-300">Score final : {score}</p>
                    <button onClick={restart} className="mt-4 rounded-2xl bg-amber-500 px-5 py-3 font-black text-black hover:bg-amber-300">
                      Recommencer
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        <aside className="space-y-4">
          <Card title="Feuille d’aventure">
            <p className="text-xl font-black text-amber-200">{hero.nom}</p>
            <Bar label="PV" value={hero.pv} max={hero.pvMax} icon={<Heart size={16} />} />
            <Bar label="Mana" value={hero.mana} max={hero.manaMax} icon={<Zap size={16} />} />
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <Stat icon={<Sword size={16} />} label="Attaque" value={hero.attaque} />
              <Stat icon={<Shield size={16} />} label="Défense" value={hero.defense} />
              <Stat icon={<Footprints size={16} />} label="Dextérité" value={hero.dexterite} />
              <Stat icon={<Sparkles size={16} />} label="Esprit" value={hero.esprit} />
            </div>
          </Card>

          <Card title="Sorts connus">
            <div className="space-y-2">
              {hero.sorts.map((s) => (
                <div key={s} className="rounded-2xl bg-blue-950/40 p-3">
                  <b>{s}</b>
                  <p className="text-sm text-blue-100">{SPELLS[s]?.description}</p>
                  <p className="text-xs text-blue-300">Coût : {SPELLS[s]?.cout} mana</p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Inventaire">
            <div className="flex flex-wrap gap-2">
              {hero.objets.map((o, i) => (
                <span key={o + i} className="rounded-full bg-stone-800 px-3 py-1 text-sm">{o}</span>
              ))}
            </div>
            <p className="mt-4 text-amber-300"><Coins className="mr-2 inline" size={16} /> {hero.or} pièces d’or</p>
            <p className="text-stone-300">XP : {hero.xp}</p>
          </Card>

          <Card title="Journal">
            <div className="space-y-2 text-sm text-stone-300">
              {log.map((l, i) => (
                <p key={i} className="rounded-2xl bg-stone-900 p-3">{l}</p>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </main>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-[2rem] border border-stone-700 bg-[#1d1510] p-5">
      <h3 className="mb-3 text-xl font-black text-amber-100">{title}</h3>
      {children}
    </div>
  );
}

function Bar({ label, value, max, icon }) {
  return (
    <div className="mt-4">
      <div className="mb-1 flex justify-between text-sm text-stone-300">
        <span className="flex items-center gap-2">{icon}{label}</span>
        <span>{value}/{max}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-stone-800">
        <div className="h-full bg-amber-500" style={{ width: `${(value / max) * 100}%` }} />
      </div>
    </div>
  );
}

function Stat({ label, value, icon }) {
  return (
    <div className="rounded-2xl bg-stone-900 p-3">
      <div className="flex items-center gap-2 text-stone-400">{icon}{label}</div>
      <div className="text-2xl font-black">{value}</div>
    </div>
  );
}
