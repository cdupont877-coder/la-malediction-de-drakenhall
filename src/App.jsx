import React, { useEffect, useMemo, useState } from 'react'

const SAVE_KEY = 'les_cendres_astrea_finale_v4'
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
    nom: 'Veilleur amnésique',
    desc: 'Équilibré, lié aux dieux et au Voile. Bon choix pour une première partie.',
    mods: { force: 1, dex: 1, chance: 1, esprit: 1, pv: 8, mana: 6 },
    objets: ['Médaillon du Soleil brisé', 'Pierre à feu'],
    sorts: ['Lueur sacrée'],
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
    sorts: ['Lueur sacrée'],
  },
  mystique: {
    nom: 'Mystique marqué',
    desc: 'Fragile, mais très fort en magie et contre les créatures du Voile.',
    mods: { force: -1, dex: 0, chance: 1, esprit: 5, pv: 4, mana: 14 },
    objets: ['Craie rituelle', 'Chapelet brisé'],
    sorts: ['Lueur sacrée', 'Soin mineur', 'Trait de givre'],
  },
}

const SPELLS = {
  'Lueur sacrée': { cout: 4, type: 'damageHoly', degats: 9, desc: 'Blesse fortement morts-vivants et démons.' },
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
      { start: 241, end: 270, name: 'La Chapelle en Ruine', art: 'chapel', theme: 'relique divine, Guilde Noire, choix de foi' },
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
      { start: 46, end: 90, name: 'Kar-Durak, Royaume Nain', art: 'chapel', theme: 'forges sacrées, mines, scorpions, rune ancienne' },
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
  'Les dieux ne disent pas toute la vérité', 'Un allié peut être possédé', 'Le Soleil brisé est l’emblème des Veilleurs',
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
  const boss = book.bosses[id]
  const chapterIndex = book.zones.findIndex(z => z.name === zone.name) + 1
  const q = QUEST_TITLES[(id + bookId) % QUEST_TITLES.length]
  const s = SECRET_TITLES[(id * 2 + bookId) % SECRET_TITLES.length]
  const enemy = boss || ENEMY_NAMES[(id + bookId * 3) % ENEMY_NAMES.length]
  const dc = 10 + Math.floor(id / 70) + bookId
  const next = Math.min(300, id + 1)
  const branch = Math.min(300, id + 2 + (id % 4))
  const detour = Math.min(300, id + 5 + (id % 6))
  const isBoss = Boolean(boss)
  const isCombat = isBoss || id % 5 === 0 || id % 7 === 0
  const isQuest = id % 12 === 0
  const isSecret = id % 17 === 0
  const isRest = id % 29 === 0

  if (id === 1 && bookId === 1) {
    return {
      title: 'Sous les cadavres', zone: zone.name, art: zone.art,
      text: `Vous ouvrez les yeux dans le noir. Quelque chose pèse sur votre poitrine. Une main morte recouvre votre visage. L’odeur du sang, de la boue et de la chair brûlée vous soulève le cœur.\n\nVous êtes allongé sous un tas de cadavres. Des humains. Des orques. Des nains. Des gobelins. Des soldats dont les armures sont fendues. Des bannières déchirées flottent dans la pluie.\n\nVous essayez de vous souvenir de votre nom. Rien. Seulement une douleur vive à l’arrière du crâne. Puis une voix lointaine résonne : « Relève-toi. Les dieux ne t’ont pas choisi pour mourir ici. »\n\nAutour de votre poignet, une marque pâle commence à brûler.`,
      choices: [
        { label: 'Ramper hors du tas de cadavres', goto: 2 },
        { label: 'Rester immobile et écouter les pillards', test: 'chance', dc: 10, success: 3, fail: 5 },
        { label: 'Fouiller les corps autour de vous', effect: { item: 'Médaillon du Soleil brisé', or: 3, memoire: 1 }, goto: 4 },
        { label: 'Appeler à l’aide', combat: true },
      ],
      enemy: mkEnemy(bookId, id, 'Cadavre animé', true),
    }
  }

  if (id === 1) {
    return {
      title: bookId === 2 ? 'Les royaumes brûlent' : 'La dernière guerre du Voile', zone: zone.name, art: zone.art,
      text: bookId === 2
        ? `Vous quittez les ruines de Val-Cendre avec un code de fin gravé dans votre mémoire. Devant vous, les six royaumes s’accusent, s’arment et saignent. Chaque souverain possède un sceau. Azhraël n’a pas besoin de les voler : il lui suffit que les royaumes se détruisent entre eux.`
        : `Le portail s’ouvre enfin. Les choix des deux premiers livres vous suivent comme des ombres : alliés, dettes, corruptions, serments et morts abandonnés. Face à Azhraël, il ne suffira plus de survivre. Il faudra décider ce qui mérite d’être sauvé.`,
      choices: [{ label: 'Commencer ce livre', goto: 2 }],
    }
  }

  if (id === 300) {
    const ending = bookId === 1 ? 'FIN-I' : bookId === 2 ? 'FIN-II' : 'FIN-TRILOGIE'
    return {
      title: boss || 'Fin du livre', zone: zone.name, art: zone.art,
      text: bookId === 3
        ? `Le trône d’Azhraël se fissure sous vos pieds. Le Dévoreur de Voiles prononce enfin votre nom, mais il arrive trop tard : vous avez retrouvé assez de mémoire pour choisir qui vous êtes.\n\nSelon votre corruption, vos alliés et les secrets découverts, Astréa connaîtra la victoire sacrée, le sacrifice, le règne des cendres ou la vraie fin.`
        : `Le dernier combat de ce livre s’achève dans la fumée. Vous avez survécu, mais Astréa reste au bord du gouffre. Vos choix composent désormais un code de sauvegarde pour le livre suivant.`,
      final: true, ending,
      enemy: mkEnemy(bookId, id, boss || 'Gardien final', true),
    }
  }

  let text = `Vous avancez dans ${zone.name}. Ici, ${zone.theme}. Le passage ${String(id).padStart(3, '0')} n’est pas une simple étape : c’est une décision de plus dans une guerre qui vous dépasse.\n\n`

  if (isBoss) {
    text += `La route se ferme devant vous. ${boss} apparaît, entouré de fumée et de silence. Sa présence semble reconnaître la marque qui brûle à votre poignet. Ce combat peut changer la suite de l’aventure.`
    return { title: boss, zone: zone.name, art: zone.art, text, enemy: mkEnemy(bookId, id, boss, true), choices: [] }
  }

  if (isCombat) {
    text += `Un danger surgit avant que vous puissiez reprendre votre souffle : ${enemy}. Vous pouvez combattre, tenter une manœuvre risquée ou chercher une issue plus discrète.`
    return {
      title: `Combat — ${enemy}`, zone: zone.name, art: zone.art, text, enemy: mkEnemy(bookId, id, enemy, false),
      choices: [
        { label: 'Affronter le danger', combat: true },
        { label: 'Chercher une faille dans le terrain', test: 'dex', dc, success: branch, fail: id },
        { label: 'Utiliser votre chance pour éviter l’affrontement', test: 'chance', dc: dc + 1, success: next, fail: id },
      ]
    }
  }

  if (isQuest) {
    text += `Une piste secondaire se présente : ${q}. Cette quête peut ralentir votre route, mais elle peut aussi vous offrir un allié, un objet ou un fragment de vérité.`
    return {
      title: `Quête — ${q}`, zone: zone.name, art: zone.art, text,
      choices: [
        { label: 'Accepter la quête', effect: { quest: q, reputation: 1 }, goto: next },
        { label: 'Chercher une solution rapide', test: 'esprit', dc, success: branch, fail: next },
        { label: 'Ignorer cette affaire', effect: { reputation: -1, corruption: 1 }, goto: next },
      ]
    }
  }

  if (isSecret) {
    text += `Un détail vous frappe : une trace, un symbole, un mot répété dans un rêve. Si vous prenez le temps de comprendre, vous découvrirez peut-être un secret : ${s}.`
    return {
      title: `Secret dans l’ombre`, zone: zone.name, art: zone.art, text,
      choices: [
        { label: 'Examiner le secret', test: 'esprit', dc, success: branch, fail: next, effect: { secret: s, memoire: 1 } },
        { label: 'Noter l’indice et continuer', effect: { memoire: 1 }, goto: next },
        { label: 'Détruire ce symbole inquiétant', effect: { corruption: -1, reputation: 1 }, goto: next },
      ]
    }
  }

  if (isRest) {
    text += `Un abri précaire vous permet de souffler. La route est encore longue, mais quelques minutes de repos peuvent faire la différence entre un héros vivant et une légende morte.`
    return {
      title: 'Repos précaire', zone: zone.name, art: zone.art, text,
      choices: [
        { label: 'Vous reposer', effect: { pv: 10, mana: 6 }, goto: next },
        { label: 'Monter la garde et écouter', effect: { memoire: 1 }, goto: branch },
        { label: 'Repartir immédiatement', goto: next },
      ]
    }
  }

  text += `Le chemin se divise. Une voie semble directe, l’autre plus dangereuse mais riche en découvertes. Vous sentez que la mémoire, la corruption et la réputation pèseront bientôt autant que votre lame.`
  return {
    title: `Paragraphe ${String(id).padStart(3, '0')}`, zone: zone.name, art: zone.art, text,
    choices: [
      { label: 'Avancer prudemment', goto: next },
      { label: 'Prendre le détour aventureux', goto: detour },
      { label: 'Tenter un raccourci risqué', test: id % 2 === 0 ? 'dex' : 'force', dc, success: branch, fail: next },
      { label: 'Chercher un indice caché', test: 'esprit', dc: dc + 1, success: branch, fail: next, effect: { memoire: 1 } },
    ]
  }
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
  const [shield, setShield] = useState(false)

  useEffect(() => { setSavedAvailable(Boolean(localStorage.getItem(SAVE_KEY))) }, [])

  const passage = useMemo(() => generatedPassage(bookId, pid, hero), [bookId, pid, hero])

  function addLog(txt) { setLog(l => [txt, ...l].slice(0, 12)) }
  function save() { localStorage.setItem(SAVE_KEY, JSON.stringify({ hero, bookId, pid, log })); setSavedAvailable(true); addLog('Partie sauvegardée.') }
  function load() { const s = JSON.parse(localStorage.getItem(SAVE_KEY)); setHero(s.hero); setBookId(s.bookId); setPid(s.pid); setLog(s.log || ['Sauvegarde chargée.']); setScreen('game'); setCombat(null) }
  function erase() { localStorage.removeItem(SAVE_KEY); setSavedAvailable(false); addLog('Sauvegarde effacée.') }
  function startGame(classKey) { const h = createHero(classKey); setHero(h); setBookId(selectedBook); setPid(1); setScreen('game'); setLog([`Héros créé : ${h.nom}. Les caractéristiques ont été lancées aux dés.`]); setCombat(null) }
  function restart() { setHero(null); setPid(1); setCombat(null); setScreen('home'); setLastRoll(null) }

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
      setTimeout(() => go(ok ? choice.success : choice.fail, ok ? choice.effect : null), 450)
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

  if (screen === 'home') return <Home selectedBook={selectedBook} setSelectedBook={setSelectedBook} startGame={startGame} savedAvailable={savedAvailable} load={load} erase={erase} />

  const art = ILLUSTRATIONS[passage.art] || ILLUSTRATIONS.battlefield
  return <main className="app"><div className="shell">
    <section className="panel">
      <div className="header"><div><div className="kicker">{BOOKS[bookId].title} · Paragraphe {String(pid).padStart(3,'0')} · {passage.zone}</div><h1>{passage.title}</h1></div><div className="btnbar"><button className="btn good" onClick={save}>Sauvegarder</button><button className="btn" onClick={restart}>Menu</button></div></div>
      <div className="content">
        <img className="illustration" src={art} alt="Illustration noir et blanc" />
        <article className="paper"><h3>{passage.title}</h3><p className="text">{passage.text}</p></article>
        {lastRoll && <div className="combat"><b>Jet de dés</b><p>{lastRoll.a}+{lastRoll.b}+{lastRoll.stat} {lastRoll.bonus} = {lastRoll.total} / {lastRoll.dc} — {lastRoll.ok ? 'réussite' : 'échec'}.</p></div>}
        {passage.final && !combat && <div className="combat"><p>Dernier obstacle du livre. Vous pouvez terminer ce livre en remportant le combat final.</p><button className="btn primary" onClick={() => startCombat(passage.enemy)}>Affronter {passage.enemy.nom}</button></div>}
        {combat && <Combat combat={combat} hero={hero} attack={attack} chanceMove={chanceMove} cast={cast} restItem={restItem} />}
        {!combat && !passage.final && <div className="choices">{passage.choices.map((c, i) => <button key={i} className={'choice ' + (!can(c) ? 'locked' : '')} onClick={() => choose(c)}>{c.label}{c.test && <small>Test : {c.test} — difficulté {c.dc}</small>}</button>)}</div>}
      </div>
    </section>
    <Sidebar hero={hero} bookId={bookId} pid={pid} log={log} save={save} />
  </div></main>
}

function Home({ selectedBook, setSelectedBook, startGame, savedAvailable, load, erase }) {
  return <main className="home"><section className="panel heroBox"><div className="kicker">Version finale · Trilogie livre-jeu RPG</div><h1>Les Cendres d’Astréa</h1><h2>900 paragraphes jouables · combats · quêtes · secrets · illustrations noir et blanc</h2><p className="intro">Un homme se réveille amnésique sous un tas de cadavres, au milieu d’un champ de bataille. Le monde est en guerre, les épidémies ravagent les villages, les guildes se déchirent et un démon primordial manipule les six royaumes pour ouvrir un portail vers la dimension démoniaque.</p>{savedAvailable && <div className="btnbar" style={{marginTop:16}}><button className="btn good" onClick={load}>Continuer la sauvegarde</button><button className="btn bad" onClick={erase}>Effacer la sauvegarde</button></div>}<h2 style={{marginTop:24}}>Choisis le livre</h2><div className="books">{Object.entries(BOOKS).map(([id,b]) => <button key={id} className="selectCard" onClick={() => setSelectedBook(Number(id))} style={{outline: selectedBook===Number(id)?'2px solid #f1c36d':'none'}}><h3>{b.title}</h3><p>{b.subtitle}</p><b>300 paragraphes minimum</b></button>)}</div><h2 style={{marginTop:24}}>Choisis ton héros</h2><div className="classes">{Object.entries(CLASSES).map(([k,c]) => <button key={k} className="selectCard" onClick={() => startGame(k)}><h3>{c.nom}</h3><p>{c.desc}</p><small>Stats générées aux dés</small></button>)}</div></section></main>
}

function Combat({ combat, hero, attack, chanceMove, cast, restItem }) {
  return <div className="combat"><div className="combatTitle"><div><div className="kicker">Combat</div><h2>{combat.nom}</h2></div><b>{combat.pv}/{combat.pvMax} PV</b></div><div className="track"><div className="fill red" style={{width:pct(combat.pv, combat.pvMax)}} /></div><div className="combatActions"><button className="btn primary" onClick={attack}>Attaquer à l’arme</button><button className="btn" onClick={chanceMove}>Tenter la chance</button><button className="btn good" onClick={restItem}>Utiliser soin/ration</button>{hero.spells.map(s => <button key={s} className="btn" onClick={() => cast(s)}>{s} ({SPELLS[s]?.cout || 0} mana)</button>)}</div><div className="log" style={{marginTop:12}}>{combat.log.map((l,i)=><p key={i}>{l}</p>)}</div></div>
}

function Sidebar({ hero, bookId, pid, log }) {
  return <aside className="side"><div className="card"><h3>Feuille d’aventure</h3><b>{hero.nom}</b><Meter label="PV" value={hero.pv} max={hero.pvMax} cls="red"/><Meter label="Mana" value={hero.mana} max={hero.manaMax} cls="blue"/><div className="grid2"><Stat label="Force" value={hero.force}/><Stat label="Dextérité" value={hero.dex}/><Stat label="Chance" value={`${hero.chance}/${hero.chanceMax}`}/><Stat label="Esprit" value={hero.esprit}/></div></div><div className="card"><h3>Progression</h3><p>Livre {bookId} · § {pid}/300</p><Meter label="Mémoire" value={hero.memoire} max={100} cls="purple"/><Meter label="Corruption" value={hero.corruption} max={100} cls="red"/><Meter label="Réputation" value={hero.reputation + 100} max={200}/><p>Niveau {hero.niveau} · XP {hero.xp} · Or {hero.or}</p></div><Tags title="Inventaire" items={hero.items}/><Tags title="Sorts" items={hero.spells}/><Tags title="Alliés" items={hero.allies}/><Tags title="Quêtes actives" items={hero.quests}/><Tags title="Quêtes terminées" items={hero.done}/><Tags title="Secrets" items={hero.secrets}/>{hero.endings.length>0 && <div className="card"><h3>Codes de fin</h3>{hero.endings.map(e=><p className="endCode" key={e}>{e}</p>)}</div>}<div className="card"><h3>Journal</h3><div className="log">{log.map((l,i)=><p key={i}>{l}</p>)}</div></div></aside>
}
function Meter({ label, value, max, cls='' }) { return <div className="meter"><div className="meterRow"><span>{label}</span><span>{value}/{max}</span></div><div className="track"><div className={'fill '+cls} style={{width:pct(value,max)}} /></div></div> }
function Stat({ label, value }) { return <div className="stat"><span>{label}</span><b>{value}</b></div> }
function Tags({ title, items }) { return <div className="card"><h3>{title}</h3><div className="tags">{items.length ? items.map((x,i)=><span className="tag" key={x+i}>{x}</span>) : <span className="tag">Aucun</span>}</div></div> }
