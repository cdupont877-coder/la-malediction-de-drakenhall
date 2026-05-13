import React, { useEffect, useMemo, useState } from 'react'

const SAVE_KEY = 'les_cendres_astrea_v4_livre_jeu_propre'
const A = '/assets/illustrations/'

const ILLUSTRATIONS = {
  battlefield: A + 'champ_bataille.png',
  village: A + 'val_cendre.png',
  well: A + 'puits_maudit.png',
  cemetery: A + 'cimetiere.png',
  forest: A + 'foret_chemin.png',
  manor: A + 'manoir_brumeval.png',
  chapel: A + 'chapelle_ruinee.png',
  rift: A + 'faille_demoniaque.png',
}

const CLASSES = {
  veilleur: {
    nom: 'Survivant amnésique',
    desc: 'Équilibré, avec une marque étrange dont l’origine reste inconnue. Bon choix pour une première partie.',
    mods: { force: 1, dex: 1, chance: 1, esprit: 1, pv: 8, mana: 6 },
    objets: ['Médaillon du Soleil brisé', 'Pierre à feu'],
    sorts: ['Lueur pâle'],
  },
  guerrier: {
    nom: 'Ancien guerrier',
    desc: 'Plus de Force, plus de PV, idéal pour encaisser les nombreux combats.',
    mods: { force: 4, dex: 0, chance: 0, esprit: -1, pv: 14, mana: 1 },
    objets: ['Épée usée', 'Bouclier cabossé', 'Ration'],
    sorts: [],
  },
  rodeur: {
    nom: 'Rôdeur des frontières',
    desc: 'Très bon en Dextérité et Chance. Excellent pour pièges, secrets et embuscades.',
    mods: { force: 0, dex: 4, chance: 2, esprit: 0, pv: 7, mana: 3 },
    objets: ['Arc court', 'Dague', 'Ration'],
    sorts: ['Lueur pâle'],
  },
  mystique: {
    nom: 'Mystique marqué',
    desc: 'Fragile, mais très fort en magie et contre les créatures du Voile.',
    mods: { force: -1, dex: 0, chance: 1, esprit: 5, pv: 4, mana: 14 },
    objets: ['Craie rituelle', 'Chapelet brisé'],
    sorts: ['Lueur pâle', 'Soin mineur', 'Trait de givre'],
  },
}

const SPELLS = {
  'Lueur pâle': { cout: 4, type: 'damageHoly', degats: 9, desc: 'Blesse fortement morts-vivants et démons.' },
  'Soin mineur': { cout: 5, type: 'heal', soin: 12, desc: 'Rend 12 PV.' },
  'Trait de givre': { cout: 5, type: 'damage', degats: 10, desc: 'Sort offensif fiable.' },
  'Flamme spectrale': { cout: 7, type: 'damageHoly', degats: 14, desc: 'Très puissant contre morts-vivants, esprits et démons.' },
  'Bouclier d’éther': { cout: 6, type: 'shield', desc: 'Réduit la prochaine attaque.' },
}

const BOOKS = {
  1: {
    title: 'Livre I — Le Réveil des Cendres',
    subtitle: 'Survivre au champ de bataille, sauver Val-Cendre, retrouver les premiers souvenirs.',
    code: 'CENDRES-I',
    zones: [
      { start: 1, end: 35, name: 'Le Champ des Morts', art: 'battlefield', theme: 'cadavres, pillards, goules, premiers souvenirs' },
      { start: 36, end: 75, name: 'Val-Cendre', art: 'village', theme: 'village pestiféré, survivants, enquête' },
      { start: 76, end: 105, name: 'Le Puits Maudit', art: 'well', theme: 'source de la peste, esprits, racines noires' },
      { start: 106, end: 150, name: 'Le Cimetière des Soldats', art: 'cemetery', theme: 'squelettes, nécromancien, registre des morts' },
      { start: 151, end: 195, name: 'La Forêt Brûlée', art: 'forest', theme: 'braconniers, esprits de la forêt, ent corrompu' },
      { start: 196, end: 240, name: 'Le Manoir de Brumeval', art: 'manor', theme: 'vampires, assassins, fragments de mémoire' },
      { start: 241, end: 270, name: 'La Chapelle en Ruine', art: 'chapel', theme: 'relique ancienne, Guilde Noire, choix de confiance' },
      { start: 271, end: 300, name: 'La Première Faille', art: 'rift', theme: 'portail démoniaque, Azhraël, final du livre I' },
    ],
    bosses: { 30: 'Capitaine possédé', 60: 'Marn le Crochu', 95: 'Esprit pestiféré du puits', 135: 'Nécromancien du cimetière', 185: 'Ent corrompu', 225: 'Sire Vael Draven', 260: 'Adepte majeur du Cercle', 295: 'Démon mineur de la faille' },
  },
  2: {
    title: 'Livre II — La Guerre des Six Royaumes',
    subtitle: 'Explorer les royaumes, choisir ses alliances, récupérer ou détruire les sceaux.',
    code: 'CENDRES-II',
    zones: [
      { start: 1, end: 45, name: 'Aldéris, Royaume Humain', art: 'village', theme: 'capitale assiégée, intrigues, épidémie' },
      { start: 46, end: 90, name: 'Kar-Durak, Royaume Nain', art: 'chapel', theme: 'forges anciennes, mines, scorpions, rune ancienne' },
      { start: 91, end: 135, name: 'Sylvéria, Forêt Elfique', art: 'forest', theme: 'sanctuaires, ents, esprits, braconniers' },
      { start: 136, end: 180, name: 'Nocthyr, Royaume Noir', art: 'manor', theme: 'elfes noirs, vampires, manoirs, assassins' },
      { start: 181, end: 225, name: 'Varkhâl, Terres Orques', art: 'battlefield', theme: 'clans, barbares, arènes, griffons' },
      { start: 226, end: 270, name: 'Zéphar, Désert Rouge', art: 'well', theme: 'sorciers, gobelins, momies, serpents éthérés' },
      { start: 271, end: 300, name: 'Le Conseil des Sceaux', art: 'rift', theme: 'trahison, six sceaux, guerre totale' },
    ],
    bosses: { 40: 'Roi possédé', 80: 'Golem de forge', 120: 'Ent malade', 165: 'Vampire ancien', 210: 'Champion orque corrompu', 250: 'Momie royale', 285: 'Dragon des ruines', 300: 'Héraut d’Azhraël' },
  },
  3: {
    title: 'Livre III — Le Portail des Cendres',
    subtitle: 'Guerre finale, dimension démoniaque, choix ultime contre Azhraël.',
    code: 'CENDRES-III',
    zones: [
      { start: 1, end: 45, name: 'La Forteresse du Voile', art: 'chapel', theme: 'dernière défense, armées alliées ou isolées' },
      { start: 46, end: 85, name: 'La Vallée des Morts', art: 'cemetery', theme: 'champs funéraires, spectres, généraux morts' },
      { start: 86, end: 130, name: 'La Mer Noire', art: 'well', theme: 'pirates, tempêtes, créatures des profondeurs' },
      { start: 131, end: 175, name: 'Le Temple Enseveli', art: 'manor', theme: 'désert, momies, énigmes, ancien dieu' },
      { start: 176, end: 230, name: 'La Citadelle Démoniaque', art: 'rift', theme: 'infiltration, possédés, généraux du portail' },
      { start: 231, end: 275, name: 'La Dimension Rouge', art: 'rift', theme: 'monde démoniaque, corruption, vrai nom' },
      { start: 276, end: 300, name: 'Le Trône d’Azhraël', art: 'rift', theme: 'combat final, sacrifice, vraie fin' },
    ],
    bosses: { 35: 'Général spectral', 75: 'Roi des goules', 115: 'Kraken de cendre', 155: 'Gardien momifié', 205: 'Dragon corrompu', 245: 'Avatar d’Azhraël', 285: 'Ancien compagnon possédé', 300: 'Azhraël, Dévoreur de Voiles' },
  },
}

const QUEST_TITLES = [
  'Sauver les survivants', 'Récupérer un fragment de mémoire', 'Briser un rituel noir', 'Trouver une relique cachée',
  'Négocier avec une guilde', 'Libérer un prisonnier', 'Purifier une source maudite', 'Découvrir un faux ordre de guerre',
  'Forger une arme contre les démons', 'Épargner ou exécuter un ennemi', 'Retrouver une carte secrète', 'Protéger un enfant malade',
  'Démasquer un traître', 'Fermer une brèche du Voile', 'Obtenir l’aide d’un peuple ennemi', 'Résister à un pacte noir',
]

const SECRET_TITLES = [
  'La bataille était un rituel', 'Les six sceaux protègent le Voile', 'Azhraël cherche le vrai nom du héros',
  'La Guilde Noire manipule plusieurs royaumes', 'Les orques ont été accusés à tort', 'Un vampire connaît le passé de Kaël',
  'Les puissances anciennes ne disent pas toute la vérité', 'Un allié peut être possédé', 'Le Soleil brisé est l’emblème des Veilleurs',
  'La peste vient des fragments démoniaques', 'Un sceau royal a déjà été remplacé', 'La vraie fin exige mémoire et corruption basse',
]

const ENEMY_NAMES = ['Pillard', 'Squelette', 'Goule', 'Assassin', 'Mercenaire', 'Possédé', 'Esprit', 'Zombie', 'Scorpion', 'Braconnier', 'Démon mineur', 'Vampire affamé', 'Momie', 'Serpent éthéré']

function d6() { return Math.floor(Math.random() * 6) + 1 }
function clamp(n, min, max) { return Math.max(min, Math.min(max, n)) }
function uniq(arr, x) { return x && !arr.includes(x) ? [...arr, x] : arr }
function zoneFor(book, id) { return book.zones.find(z => id >= z.start && id <= z.end) || book.zones[0] }
function pct(a, b) { return `${clamp((a / b) * 100, 0, 100)}%` }

function createHero(classKey) {
  const c = CLASSES[classKey]
  const rolls = { force: d6(), dex: d6(), chance: d6(), esprit: d6(), pv: d6() + d6(), mana: d6() }
  const force = 6 + rolls.force + c.mods.force
  const dex = 6 + rolls.dex + c.mods.dex
  const chance = 6 + rolls.chance + c.mods.chance
  const esprit = 6 + rolls.esprit + c.mods.esprit
  const pvMax = 20 + rolls.pv + c.mods.pv
  const manaMax = 8 + rolls.mana + Math.floor(esprit / 2) + c.mods.mana
  return {
    classKey, nom: c.nom, rolls, force, dex, chance, chanceMax: chance, esprit, pv: pvMax, pvMax, mana: manaMax, manaMax,
    xp: 0, or: 0, memoire: 0, corruption: 0, reputation: 0, niveau: 1,
    items: [...c.objets], spells: [...c.sorts], allies: [], quests: [], done: [], secrets: [], flags: {}, endings: [],
  }
}

function generatedPassage(bookId, id, hero) {
  const book = BOOKS[bookId]
  const zone = zoneFor(book, id)
  const zoneIndex = book.zones.findIndex(z => z.name === zone.name)
  const local = id - zone.start + 1
  const zoneLength = zone.end - zone.start + 1
  const next = Math.min(300, id + 1)
  const alt = Math.min(zone.end, id + 2)
  const endOfZone = id >= zone.end
  const boss = book.bosses[id]
  const dc = 10 + bookId + Math.floor(id / 90)

  const zoneData = getZoneData(bookId, zoneIndex, zone)
  const scene = zoneData.scenes[(local - 1) % zoneData.scenes.length]
  const detail = zoneData.details[(local + 2) % zoneData.details.length]
  const danger = zoneData.dangers[(local + 4) % zoneData.dangers.length]
  const npc = zoneData.npcs[(local + 6) % zoneData.npcs.length]
  const object = zoneData.objects[(local + 8) % zoneData.objects.length]
  const secret = zoneData.secrets[(local + 10) % zoneData.secrets.length]
  const quest = zoneData.quests[(local + 12) % zoneData.quests.length]
  const enemyName = boss || zoneData.enemies[(local + bookId) % zoneData.enemies.length]

  if (id === 1 && bookId === 1) {
    return {
      title: 'Sous les cadavres', zone: zone.name, art: zone.art,
      text: `Vous ouvrez les yeux dans le noir. Quelque chose pèse sur votre poitrine. Une main morte recouvre votre visage. L’odeur du sang, de la boue et de la chair brûlée vous soulève le cœur.\n\nVous êtes allongé sous un tas de cadavres. Des humains. Des orques. Des nains. Des gobelins. Des soldats dont les armures sont fendues. Des bannières déchirées flottent dans la pluie.\n\nVous essayez de vous souvenir de votre nom. Rien. Seulement une douleur vive à l’arrière du crâne. Puis une voix lointaine résonne : « Relève-toi. Pas ici. Pas encore. »\n\nAutour de votre poignet, une marque pâle commence à brûler.`,
      choices: [
        { label: 'Ramper hors du tas de cadavres', goto: 2 },
        { label: 'Rester immobile et écouter les pillards', test: 'chance', dc: 10, success: 3, failCombat: true },
        { label: 'Fouiller les corps autour de vous', effect: { item: 'Médaillon du Soleil brisé', or: 3, memoire: 1, secret: 'Le Soleil brisé marque les Veilleurs du Voile' }, goto: 4 },
        { label: 'Appeler à l’aide', combat: true },
      ],
      enemy: mkEnemy(bookId, id, 'Cadavre animé', false),
    }
  }

  if (id === 1) {
    return {
      title: bookId === 2 ? 'Les royaumes brûlent' : 'La dernière guerre du Voile', zone: zone.name, art: zone.art,
      text: bookId === 2
        ? `Vous quittez les ruines de Val-Cendre avec les premières réponses et trop de nouvelles questions. Devant vous, les six royaumes s’accusent, s’arment et saignent. Chaque souverain possède un sceau. Azhraël n’a pas besoin de les voler : il lui suffit que les royaumes se détruisent entre eux.`
        : `Le portail s’ouvre enfin. Les choix des deux premiers livres vous suivent comme des ombres : alliés, dettes, corruptions, serments et morts abandonnés. Face à Azhraël, il ne suffira plus de survivre. Il faudra décider ce qui mérite d’être sauvé.`,
      choices: [{ label: 'Commencer ce livre', goto: 2 }],
    }
  }

  if (id === 300) {
    const ending = bookId === 1 ? 'FIN-I' : bookId === 2 ? 'FIN-II' : 'FIN-TRILOGIE'
    return {
      title: boss || 'Fin du livre', zone: zone.name, art: zone.art,
      text: bookId === 3
        ? `Le trône d’Azhraël se fissure sous vos pieds. Le Dévoreur de Voiles prononce enfin votre nom, mais il arrive trop tard : vous avez retrouvé assez de mémoire pour choisir qui vous êtes. Selon votre corruption, vos alliés et les secrets découverts, Astréa connaîtra la victoire du Voile, le sacrifice, le règne des cendres ou la vraie fin.`
        : `Le dernier obstacle de ce livre vous attend. Derrière lui, une seule certitude demeure : Astréa n’est pas sauvée, elle vient seulement de survivre à une première nuit. Vos choix composeront désormais un code de sauvegarde pour la suite.`,
      final: true, ending,
      enemy: mkEnemy(bookId, id, boss || 'Gardien final', true),
    }
  }

  if (boss) {
    const text = `${zoneData.bossIntro || 'La route se referme devant vous.'}\n\n${boss} apparaît. ${danger}. Sa présence n’est pas une rencontre de hasard : tout ce que vous avez fait dans ${zone.name} vous mène à cet affrontement.\n\nImpossible de continuer sans résoudre ce passage. Il faut combattre, utiliser vos ressources et assumer les choix qui vous ont conduit ici.`
    return {
      title: boss,
      zone: zone.name,
      art: zone.art,
      text,
      enemy: mkEnemy(bookId, id, boss, true),
      blocking: true,
      choices: [],
    }
  }

  if (endOfZone) {
    const nextZone = book.zones[zoneIndex + 1]
    const text = `${zoneData.exit || 'Vous atteignez enfin la limite de cette zone.'}\n\nDerrière vous, ${zone.name} garde ses morts, ses secrets et les conséquences de vos choix. Devant vous, ${nextZone ? nextZone.name : 'la conclusion du livre'} vous attend. Vous sentez que l’aventure avance d’un cran : ce n’est pas un détour, mais la suite logique de votre route.`
    return {
      title: `Quitter ${zone.name}`,
      zone: zone.name,
      art: zone.art,
      text,
      choices: [{ label: nextZone ? `Continuer vers ${nextZone.name}` : 'Aller vers la conclusion', goto: next }],
    }
  }

  const isCombat = local % 8 === 0 || local % 13 === 0
  const isQuest = local % 11 === 0
  const isSecret = local % 9 === 0
  const isRest = local % 17 === 0

  if (isCombat) {
    const text = `${scene}\n\n${detail}. Vous comprenez trop tard que ${danger.toLowerCase()}. ${enemyName} surgit et vous coupe la route.\n\nCette rencontre est bloquante : vous ne pouvez pas simplement partir vers une autre scène. Il faut vaincre, fuir par un vrai test ou trouver les mots justes.`
    return {
      title: `Rencontre — ${enemyName}`,
      zone: zone.name,
      art: zone.art,
      text,
      enemy: mkEnemy(bookId, id, enemyName, false),
      blocking: true,
      choices: [
        { label: `Combattre ${enemyName}`, combat: true },
        { label: 'Tenter de fuir — test de Dextérité', test: 'dex', dc: dc + 2, success: next, failCombat: true },
        { label: 'Tenter de distraire ou parlementer — test d’Esprit', test: 'esprit', dc: dc + 2, success: alt, failCombat: true },
        { label: 'Tenter un coup de Chance', test: 'chance', dc: dc + 2, success: next, failCombat: true },
      ],
    }
  }

  if (isQuest) {
    const text = `${scene}\n\n${npc} vous entraîne vers une affaire qui ne peut pas être ignorée : ${quest}. Ce n’est pas une parenthèse gratuite. Cette quête éclaire ce qui se passe dans ${zone.name} et peut modifier vos alliés, votre réputation ou votre corruption.`
    return {
      title: `Quête — ${quest}`,
      zone: zone.name,
      art: zone.art,
      text,
      choices: [
        { label: 'Accepter la quête et aider', effect: { quest, reputation: 1 }, goto: next },
        { label: 'Chercher une solution rapide — test d’Esprit', test: 'esprit', dc, success: alt, fail: next, effect: { memoire: 1 } },
        { label: 'Refuser et continuer la route', effect: { reputation: -1, corruption: 1 }, goto: next },
      ],
    }
  }

  if (isSecret) {
    const text = `${scene}\n\n${object} attire votre attention. Ce détail semble presque insignifiant, pourtant il relie ${zone.name} à un mystère plus vaste : ${secret}. Si vous prenez le temps d’enquêter, la progression sera plus lente, mais plus cohérente avec votre quête de mémoire.`
    return {
      title: 'Un indice sous la cendre',
      zone: zone.name,
      art: zone.art,
      text,
      choices: [
        { label: 'Examiner l’indice — test d’Esprit', test: 'esprit', dc, success: alt, fail: next, effect: { secret, memoire: 1 } },
        { label: 'Le conserver sans perdre de temps', effect: { item: object, memoire: 1 }, goto: next },
        { label: 'Le détruire par prudence', effect: { corruption: -1 }, goto: next },
      ],
    }
  }

  if (isRest) {
    const text = `${scene}\n\nVous trouvez un court répit. ${detail}. Ce repos ne vous éloigne pas de l’objectif : il marque une pause logique avant la prochaine menace.`
    return {
      title: 'Un abri précaire',
      zone: zone.name,
      art: zone.art,
      text,
      choices: [
        { label: 'Vous reposer quelques minutes', effect: { pv: 10, mana: 6 }, goto: next },
        { label: 'Monter la garde et réfléchir', effect: { memoire: 1 }, goto: alt },
        { label: 'Repartir immédiatement', goto: next },
      ],
    }
  }

  const text = `${scene}\n\n${detail}. ${npc}. Le lien avec votre objectif reste clair : avancer dans ${zone.name}, comprendre ce qui nourrit le chaos, et retrouver les fragments de votre identité.\n\n${danger}. Vous devez choisir comment poursuivre sans perdre le fil de votre mission.`
  return {
    title: zoneData.titles[(local + bookId) % zoneData.titles.length],
    zone: zone.name,
    art: zone.art,
    text,
    choices: [
      { label: zoneData.forward || 'Continuer sur la route principale', goto: next },
      { label: zoneData.investigate || 'Examiner les lieux avant d’avancer', test: 'esprit', dc, success: alt, fail: next, effect: { memoire: 1 } },
      { label: zoneData.risk || 'Prendre une approche risquée', test: local % 2 === 0 ? 'dex' : 'force', dc: dc + 1, success: alt, fail: next },
    ],
  }
}

function getZoneData(bookId, zoneIndex, zone) {
  const base = {
    titles: ['La route incertaine', 'Le signe oublié', 'Sous un ciel de cendre', 'Le choix du survivant', 'Une trace de guerre'],
    scenes: [`Vous avancez dans ${zone.name}.`, `Le chemin se resserre dans ${zone.name}.`, `Le silence de ${zone.name} vous accompagne.`],
    details: ['Des traces récentes marquent le sol', 'Un symbole ancien apparaît sous la poussière', 'La lumière décline derrière les ruines'],
    dangers: ['Une présence hostile se rapproche', 'Un bruit sec révèle que vous êtes suivi', 'La magie noire a laissé une empreinte ici'],
    npcs: ['Un survivant tremblant vous observe', 'Une silhouette hésite à se montrer', 'Une voix lointaine appelle à l’aide'],
    objects: ['un éclat de métal gravé', 'une page tachée de boue', 'une pierre froide marquée d’un cercle'],
    secrets: ['Azhraël étend son influence au-delà de cette zone', 'les faux ordres de guerre ont été transmis par le Cercle de Cendre', 'la marque inconnue réagit aux lieux blessés par le Voile'],
    quests: ['secourir un survivant', 'retrouver une preuve cachée', 'briser un petit rituel noir'],
    enemies: ['Pillard', 'Squelette', 'Goule', 'Possédé', 'Mercenaire'],
    forward: 'Continuer prudemment', investigate: 'Chercher un indice cohérent', risk: 'Tenter un passage dangereux',
  }

  const livre1 = [
    {
      titles: ['La boue et le sang', 'La bannière tombée', 'Les voix des charognards', 'Un survivant sous les morts', 'Le cercle dans la pluie'],
      scenes: ['Vous vous extirpez peu à peu du charnier. La pluie colle les cheveux à votre front et transforme la terre en boue rouge.', 'Entre les corps, des bannières déchirées claquent encore dans le vent, comme si la bataille refusait de se taire.', 'Vous rampez entre des boucliers fendus et des lances brisées. Chaque cadavre pourrait cacher un indice ou un danger.'],
      details: ['Une odeur de fer, de cendre et de chair brûlée vous prend à la gorge', 'Un corbeau se pose sur un casque ouvert et vous fixe comme s’il vous reconnaissait', 'Une empreinte fraîche traverse la boue entre les morts'],
      dangers: ['les pillards fouillent déjà les corps autour de vous', 'quelque chose bouge sous les cadavres', 'une silhouette encapuchonnée inspecte les survivants'],
      npcs: ['Un soldat agonisant murmure un nom que vous avez presque reconnu', 'Une éclaireuse blessée vous observe depuis un chariot renversé', 'Un nain mourant serre contre lui une boîte scellée'],
      objects: ['un médaillon du Soleil brisé', 'une lettre adressée à Kaël', 'une chevalière couverte de sang'],
      secrets: ['la bataille était un rituel de masse', 'quelqu’un recherche le porteur de la marque', 'les six peuples ont été sacrifiés pour fissurer le Voile'],
      quests: ['sauver l’éclaireuse Élyane', 'protéger la boîte du nain Borik', 'échapper au camp des pillards'],
      enemies: ['Cadavre animé', 'Pillard de champ de bataille', 'Goule fraîche', 'Adepte de la Guilde Noire'],
      forward: 'Ramper vers la sortie du champ de bataille', investigate: 'Fouiller les morts avec prudence', risk: 'Traverser à découvert entre les pillards',
      exit: 'Le champ des morts s’éloigne derrière vous. Au bout de la route, un clocher fume au-dessus de Val-Cendre.',
      bossIntro: 'Les cadavres autour de vous se redressent comme si une seule volonté les commandait.',
    },
    {
      titles: ['Les portes closes', 'La place sans voix', 'Derrière les volets', 'La maison barricadée', 'La cloche de Val-Cendre'],
      scenes: ['Val-Cendre vous accueille par des volets fermés et une cloche qui sonne seule.', 'La place du village semble vide, mais chaque maison retient son souffle.', 'Une charrette renversée bloque la rue principale ; sur ses planches, quelqu’un a gravé un signe de quarantaine.'],
      details: ['Des traces de pas mènent toutes vers le puits central', 'Une femme malade serre un enfant contre elle derrière une porte entrouverte', 'La suie sur les murs montre que les villageois ont brûlé leurs morts trop vite'],
      dangers: ['la peste n’est pas naturelle', 'certains malades grattent les portes de l’intérieur', 'un symbole de la Guilde Noire a été dissimulé sous les marques de quarantaine'],
      npcs: ['Mira, une mère épuisée, vous supplie d’aider son fils', 'Un ancien milicien vous accuse d’apporter la malédiction avec vous', 'Le prêtre refuse d’ouvrir la chapelle tant que la marque n’a pas parlé'],
      objects: ['le journal du guérisseur', 'une fiole de remède inachevé', 'une clef rouillée de la chapelle'],
      secrets: ['le puits a été empoisonné par un fragment démoniaque', 'le guérisseur savait que la peste venait du Voile', 'un homme du Cercle de Cendre est passé avant vous'],
      quests: ['sauver l’enfant de Mira', 'trouver les trois ingrédients du remède', 'convaincre les survivants de Val-Cendre'],
      enemies: ['Villageois contaminé', 'Rat pestiféré', 'Zombie malade', 'Pillard revenu du champ'],
      forward: 'Avancer vers la place du village', investigate: 'Interroger les survivants', risk: 'Forcer une maison barricadée',
      exit: 'Val-Cendre n’est plus seulement un village pestiféré : c’est la preuve que la guerre continue dans l’eau, les murs et les corps.',
    },
    {
      titles: ['La gorge du puits', 'Sous les pierres noires', 'Les racines malades', 'L’eau qui murmure', 'Le cœur de la peste'],
      scenes: ['Vous descendez sous Val-Cendre par les pierres humides du vieux puits.', 'Les tunnels sous le village respirent comme une bête endormie.', 'L’eau noire reflète votre visage, mais pas exactement votre regard.'],
      details: ['Des racines noires serrent les pierres comme des doigts', 'Une vapeur froide remonte du fond et porte des voix d’enfants', 'Des symboles rouges ont été tracés sous la mousse'],
      dangers: ['un esprit pestiféré garde la source', 'l’eau tente de noircir vos veines', 'le fragment démoniaque pulse dans la pierre centrale'],
      npcs: ['La voix de Mira semble vous suivre depuis la surface', 'Une âme noyée répète que le prêtre a menti', 'Un ancien guérisseur apparaît dans un reflet trouble'],
      objects: ['une racine noire encore vivante', 'une fiole d’eau bénite fendue', 'un fragment du puits'],
      secrets: ['la peste est une fuite du monde démoniaque', 'les fragments peuvent soigner ou corrompre', 'la marque inconnue semble pouvoir refermer les petites failles'],
      quests: ['purifier le puits', 'détruire le fragment démoniaque', 'sauver Val-Cendre avant la nuit complète'],
      enemies: ['Noyé pestiféré', 'Goule du puits', 'Esprit malade', 'Possédé de Val-Cendre'],
      forward: 'Descendre plus bas', investigate: 'Étudier les racines noires', risk: 'Traverser l’eau contaminée',
      exit: 'Lorsque vous remontez, l’air de Val-Cendre a changé. Le village n’est peut-être pas sauvé, mais la source du mal a été révélée.',
      bossIntro: 'Le puits vomit une brume pâle. Une forme d’enfant et de noyé se recompose devant vous.',
    },
    {
      titles: ['Les croix penchées', 'La fosse ouverte', 'Le registre des morts', 'La crypte noire', 'Les soldats sans repos'],
      scenes: ['La route du cimetière est bordée de croix fraîches et de tombes trop nombreuses.', 'Le cimetière des soldats s’étend dans la brume, couvert de bannières à moitié enterrées.', 'Des tombes ouvertes montrent que certains morts ont été déplacés après la bataille.'],
      details: ['Un registre trempé porte votre nom, mais la ligne a été rayée', 'Des traces d’ossements mènent vers une crypte entrouverte', 'Une épée rouillée pointe vers le nord comme une accusation'],
      dangers: ['les morts obéissent à un nécromancien', 'la peste et la nécromancie utilisent la même énergie noire', 'un capitaine mort-vivant garde encore les faux ordres'],
      npcs: ['Un capitaine mort-vivant réclame le nom du traître', 'Un prisonnier attaché dans la crypte vous supplie de le libérer', 'Une ombre de soldat vous appelle Kaël'],
      objects: ['le registre des morts', 'une clef d’os', 'un livre de chair interdit'],
      secrets: ['Kaël a été déclaré mort puis effacé', 'les armées ont reçu de faux ordres', 'la bataille a nourri un rituel nécromantique'],
      quests: ['libérer les prisonniers de la crypte', 'découvrir qui a falsifié les ordres', 'brûler ou garder le livre de chair'],
      enemies: ['Squelette de soldat', 'Capitaine mort-vivant', 'Goule de fosse', 'Expérience de chair'],
      forward: 'Suivre les tombes ouvertes', investigate: 'Lire les noms des morts', risk: 'Descendre dans une fosse commune',
      exit: 'La crypte s’effondre derrière vous. Vous repartez avec une certitude : votre mort officielle était un mensonge utile.',
      bossIntro: 'Dans la crypte, les os forment un cercle. Au centre, une silhouette lève un livre cousu de peau.',
    },
    {
      titles: ['La lisière calcinée', 'Les cendres vivantes', 'La clairière malade', 'Les cages des braconniers', 'Le cœur brûlé'],
      scenes: ['La forêt brûlée commence par une odeur d’orage ancien et de bois mort.', 'Les arbres calcinés se penchent au-dessus du chemin comme des juges noirs.', 'Sous vos pas, la cendre conserve des empreintes qui ne sont pas toutes humaines.'],
      details: ['Un sentier réel disparaît sous une voûte de feuillage sombre', 'Une plume de griffon est coincée dans une cage abandonnée', 'La sève rouge d’un arbre forme presque un symbole'],
      dangers: ['les braconniers profitent du chaos pour capturer les dernières créatures', 'la forêt elle-même souffre d’un fragment démoniaque', 'un ent corrompu frappe tout ce qui approche'],
      npcs: ['Un jeune elfe blessé vous observe derrière des branches', 'Un esprit de clairière prend la forme d’une enfant de feuilles', 'Un braconnier affirme que la forêt était morte avant son arrivée'],
      objects: ['une plume de griffon', 'une carte des pistes secrètes', 'un cœur de bois noir'],
      secrets: ['Sylvéria sait déjà que le Voile se fissure', 'les esprits naturels semblent reconnaître la marque inconnue', 'un passage secret mène vers Brumeval'],
      quests: ['libérer les captifs des braconniers', 'apaiser l’esprit de la forêt', 'retirer le fragment du cœur brûlé'],
      enemies: ['Braconnier', 'Chef braconnier', 'Ronce animée', 'Ent corrompu'],
      forward: 'Suivre le sentier sous les branches', investigate: 'Écouter les murmures des arbres', risk: 'Couper à travers les ronces noires',
      exit: 'La forêt s’ouvre enfin sur une route plus froide. Brumeval attend au-delà des branches.',
      bossIntro: 'La clairière tremble. Un arbre immense se redresse, sa douleur changée en rage.',
    },
    {
      titles: ['La grille de Brumeval', 'Le hall aux portraits', 'La cave aux cercueils', 'Le salon rouge', 'Le souvenir enfermé'],
      scenes: ['Le manoir de Brumeval surgit dans la brume, trop élégant pour être honnête.', 'Les grilles s’ouvrent sans un grincement, comme si quelqu’un vous attendait.', 'Dans le hall, des portraits suivent votre passage avec des regards peints trop vivants.'],
      details: ['Un portrait porte votre visage et le nom Kaël Ardent', 'Des traces de sang frais descendent vers la cave', 'Un rideau bouge alors qu’aucune fenêtre n’est ouverte'],
      dangers: ['les vampires de Brumeval connaissent votre passé', 'les Lames du Voile testent votre identité', 'chaque souvenir offert ici réclame un prix'],
      npcs: ['Une servante vampire prononce votre nom sans hésiter', 'Un assassin masqué vous demande de prouver que vous êtes encore Kaël', 'Sire Vael Draven vous accueille comme un vieil invité'],
      objects: ['l’anneau de Brumeval', 'un journal des Veilleurs', 'une lame cérémonielle des Lames du Voile'],
      secrets: ['vous avez caché une partie de votre mémoire à Brumeval', 'Azhraël ne peut posséder entièrement ce qu’il ne peut nommer', 'les vampires peuvent devenir alliés ou ennemis jurés'],
      quests: ['libérer les prisonniers de la cave', 'réussir le duel rituel des Lames', 'refuser ou accepter le pacte vampirique'],
      enemies: ['Vampire mineur', 'Assassin du Voile', 'Servante vampire', 'Sire Vael Draven'],
      forward: 'Entrer plus profondément dans le manoir', investigate: 'Examiner les portraits', risk: 'Descendre seul dans la cave',
      exit: 'Brumeval disparaît derrière vous, mais le souvenir qu’il gardait continue de brûler dans votre crâne.',
      bossIntro: 'Dans la chambre du maître, les rideaux se soulèvent sans vent. Un vampire ancien se tient devant le balcon.',
    },
    {
      titles: ['Les pierres sacrées', 'L’autel fendu', 'Le reliquaire', 'Les hommes en noir', 'Le jugement de la marque'],
      scenes: ['La chapelle en ruine se dresse sur une colline battue par le vent.', 'Entre les arches brisées, votre marque pulse comme un second cœur.', 'Des éclats de vitraux craquent sous vos pas, reflétant une lumière pâle.'],
      details: ['Un reliquaire d’argent repose derrière l’autel fendu', 'Des cendres rouges dessinent le cercle de la Guilde Noire', 'Une fresque représente les six royaumes autour d’un portail fermé'],
      dangers: ['la chapelle peut rejeter un héros trop corrompu', 'la Guilde Noire vous rattrape ici', 'l’Éclat du Voile attire les serviteurs d’Azhraël'],
      npcs: ['Un prêtre mort depuis longtemps murmure encore dans la nef', 'Un adepte du Cercle vous propose de rendre votre mémoire', 'Les alliés sauvés sur votre route peuvent vous rejoindre'],
      objects: ['l’Éclat du Voile', 'l’anneau de cendre', 'une relique fendue'],
      secrets: ['les six royaumes gardent encore les sceaux', 'le Livre II mènera à la guerre totale', 'la foi et la corruption changent les fins possibles'],
      quests: ['obtenir l’Éclat du Voile', 'refuser le marché du Cercle', 'rassembler les alliés avant la faille'],
      enemies: ['Garde noir du Cercle', 'Adepte du Cercle', 'Mercenaire noir', 'Possédé de la chapelle'],
      forward: 'Avancer vers l’autel', investigate: 'Étudier la fresque des six royaumes', risk: 'Forcer le reliquaire',
      exit: 'La chapelle vous livre sa dernière lumière. Au loin, la terre tremble : la première faille s’ouvre.',
      bossIntro: 'Les hommes en noir encerclent la nef. Leur chef lève un anneau rouge vers votre marque.',
    },
    {
      titles: ['Le sanctuaire effondré', 'Les corps du rituel', 'La faille rouge', 'La voix d’Azhraël', 'Le dernier verrou'],
      scenes: ['Le sanctuaire de la faille n’est plus qu’un cercle de colonnes brisées.', 'La réalité se fend devant vous comme une peau trop tendue.', 'Un ciel rouge apparaît dans la déchirure, au-delà du monde.'],
      details: ['Six corps sont disposés autour du portail, un pour chaque peuple', 'Les pierres tremblent au rythme d’un cœur immense', 'Votre marque devient douloureuse, presque insoutenable'],
      dangers: ['le rituel s’accélère à chaque instant', 'un démon tente de se hisser dans Astréa', 'Azhraël cherche à entendre votre vrai nom'],
      npcs: ['Élyane peut couvrir votre avancée si elle vous fait confiance', 'Borik peut renforcer votre arme s’il vous doit la vie', 'Rogh peut briser la ligne ennemie si vous l’avez aidé'],
      objects: ['l’Éclat du Voile', 'un fragment démoniaque brûlant', 'la dernière cendre du rituel'],
      secrets: ['la première faille n’est qu’un essai', 'les six sceaux seront la cible du Livre II', 'Kaël était un Veilleur du Voile'],
      quests: ['interrompre le rituel final', 'fermer la première faille', 'choisir la voie du Voile ou la voie sombre'],
      enemies: ['Ombre de la faille', 'Garde noir', 'Adepte final', 'Démon mineur de la faille'],
      forward: 'Approcher du portail', investigate: 'Étudier le cercle des six corps', risk: 'Frapper la faille directement',
      exit: 'La faille vacille. Ce que vous avez gagné ici ne sauvera pas Astréa, mais cela vous donne une chance de poursuivre.',
      bossIntro: 'Le portail s’élargit. Une griffe noire se pose sur le sol d’Astréa.',
    },
  ]

  const livreGeneric = [
    {
      titles: ['Une couronne en guerre', 'La route des sceaux', 'Le serment fragile', 'La frontière armée', 'Le prix de l’alliance'],
      scenes: [`Vous progressez dans ${zone.name}, où chaque bannière semble accuser une autre bannière.`, `Dans ${zone.name}, les rumeurs vont plus vite que les cavaliers.`, `Les routes de ${zone.name} portent la fatigue d’un royaume prêt à se briser.`],
      details: ['Un messager cache un sceau sous son manteau', 'Une patrouille vous observe sans savoir si vous êtes un allié', 'Une carte royale a été déchirée et recousue à la hâte'],
      dangers: ['une guerre civile menace d’éclater', 'un conseiller possédé influence le pouvoir', 'la Guilde Noire achète des témoins'],
      npcs: ['Un capitaine épuisé vous demande de choisir un camp', 'Une diplomate affirme que la paix est encore possible', 'Un prisonnier d’un peuple ennemi prétend détenir la vérité'],
      objects: ['un sauf-conduit royal', 'un fragment de sceau', 'une lettre diplomatique codée'],
      secrets: ['un sceau a déjà été copié par magie noire', 'certains ennemis ont été manipulés', 'une alliance sauvera des vies dans le Livre III'],
      quests: ['obtenir la confiance d’un royaume', 'déjouer une fausse accusation', 'récupérer un fragment de sceau'],
      enemies: ['Mercenaire royal', 'Assassin', 'Possédé de cour', 'Champion corrompu'],
      forward: 'Poursuivre la mission des sceaux', investigate: 'Chercher la vérité politique', risk: 'Forcer une audience dangereuse',
    },
  ]

  const livre3 = [
    {
      titles: ['La dernière marche', 'La cendre du monde', 'Le seuil impossible', 'Le vrai nom', 'Le choix final'],
      scenes: [`Dans ${zone.name}, chaque pas ressemble à une fin.`, `La guerre finale transforme ${zone.name} en frontière entre Astréa et l’abîme.`, `${zone.name} n’est plus seulement un lieu : c’est une épreuve pour tout ce que vous avez choisi.`],
      details: ['Les alliés gagnés autrefois tiennent encore une ligne fragile', 'Un souvenir ancien vous revient au pire moment', 'La corruption offre une solution trop facile'],
      dangers: ['Azhraël connaît presque votre vrai nom', 'le portail avale peu à peu la réalité', 'un ancien compagnon pourrait être possédé'],
      npcs: ['Un allié vous rappelle une dette ancienne', 'Un survivant vous confie le dernier message d’un royaume tombé', 'Une voix lointaine hésite entre vous guider et vous condamner'],
      objects: ['une clef du Voile', 'une lame forgée contre les démons', 'un éclat de couronne brisée'],
      secrets: ['la vraie fin exige assez de mémoire', 'la corruption peut vaincre Azhraël sans sauver Astréa', 'le sacrifice n’est pas toujours la mort'],
      quests: ['protéger les derniers alliés', 'tenir la ligne du Voile', 'affronter le vrai nom d’Azhraël'],
      enemies: ['Démon majeur', 'Général spectral', 'Dragon corrompu', 'Avatar d’Azhraël'],
      forward: 'Avancer vers le portail', investigate: 'Chercher la vraie fin', risk: 'Utiliser la corruption contre l’abîme',
    },
  ]

  if (bookId === 1) return { ...base, ...livre1[zoneIndex] }
  if (bookId === 2) return { ...base, ...livreGeneric[0] }
  return { ...base, ...livre3[0] }
}

function mkEnemy(bookId, id, name, boss) {
  const scale = bookId * 5 + Math.floor(id / 20)
  return {
    nom: name,
    pvMax: (boss ? 45 : 20) + scale * (boss ? 5 : 2),
    attaque: (boss ? 8 : 5) + Math.floor(scale / 2),
    defense: (boss ? 4 : 1) + Math.floor(scale / 5),
    xp: (boss ? 12 : 3) + scale,
    or: boss ? 15 + scale : 3 + Math.floor(scale / 2),
    boss,
    type: name.toLowerCase().includes('démon') || name.toLowerCase().includes('azhraël') ? 'demon' : name.toLowerCase().includes('squelette') || name.toLowerCase().includes('goule') || name.toLowerCase().includes('zombie') ? 'mort-vivant' : 'normal',
  }
}

function applyEffect(h, eff = {}) {
  const n = { ...h, items: [...h.items], spells: [...h.spells], allies: [...h.allies], quests: [...h.quests], done: [...h.done], secrets: [...h.secrets], flags: { ...h.flags }, endings: [...h.endings] }
  if (eff.item) n.items = uniq(n.items, eff.item)
  if (eff.spell) n.spells = uniq(n.spells, eff.spell)
  if (eff.ally) n.allies = uniq(n.allies, eff.ally)
  if (eff.quest) n.quests = uniq(n.quests, eff.quest)
  if (eff.done) { n.done = uniq(n.done, eff.done); n.quests = n.quests.filter(q => q !== eff.done) }
  if (eff.secret) n.secrets = uniq(n.secrets, eff.secret)
  if (eff.flag) n.flags[eff.flag] = true
  if (typeof eff.pv === 'number') n.pv = clamp(n.pv + eff.pv, 0, n.pvMax)
  if (typeof eff.mana === 'number') n.mana = clamp(n.mana + eff.mana, 0, n.manaMax)
  if (typeof eff.or === 'number') n.or = Math.max(0, n.or + eff.or)
  if (typeof eff.xp === 'number') { n.xp += eff.xp; n.niveau = 1 + Math.floor(n.xp / 30) }
  if (typeof eff.memoire === 'number') n.memoire = clamp(n.memoire + eff.memoire, 0, 100)
  if (typeof eff.corruption === 'number') n.corruption = clamp(n.corruption + eff.corruption, 0, 100)
  if (typeof eff.reputation === 'number') n.reputation = clamp(n.reputation + eff.reputation, -100, 100)
  return n
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [selectedBook, setSelectedBook] = useState(1)
  const [hero, setHero] = useState(null)
  const [bookId, setBookId] = useState(1)
  const [pid, setPid] = useState(1)
  const [combat, setCombat] = useState(null)
  const [log, setLog] = useState([])
  const [lastRoll, setLastRoll] = useState(null)
  const [savedAvailable, setSavedAvailable] = useState(false)
  const [pendingClass, setPendingClass] = useState(null)
  const [rolledHero, setRolledHero] = useState(null)
  const [shield, setShield] = useState(false)

  useEffect(() => { setSavedAvailable(Boolean(localStorage.getItem(SAVE_KEY))) }, [])

  const passage = useMemo(() => generatedPassage(bookId, pid, hero), [bookId, pid, hero])

  function addLog(txt) { setLog(l => [txt, ...l].slice(0, 12)) }
  function save() { localStorage.setItem(SAVE_KEY, JSON.stringify({ hero, bookId, pid, log })); setSavedAvailable(true); addLog('Partie sauvegardée.') }
  function load() { const s = JSON.parse(localStorage.getItem(SAVE_KEY)); setHero(s.hero); setBookId(s.bookId); setPid(s.pid); setLog(s.log || ['Sauvegarde chargée.']); setScreen('game'); setCombat(null) }
  function erase() { localStorage.removeItem(SAVE_KEY); setSavedAvailable(false); addLog('Sauvegarde effacée.') }
  function rollHero(classKey) {
    const h = createHero(classKey)
    setPendingClass(classKey)
    setRolledHero(h)
  }
  function confirmStart() {
    if (!rolledHero) return
    const h = rolledHero
    setHero(h)
    setBookId(selectedBook)
    setPid(1)
    setScreen('game')
    setLog([
      `Héros créé : ${h.nom}.`,
      `Dés lancés : Force ${h.rolls.force}, Dextérité ${h.rolls.dex}, Chance ${h.rolls.chance}, Esprit ${h.rolls.esprit}, PV ${h.rolls.pv}, Mana ${h.rolls.mana}.`
    ])
    setCombat(null)
  }
  function restart() { setHero(null); setPid(1); setCombat(null); setScreen('home'); setLastRoll(null); setRolledHero(null); setPendingClass(null) }

  function go(goto, eff) { if (eff) setHero(h => applyEffect(h, eff)); setPid(clamp(goto, 1, 300)); setCombat(null); setLastRoll(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  function can(choice) { return !choice.requiresItem || hero.items.includes(choice.requiresItem) }
  function choose(choice) {
    if (!can(choice)) return addLog('Condition non remplie.')
    if (choice.combat) return startCombat(passage.enemy)
    if (choice.test) {
      const a = d6(), b = d6(), bonus = hero[choice.test] || 0, total = a + b + bonus
      const ok = total >= choice.dc
      setLastRoll({ a, b, bonus, stat: choice.test, dc: choice.dc, total, ok })
      addLog(`Test ${choice.test} : ${a}+${b}+${bonus} = ${total} / ${choice.dc} — ${ok ? 'réussite' : 'échec'}.`)
      if (ok) {
        if (choice.successCombat) return setTimeout(() => startCombat(passage.enemy), 450)
        return setTimeout(() => go(choice.success, choice.effect), 450)
      }
      if (choice.failCombat) return setTimeout(() => { addLog('Échec : la menace vous force au combat.'); startCombat(passage.enemy) }, 450)
      setTimeout(() => go(choice.fail, null), 450)
      return
    }
    go(choice.goto, choice.effect)
  }

  function startCombat(enemy) { setCombat({ ...enemy, pv: enemy.pvMax, log: [`${enemy.nom} surgit.`] }) }
  function heroDamage(spell) {
    let bonus = Math.floor(hero.force / 2)
    if (hero.items.includes('Épée usée')) bonus += 2
    if (hero.items.includes('Éclat du Voile')) bonus += 4
    if (spell) bonus = Math.floor(hero.esprit / 2) + spell.degats
    return Math.max(1, d6() + bonus - combat.defense)
  }
  function enemyStrike(c) { let dmg = Math.max(1, c.attaque + d6() - Math.floor(hero.force / 3)); if (shield) { dmg = Math.ceil(dmg / 2); setShield(false) } return dmg }
  function finishVictory(c) {
    setHero(h => applyEffect(h, { xp: c.xp, or: c.or, memoire: c.boss ? 2 : 0, reputation: c.boss ? 1 : 0 }))
    addLog(`Victoire contre ${c.nom}.`)
    if (pid === 300) {
      const code = `${BOOKS[bookId].code}-${hero.corruption > 45 ? 'CENDRE' : hero.memoire > 35 ? 'VOILE' : 'SURVIVANT'}-${String(hero.xp).padStart(3, '0')}`
      setHero(h => ({ ...h, endings: uniq(h.endings, code) }))
      addLog(`Code de fin : ${code}`)
      setCombat(null)
      return
    }
    setCombat(null); setPid(clamp(pid + 1, 1, 300))
  }
  function attack() {
    const dmg = heroDamage()
    const npv = Math.max(0, combat.pv - dmg)
    if (npv <= 0) return finishVictory(combat)
    const taken = enemyStrike(combat)
    setCombat(c => ({ ...c, pv: npv, log: [`Vous infligez ${dmg} dégâts.`, `${c.nom} riposte : ${taken} dégâts.`] }))
    setHero(h => ({ ...h, pv: clamp(h.pv - taken, 0, h.pvMax) }))
    if (hero.pv - taken <= 0) setTimeout(() => setPid(300), 500)
  }
  function chanceMove() {
    if (hero.chance <= 0) return addLog('Chance épuisée.')
    const a = d6(), b = d6(), ok = a + b <= hero.chance
    setHero(h => ({ ...h, chance: Math.max(0, h.chance - 1) }))
    if (ok) { const dmg = 8 + Math.floor(hero.dex / 2); const npv = Math.max(0, combat.pv - dmg); if (npv <= 0) return finishVictory(combat); setCombat(c => ({ ...c, pv: npv, log: [`Chance réussie : esquive et ${dmg} dégâts.`] })) }
    else { const taken = enemyStrike(combat) + 2; setHero(h => ({ ...h, pv: clamp(h.pv - taken, 0, h.pvMax) })); setCombat(c => ({ ...c, log: [`Chance ratée : ${taken} dégâts subis.`] })) }
  }
  function cast(name) {
    const s = SPELLS[name]
    if (!s || hero.mana < s.cout) return addLog('Mana insuffisante.')
    setHero(h => ({ ...h, mana: h.mana - s.cout }))
    if (s.type === 'heal') { setHero(h => ({ ...h, pv: clamp(h.pv + s.soin, 0, h.pvMax) })); return setCombat(c => ({ ...c, log: [`${name} : +${s.soin} PV.`] })) }
    if (s.type === 'shield') { setShield(true); return setCombat(c => ({ ...c, log: [`${name} : prochaine attaque réduite.`] })) }
    const holy = s.type === 'damageHoly' && ['demon', 'mort-vivant'].includes(combat.type)
    const dmg = heroDamage(s) + (holy ? 6 : 0)
    const npv = Math.max(0, combat.pv - dmg)
    if (npv <= 0) return finishVictory(combat)
    const taken = enemyStrike(combat)
    setCombat(c => ({ ...c, pv: npv, log: [`${name} : ${dmg} dégâts.`, `${c.nom} riposte : ${taken} dégâts.`] }))
    setHero(h => ({ ...h, pv: clamp(h.pv - taken, 0, h.pvMax) }))
  }
  function restItem() { const item = hero.items.find(i => ['Ration', 'Potion de soin', 'Remède argenté'].includes(i)); if (!item) return; const heal = item === 'Ration' ? 6 : 14; setHero(h => ({ ...h, pv: clamp(h.pv + heal, 0, h.pvMax), items: h.items.filter((x, idx) => idx !== h.items.indexOf(item)) })); addLog(`${item} utilisé : +${heal} PV.`) }

  if (screen === 'home') return <Home selectedBook={selectedBook} setSelectedBook={setSelectedBook} rollHero={rollHero} confirmStart={confirmStart} rolledHero={rolledHero} pendingClass={pendingClass} savedAvailable={savedAvailable} load={load} erase={erase} />

  const art = ILLUSTRATIONS[passage.art] || ILLUSTRATIONS.battlefield
  return <main className="app"><div className="shell">
    <section className="panel">
      <div className="header"><div><div className="kicker">{BOOKS[bookId].title} · Progression {pid}/300 · {passage.zone}</div><h1>{passage.title}</h1></div><div className="btnbar"><button className="btn good" onClick={save}>Sauvegarder</button><button className="btn" onClick={restart}>Menu</button></div></div>
      <div className="content">
        <img className="illustration" src={art} alt="Illustration noir et blanc" />
        <article className="paper"><h3>{passage.title}</h3><p className="text">{passage.text}</p></article>
        {lastRoll && <div className="combat"><b>Jet de dés</b><p>{lastRoll.a}+{lastRoll.b}+{lastRoll.stat} {lastRoll.bonus} = {lastRoll.total} / {lastRoll.dc} — {lastRoll.ok ? 'réussite' : 'échec'}.</p></div>}
        {passage.final && !combat && <div className="combat"><p>Dernier obstacle du livre. Vous pouvez terminer ce livre en remportant le combat final.</p><button className="btn primary" onClick={() => startCombat(passage.enemy)}>Affronter {passage.enemy.nom}</button></div>}
        {!passage.final && passage.enemy && passage.blocking && !combat && (!passage.choices || passage.choices.length === 0) && <div className="combat"><p>Rencontre bloquante : vous devez résoudre cette scène avant de continuer.</p><button className="btn primary" onClick={() => startCombat(passage.enemy)}>Affronter {passage.enemy.nom}</button></div>}
        {combat && <Combat combat={combat} hero={hero} attack={attack} chanceMove={chanceMove} cast={cast} restItem={restItem} />}
        {!combat && !passage.final && passage.choices?.length > 0 && <div className="choices">{passage.choices.map((c, i) => <button key={i} className={'choice ' + (!can(c) ? 'locked' : '')} onClick={() => choose(c)}>{c.label}{c.test && <small>Test : {c.test} — difficulté {c.dc}</small>}</button>)}</div>}
      </div>
    </section>
    <Sidebar hero={hero} bookId={bookId} pid={pid} log={log} save={save} />
  </div></main>
}

function Home({ selectedBook, setSelectedBook, rollHero, confirmStart, rolledHero, pendingClass, savedAvailable, load, erase }) {
  return <main className="home"><section className="panel heroBox"><div className="kicker">V4 · Livre-jeu RPG propre</div><h1>Les Cendres d’Astréa</h1><h2>Combats · quêtes · secrets · illustrations noir et blanc</h2><p className="intro">Un homme se réveille amnésique sous un tas de cadavres, au milieu d’un champ de bataille. Le monde est en guerre, les épidémies ravagent les villages, les guildes se déchirent et quelque chose, dans l’ombre, pousse les six royaumes vers un désastre plus ancien que leurs querelles.</p>{savedAvailable && <div className="btnbar" style={{marginTop:16}}><button className="btn good" onClick={load}>Continuer la sauvegarde</button><button className="btn bad" onClick={erase}>Effacer la sauvegarde</button></div>}<h2 style={{marginTop:24}}>Choisis le livre</h2><div className="books">{Object.entries(BOOKS).map(([id,b]) => <button key={id} className="selectCard" onClick={() => setSelectedBook(Number(id))} style={{outline: selectedBook===Number(id)?'2px solid #f1c36d':'none'}}><h3>{b.title}</h3><p>{b.subtitle}</p><b>Aventure longue</b></button>)}</div><h2 style={{marginTop:24}}>Choisis ton héros</h2><div className="classes">{Object.entries(CLASSES).map(([k,c]) => <button key={k} className="selectCard" onClick={() => rollHero(k)} style={{outline: pendingClass===k?'2px solid #f1c36d':'none'}}><h3>{c.nom}</h3><p>{c.desc}</p><small>Clique pour préparer le lancer de dés</small></button>)}</div>{rolledHero && <div className="rollBox"><div className="kicker">Création du héros · lancer de dés</div><h2>Points de capacité obtenus</h2><p className="intro">Les dés déterminent tes capacités. Tu peux relancer avant de commencer l’aventure.</p><div className="diceGrid"><Stat label="Dé Force" value={rolledHero.rolls.force}/><Stat label="Dé Dextérité" value={rolledHero.rolls.dex}/><Stat label="Dé Chance" value={rolledHero.rolls.chance}/><Stat label="Dé Esprit" value={rolledHero.rolls.esprit}/><Stat label="Dés PV" value={rolledHero.rolls.pv}/><Stat label="Dé Mana" value={rolledHero.rolls.mana}/></div><div className="diceGrid finalStats"><Stat label="Force finale" value={rolledHero.force}/><Stat label="Dextérité finale" value={rolledHero.dex}/><Stat label="Chance finale" value={rolledHero.chance}/><Stat label="Esprit final" value={rolledHero.esprit}/><Stat label="PV max" value={rolledHero.pvMax}/><Stat label="Mana max" value={rolledHero.manaMax}/></div><div className="btnbar" style={{marginTop:16}}><button className="btn" onClick={() => rollHero(pendingClass)}>Relancer les dés</button><button className="btn primary" onClick={confirmStart}>Commencer l’aventure</button></div></div>}</section></main>
}

function Combat({ combat, hero, attack, chanceMove, cast, restItem }) {
  return <div className="combat"><div className="combatTitle"><div><div className="kicker">Combat</div><h2>{combat.nom}</h2></div><b>{combat.pv}/{combat.pvMax} PV</b></div><div className="track"><div className="fill red" style={{width:pct(combat.pv, combat.pvMax)}} /></div><div className="combatActions"><button className="btn primary" onClick={attack}>Attaquer à l’arme</button><button className="btn" onClick={chanceMove}>Tenter la chance</button><button className="btn good" onClick={restItem}>Utiliser soin/ration</button>{hero.spells.map(s => <button key={s} className="btn" onClick={() => cast(s)}>{s} ({SPELLS[s]?.cout || 0} mana)</button>)}</div><div className="log" style={{marginTop:12}}>{combat.log.map((l,i)=><p key={i}>{l}</p>)}</div></div>
}

function Sidebar({ hero, bookId, pid, log }) {
  return <aside className="side"><div className="card"><h3>Feuille d’aventure</h3><b>{hero.nom}</b><Meter label="PV" value={hero.pv} max={hero.pvMax} cls="red"/><Meter label="Mana" value={hero.mana} max={hero.manaMax} cls="blue"/><div className="grid2"><Stat label="Force" value={hero.force}/><Stat label="Dextérité" value={hero.dex}/><Stat label="Chance" value={`${hero.chance}/${hero.chanceMax}`}/><Stat label="Esprit" value={hero.esprit}/></div></div><div className="card"><h3>Progression</h3><p>Livre {bookId} · Progression {pid}/300</p><Meter label="Mémoire" value={hero.memoire} max={100} cls="purple"/><Meter label="Corruption" value={hero.corruption} max={100} cls="red"/><Meter label="Réputation" value={hero.reputation + 100} max={200}/><p>Niveau {hero.niveau} · XP {hero.xp} · Or {hero.or}</p></div><Tags title="Inventaire" items={hero.items}/><Tags title="Sorts" items={hero.spells}/><Tags title="Alliés" items={hero.allies}/><Tags title="Quêtes actives" items={hero.quests}/><Tags title="Quêtes terminées" items={hero.done}/><Tags title="Secrets" items={hero.secrets}/>{hero.endings.length>0 && <div className="card"><h3>Codes de fin</h3>{hero.endings.map(e=><p className="endCode" key={e}>{e}</p>)}</div>}<div className="card"><h3>Journal</h3><div className="log">{log.map((l,i)=><p key={i}>{l}</p>)}</div></div></aside>
}
function Meter({ label, value, max, cls='' }) { return <div className="meter"><div className="meterRow"><span>{label}</span><span>{value}/{max}</span></div><div className="track"><div className={'fill '+cls} style={{width:pct(value,max)}} /></div></div> }
function Stat({ label, value }) { return <div className="stat"><span>{label}</span><b>{value}</b></div> }
function Tags({ title, items }) { return <div className="card"><h3>{title}</h3><div className="tags">{items.length ? items.map((x,i)=><span className="tag" key={x+i}>{x}</span>) : <span className="tag">Aucun</span>}</div></div> }
