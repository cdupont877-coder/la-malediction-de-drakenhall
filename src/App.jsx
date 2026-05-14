import React, { useEffect, useMemo, useState } from 'react'

const SAVE_KEY = 'les_cendres_astrea_v4_2_arborescence_propre'
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


const MANUAL_BOOK1 = (() => {
  const n = {}
  const add = (id, data) => { n[id] = data }

  add(1, {
    title: 'Sous les cadavres', zone: 'Le Champ des Morts', art: 'battlefield',
    text: `Vous ouvrez les yeux dans le noir. Quelque chose pèse sur votre poitrine. Une main morte recouvre votre visage. L'odeur du sang, de la boue et de la chair brûlée vous soulève le cœur.

Vous êtes allongé sous un tas de cadavres. Des humains. Des orques. Des nains. Des gobelins. Des soldats dont les armures sont fendues. Des bannières déchirées flottent dans la pluie.

Vous ne vous souvenez pas de votre nom. Une douleur vive cogne à l'arrière de votre crâne. Autour de votre poignet, une marque pâle apparaît sous la boue, comme une brûlure ancienne.

Une voix lointaine traverse votre esprit, trop faible pour être comprise : « Pas ici. Pas encore. »`,
    choices: [
      { label: 'Repousser les corps et sortir du charnier', goto: 2 },
      { label: 'Rester immobile pour écouter les vivants', goto: 3 },
      { label: 'Fouiller ce qui se trouve à portée de main', goto: 4 },
      { label: 'Appeler à l\'aide malgré le danger', goto: 5 },
    ]
  })
  add(2, { title: 'La pluie rouge', zone: 'Le Champ des Morts', art: 'battlefield', text: `Vous poussez un cadavre d'épaule, puis un autre. Votre main s'enfonce dans une boue tiède. Lorsque vous parvenez enfin à respirer, la pluie vous frappe le visage.

Le champ de bataille s'étend à perte de vue. Lances brisées, chevaux éventrés, roues calcinées, boucliers fendus. Au loin, des silhouettes fouillent déjà les morts.

Ce ne sont pas des secours. Ce sont des charognards.`, choices: [ { label: 'Ramper derrière une bannière tombée', goto: 6 }, { label: 'Chercher une arme avant d\'être vu', goto: 7 }, { label: 'Observer les charognards', goto: 8 } ] })
  add(3, { title: 'Les voix au-dessus des morts', zone: 'Le Champ des Morts', art: 'battlefield', text: `Vous restez sous les corps et retenez votre souffle.

Deux hommes approchent.

« Les bagues, les bottes, les dents en or. Le reste aux corbeaux. »
« Et les survivants ? »
« On les achève. Sauf celui qui porte la marque. »

Un troisième pas, plus lent, s'arrête près de vous. La marque à votre poignet brûle comme si elle avait entendu son nom.`, choices: [ { label: 'Faire le mort jusqu\'à leur départ — test de Chance', test: 'chance', dc: 10, success: 9, failCombat: true }, { label: 'Sortir brusquement et frapper le premier homme', combat: true }, { label: 'Ramper vers l\'arrière du charnier — test de Dextérité', test: 'dex', dc: 11, success: 10, failCombat: true } ], enemy: mkEnemy(1, 3, 'Pillard nerveux', false), blocking: true })
  add(4, { title: 'Ce que gardent les morts', zone: 'Le Champ des Morts', art: 'battlefield', text: `Vos doigts cherchent dans la boue. Vous trouvez d'abord une bourse trouée, puis une dague rouillée. Sous le bras d'un soldat, un médaillon couvert de sang attire votre regard.

Vous l'essuyez. Un soleil brisé traversé par une lame apparaît. Vous ne savez pas pourquoi ce symbole vous trouble, mais votre cœur se serre.`, choices: [ { label: 'Prendre le médaillon', effect: { item: 'Médaillon du Soleil brisé', or: 3, memoire: 1, secret: 'Le Soleil brisé semble lié à votre passé' }, goto: 11 }, { label: 'Continuer à fouiller malgré le bruit', goto: 12 }, { label: 'Abandonner les objets et sortir du charnier', goto: 2 } ] })
  add(5, { title: 'Un cri de trop', zone: 'Le Champ des Morts', art: 'battlefield', text: `Votre appel se perd sous la pluie.

Un instant passe.

Puis une main morte vous agrippe la cheville. Un visage à moitié arraché se relève dans la boue. Ce soldat n'a plus de regard, mais il cherche encore une gorge à mordre.`, enemy: mkEnemy(1, 5, 'Cadavre animé', false), blocking: true, choices: [ { label: 'Combattre le cadavre animé', combat: true }, { label: 'Tenter de vous dégager — test de Force', test: 'force', dc: 11, success: 13, failCombat: true } ] })
  add(6, { title: 'La bannière au griffon', zone: 'Le Champ des Morts', art: 'battlefield', text: `Vous rampez derrière une bannière bleue déchirée. Un griffon argenté y disparaît sous la boue.

Près du mât brisé, un officier mort serre encore une épée courte. Ses yeux ouverts semblent vous accuser d'avoir survécu à sa place.`, choices: [ { label: 'Prendre l\'épée et l\'armure de l\'officier', effect: { item: 'Épée du griffon', item2: 'Armure de cuir' }, goto: 14 }, { label: 'Lire les insignes de la bannière', effect: { memoire: 1, secret: 'Aldéris combattait ici' }, goto: 15 }, { label: 'Vous cacher sous la bannière', goto: 9 } ] })
  add(7, { title: 'Une arme dans la boue', zone: 'Le Champ des Morts', art: 'battlefield', text: `Vous fouillez autour de vous avec urgence. Trois armes ont survécu au massacre : une épée brisée, une lance de fantassin et une hache fendue.

Aucune n'est belle. Toutes peuvent vous sauver.`, choices: [ { label: 'Prendre l\'épée brisée', effect: { item: 'Épée brisée' }, goto: 14 }, { label: 'Prendre la lance de fantassin', effect: { item: 'Lance de fantassin' }, goto: 14 }, { label: 'Prendre la hache fendue', effect: { item: 'Hache fendue' }, goto: 14 } ] })
  add(8, { title: 'Les charognards', zone: 'Le Champ des Morts', art: 'battlefield', text: `Vous observez les pillards. Ils ne forment pas une vraie troupe : deux humains, un gobelin, un orque blessé et un homme à capuche noire.

L'homme encapuchonné ne ramasse rien. Il inspecte les poignets des cadavres.`, choices: [ { label: 'Suivre l\'homme à capuche de loin', goto: 16 }, { label: 'Voler un sac au gobelin — test de Dextérité', test: 'dex', dc: 12, success: 17, failCombat: true }, { label: 'Éviter le groupe et quitter la zone', goto: 18 } ], enemy: mkEnemy(1, 8, 'Gobelin charognard', false), blocking: false })
  add(9, { title: 'Retenir son souffle', zone: 'Le Champ des Morts', art: 'battlefield', text: `Les bottes passent à moins d'un pas de votre visage. Un couteau retourne un cadavre au-dessus de vous.

Vous ne bougez pas. La pluie vous aide : elle masque le tremblement de votre respiration. Lorsque les pillards s'éloignent enfin, vous savez deux choses : ils cherchent quelqu'un de vivant, et ce quelqu'un pourrait être vous.`, choices: [ { label: 'Chercher un autre survivant', goto: 19 }, { label: 'Suivre les traces des pillards', goto: 20 }, { label: 'Partir vers le village dont le clocher fume', goto: 36 } ] })
  add(10, { title: 'Sous le chariot renversé', zone: 'Le Champ des Morts', art: 'battlefield', text: `Vous glissez hors du charnier et trouvez refuge sous un chariot renversé.

Une lame se pose aussitôt contre votre gorge.

La personne qui la tient est une jeune femme en armure légère, le visage couvert de suie. Elle a l'air aussi épuisée que vous, mais sa main ne tremble pas.`, choices: [ { label: 'Lever les mains et parler', goto: 21 }, { label: 'Tenter de la désarmer — test de Dextérité', test: 'dex', dc: 12, success: 22, failCombat: true }, { label: 'Reculer lentement', goto: 23 } ], enemy: mkEnemy(1, 10, 'Éclaireuse paniquée', false) })
  add(11, { title: 'Le médaillon réveille une image', zone: 'Le Champ des Morts', art: 'battlefield', text: `Le médaillon pèse peu, mais sa présence contre votre paume réveille une douleur derrière vos yeux.

Vous voyez six silhouettes autour d'une table ronde. Une carte. Des sceaux. Une porte rouge esquissée à l'encre noire.

Puis l'image disparaît. Vous n'avez gagné qu'un fragment, mais c'est déjà plus que le vide.`, choices: [ { label: 'Garder le médaillon caché', effect: { memoire: 2, secret: 'Six sceaux apparaissent dans un souvenir fragmenté' }, goto: 18 }, { label: 'Le passer autour du cou', effect: { item: 'Médaillon porté', memoire: 1 }, goto: 24 } ] })
  add(12, { title: 'La goule fraîche', zone: 'Le Champ des Morts', art: 'battlefield', text: `Vous continuez à fouiller. Sous un soldat nain, vous trouvez une fiole verte.

Le cadavre ouvre alors les yeux.

Sa bouche s'ouvre trop grand, et une faim noire remplace ce qui lui restait d'humanité.`, enemy: mkEnemy(1, 12, 'Goule fraîche', false), blocking: true, choices: [ { label: 'Combattre la goule', combat: true }, { label: 'Utiliser la fiole comme appât — test de Chance', test: 'chance', dc: 12, success: 25, failCombat: true } ] })
  add(13, { title: 'Se libérer du mort', zone: 'Le Champ des Morts', art: 'battlefield', text: `Vous écrasez le poignet du cadavre contre une pierre. Les doigts morts lâchent prise.

Votre cheville saigne, mais vous êtes libre. Autour de vous, d'autres corps remuent à peine. Ce champ n'a pas fini de rendre ses morts.`, choices: [ { label: 'Quitter le charnier sans attendre', effect: { pv: -2 }, goto: 18 }, { label: 'Chercher une arme avant de partir', goto: 7 } ] })
  add(14, { title: 'Le corps se souvient', zone: 'Le Champ des Morts', art: 'battlefield', text: `L'arme dans votre main ne vous semble pas étrangère. Votre mémoire est vide, mais vos muscles savent comment équilibrer le poids, comment protéger votre flanc, comment frapper.

Vous avez déjà combattu. Beaucoup.`, choices: [ { label: 'Tester quelques mouvements avant d\'avancer', effect: { xp: 1, memoire: 1 }, goto: 18 }, { label: 'Rejoindre le chariot renversé', goto: 10 } ] })
  add(15, { title: 'Aldéris dans la boue', zone: 'Le Champ des Morts', art: 'battlefield', text: `Le griffon argenté appartient à Aldéris, le royaume humain central. Ce nom tire quelque chose de votre esprit : un cri de bataille, une ligne qui cède, un ordre hurlé trop tard.

Mais vous ignorez encore si vous serviez ce royaume ou si vous le combattiez.`, choices: [ { label: 'Emporter un morceau de bannière', effect: { item: 'Fragment de bannière d\'Aldéris', memoire: 1 }, goto: 18 }, { label: 'Laisser la bannière aux morts', goto: 18 } ] })
  add(16, { title: 'Le cercle sous la pluie', zone: 'Le Champ des Morts', art: 'battlefield', text: `L'homme à capuche s'arrête près de six cadavres disposés en cercle : humain, orque, nain, gobelin, elfe noir, barbare.

Il trace un signe rouge dans la boue. L'air se fend un instant au-dessus des corps, comme une blessure minuscule dans le monde.

« Le marqué respire encore », murmure-t-il.`, choices: [ { label: 'Briser le cercle avant la fin du rituel — test de Force', test: 'force', dc: 12, success: 26, failCombat: true }, { label: 'Attaquer l\'homme à capuche', combat: true }, { label: 'Mémoriser le rituel et fuir', effect: { secret: 'Six peuples ont été utilisés dans un rituel de guerre', corruption: 1, memoire: 1 }, goto: 36 } ], enemy: mkEnemy(1, 16, 'Adepte de la Guilde Noire', true), blocking: true })
  add(17, { title: 'Le sac du gobelin', zone: 'Le Champ des Morts', art: 'battlefield', text: `Vous dérobez le sac sans être vu. À l'intérieur : quelques pièces, une ration dure comme du bois et une pierre noire qui pulse comme un cœur malade.

La garder pourrait être utile. Ou dangereux.`, choices: [ { label: 'Garder la pierre noire', effect: { or: 6, item: 'Ration', item2: 'Pierre noire tiède', corruption: 1 }, goto: 27 }, { label: 'Jeter la pierre et garder le reste', effect: { or: 6, item: 'Ration' }, goto: 18 } ] })
  add(18, { title: 'La route du clocher', zone: 'Le Champ des Morts', art: 'battlefield', text: `Vous quittez le centre du massacre. Derrière vous, les corbeaux descendent sur les corps. Devant vous, une route boueuse mène vers un village dont le clocher fume encore.

Sur une borne renversée, vous lisez : Val-Cendre.`, choices: [ { label: 'Marcher directement vers Val-Cendre', goto: 36 }, { label: 'Suivre les traces des pillards avant le village', goto: 28 }, { label: 'Chercher encore des survivants', goto: 19 } ] })
  add(19, { title: 'Le nain sous le bouclier', zone: 'Le Champ des Morts', art: 'battlefield', text: `Un râle répond à votre appel. Sous un bouclier fendu, un nain respire encore. Sa barbe est collée de sang, et ses mains serrent une boîte de métal gravée de runes.

« Pas aux hommes en noir », souffle-t-il.`, choices: [ { label: 'Tenter de sauver le nain — test d\'Esprit', test: 'esprit', dc: 11, success: 29, fail: 30 }, { label: 'Prendre la boîte et partir', effect: { item: 'Boîte naine scellée', reputation: -1 }, goto: 18 }, { label: 'Lui demander qui sont les hommes en noir', goto: 31 } ] })
  add(20, { title: 'Les traces du butin', zone: 'Le Champ des Morts', art: 'battlefield', text: `Vous suivez les traces des pillards jusqu'à une butte. De l'autre côté, un petit camp s'est formé autour d'un feu maigre.

Un prisonnier est attaché à une roue de chariot. À côté de lui, l'orque blessé du champ de bataille garde les yeux ouverts.`, choices: [ { label: 'Observer le camp avant d\'agir', goto: 28 }, { label: 'Libérer le prisonnier discrètement — test de Dextérité', test: 'dex', dc: 13, success: 32, failCombat: true }, { label: 'Attaquer le camp', combat: true } ], enemy: mkEnemy(1, 20, 'Pillards du camp', false), blocking: true })
  add(21, { title: 'Élyane', zone: 'Le Champ des Morts', art: 'battlefield', text: `Vous levez les mains.

La jeune femme hésite, puis abaisse sa lame d'un doigt.

« Élyane. Éclaireuse d'Aldéris. Si tu es un pillard, je te tue. Si tu es un survivant, tu as intérêt à ne pas me ralentir. »

Vous ouvrez la bouche pour donner votre nom. Rien ne vient.`, choices: [ { label: 'Dire la vérité sur votre amnésie', effect: { ally: 'Élyane', reputation: 1 }, goto: 33 }, { label: 'Demander ce qui s\'est passé ici', effect: { secret: 'La bataille a reçu des ordres contradictoires' }, goto: 34 }, { label: 'Lui montrer le médaillon si vous l\'avez', goto: 35 } ] })
  add(22, { title: 'Le geste d\'un vétéran', zone: 'Le Champ des Morts', art: 'battlefield', text: `Votre main dévie la dague avant que vous ayez décidé de bouger. Élyane recule, surprise.

« Tu dis ne pas savoir qui tu es, mais ton corps n'a rien oublié. »

Vous lui rendez sa lame. La méfiance reste, mais elle n'est plus seule.`, choices: [ { label: 'Proposer de quitter le champ ensemble', effect: { ally: 'Élyane', memoire: 1 }, goto: 33 }, { label: 'Partir seul pour éviter les questions', goto: 18 } ] })
  add(23, { title: 'Une alliance manquée', zone: 'Le Champ des Morts', art: 'battlefield', text: `Vous reculez. Élyane ne vous retient pas.

Avant de disparaître entre les chariots, elle lance : « Si tu vas à Val-Cendre, évite le puits. Même les blessés refusent d'en boire. »`, choices: [ { label: 'Retenir l\'avertissement et partir', effect: { secret: 'Le puits de Val-Cendre inspire déjà la peur' }, goto: 36 }, { label: 'Revenir vers elle malgré tout', test: 'esprit', dc: 12, success: 21, fail: 36 } ] })
  add(24, { title: 'La marque répond', zone: 'Le Champ des Morts', art: 'battlefield', text: `Le médaillon touche votre peau. La marque à votre poignet devient chaude, puis lumineuse sous la boue.

Ce n'est pas assez fort pour éclairer le champ. Juste assez pour faire reculer les corbeaux autour de vous.

Vous ne comprenez pas ce pouvoir. Vous comprenez seulement qu'il existe.`, choices: [ { label: 'Cacher la marque avant qu\'on la voie', effect: { spell: 'Lueur pâle', memoire: 1 }, goto: 18 }, { label: 'La laisser briller une seconde', effect: { spell: 'Lueur pâle', memoire: 2, corruption: -1 }, goto: 36 } ] })
  add(25, { title: 'La fiole trouble', zone: 'Le Champ des Morts', art: 'battlefield', text: `La goule se jette sur la fiole et la mord comme une bête. Le verre éclate. La créature recule en hurlant, assez longtemps pour que vous puissiez vous dégager.

La potion est perdue, mais vous êtes vivant.`, choices: [ { label: 'Quitter le charnier', effect: { xp: 1 }, goto: 18 }, { label: 'Profiter de l\'ouverture pour l\'achever', combat: true } ], enemy: mkEnemy(1, 25, 'Goule blessée', false) })
  add(26, { title: 'Le rituel brisé', zone: 'Le Champ des Morts', art: 'battlefield', text: `Vous renversez deux corps du cercle. Le signe rouge se déforme, puis se noie dans la boue.

L'adepte hurle comme si vous aviez brisé quelque chose dans sa propre chair. La fente dans l'air se referme, mais pas avant qu'un regard immense vous effleure depuis l'autre côté.`, choices: [ { label: 'Fuir avant que l\'adepte se relève', effect: { secret: 'Le Voile peut être blessé puis refermé', memoire: 1, corruption: -1 }, goto: 36 }, { label: 'Achever l\'adepte', combat: true } ], enemy: mkEnemy(1, 26, 'Adepte de la Guilde Noire', true), blocking: true })
  add(27, { title: 'La pierre noire', zone: 'Le Champ des Morts', art: 'battlefield', text: `La pierre tiède vibre contre votre paume. Une promesse sans mots remonte dans votre esprit : mémoire, force, vérité.

Puis une douleur vous fend le crâne. Une porte rouge. Des silhouettes agenouillées. Votre propre main tendue vers quelque chose que vous regrettez déjà.`, choices: [ { label: 'Garder la pierre malgré le malaise', effect: { memoire: 1, corruption: 2, secret: 'La pierre noire montre des souvenirs déformés' }, goto: 36 }, { label: 'L\'écraser sous une pierre — test de Force', test: 'force', dc: 12, success: 26, fail: 36 } ] })

  // Acte II — Camp des pillards / route vers Val-Cendre
  add(28, { title: 'Le camp des pillards', zone: 'Camp des Pillards', art: 'battlefield', text: `Le camp n'est qu'un cercle de toiles sales et de sacs volés. Pourtant, il contrôle la route vers Val-Cendre.

Le prisonnier attaché à la roue murmure : « Le village... le puits... ne buvez pas l'eau. »

L'orque blessé observe vos gestes. Il n'a pas l'air d'aimer les pillards plus que vous.`, choices: [ { label: 'Libérer le prisonnier', goto: 32 }, { label: 'Parler à l\'orque blessé', goto: 37 }, { label: 'Défier le chef du camp', goto: 38 }, { label: 'Voler une carte et partir — test de Dextérité', test: 'dex', dc: 12, success: 39, failCombat: true } ], enemy: mkEnemy(1, 28, 'Pillard de garde', false) })
  add(29, { title: 'Borik respire encore', zone: 'Le Champ des Morts', art: 'battlefield', text: `Vous comprimez la plaie du nain avec un morceau de bannière. Sa respiration se stabilise.

« Borik... de Kar-Durak. Cette boîte doit atteindre une forge. Si les hommes en noir l'ouvrent, ils sauront comment tuer ce qui garde encore le monde fermé. »`, choices: [ { label: 'Aider Borik jusqu\'à Val-Cendre', effect: { ally: 'Borik', item: 'Boîte naine scellée', reputation: 1 }, goto: 36 }, { label: 'Lui demander ce que contient la boîte', effect: { secret: 'La boîte naine contient un métal contre les créatures du Voile' }, goto: 40 } ] })
  add(30, { title: 'La boîte sans témoin', zone: 'Le Champ des Morts', art: 'battlefield', text: `Vous tentez de sauver le nain, mais la vie le quitte avant que vous trouviez les bons gestes.

Sa main reste crispée sur la boîte. Vous pouvez la prendre, l'enterrer avec lui, ou la laisser à ceux qui fouillent les morts.`, choices: [ { label: 'Prendre la boîte', effect: { item: 'Boîte naine scellée', memoire: 1 }, goto: 36 }, { label: 'Enterrer Borik avec la boîte', effect: { reputation: 1, corruption: -1 }, goto: 36 }, { label: 'Ouvrir la boîte de force — test de Force', test: 'force', dc: 14, success: 40, fail: 36 } ] })
  add(31, { title: 'Les hommes en noir', zone: 'Le Champ des Morts', art: 'battlefield', text: `Borik serre les dents.

« Le Cercle de Cendre. Ils disent servir la connaissance, mais ils collectionnent les fragments qui rendent les morts dociles et les vivants malades. »

Il tousse du sang.

« Ils ne cherchent pas une victoire. Ils cherchent une ouverture. »`, choices: [ { label: 'Tenter de le sauver', goto: 29 }, { label: 'Prendre la boîte et partir', effect: { item: 'Boîte naine scellée', secret: 'Le Cercle de Cendre cherche des fragments', memoire: 1 }, goto: 36 } ] })
  add(32, { title: 'Le prisonnier de Val-Cendre', zone: 'Camp des Pillards', art: 'battlefield', text: `Vous coupez les liens du prisonnier. Il tombe dans la boue en tremblant.

« Ils voulaient me vendre à une femme qu'ils appellent la Veuve Rouge. Elle paie pour ceux qui ont vu le puits. »

Ses yeux se fixent sur votre poignet.

« Vous aussi, vous êtes marqué ? »`, choices: [ { label: 'Lui demander ce qu\'il sait du puits', effect: { secret: 'La Veuve Rouge recherche les témoins du puits', quest: 'Comprendre le puits de Val-Cendre' }, goto: 36 }, { label: 'Lui ordonner de fuir', effect: { reputation: 1 }, goto: 36 }, { label: 'L\'interroger sur la Veuve Rouge', goto: 41 } ] })
  add(33, { title: 'Marcher avec Élyane', zone: 'Route de Val-Cendre', art: 'battlefield', text: `Élyane marche à quelques pas de vous, dague basse, regard haut.

Elle ne vous fait pas encore confiance, mais elle vous indique les pièges, les corps qui bougent encore, et les endroits où la boue garde les empreintes.

« Si tu as oublié ton camp, ne te presse pas d'en choisir un », dit-elle. « Aujourd'hui, tous les camps ont menti. »`, choices: [ { label: 'Lui demander qui a menti', effect: { secret: 'Des ordres contradictoires ont déclenché le massacre' }, goto: 34 }, { label: 'Rejoindre Val-Cendre ensemble', goto: 36 } ] })
  add(34, { title: 'Les ordres impossibles', zone: 'Route de Val-Cendre', art: 'battlefield', text: `Élyane vous parle de messagers arrivés avant l'aube. Chaque régiment aurait reçu un ordre différent : attaquer, reculer, tenir, brûler les chariots, sauver les blessés, exécuter les traîtres.

« Ce n'était pas une bataille », conclut-elle. « C'était une machine faite pour transformer des peuples entiers en ennemis. »`, choices: [ { label: 'Continuer avec Élyane', effect: { memoire: 1, secret: 'La bataille a été organisée pour créer le chaos entre peuples' }, goto: 36 } ] })
  add(35, { title: 'Le symbole qu\'elle reconnaît', zone: 'Route de Val-Cendre', art: 'battlefield', text: `Élyane regarde le médaillon du Soleil brisé.

« Ma grand-mère disait que ce symbole appartenait à des gardiens disparus. Pas des rois. Pas des prêtres. Des gens qui protégeaient une frontière dont personne ne parle plus. »

Elle vous rend le médaillon comme s'il était plus lourd qu'avant.`, choices: [ { label: 'Lui demander le nom de ces gardiens', effect: { secret: 'Les Veilleurs du Voile portaient le Soleil brisé', memoire: 1 }, goto: 36 }, { label: 'Ne pas insister', goto: 36 } ] })
  add(36, { title: 'Val-Cendre en vue', zone: 'Route de Val-Cendre', art: 'village', text: `La route descend vers Val-Cendre.

Le village ne brûle pas vraiment. Il fume, comme une plaie mal refermée. Les maisons ont les volets fermés. Des marques rouges barrent certaines portes.

À l'entrée, un panneau cloué de travers annonce : PESTE. NE PAS ENTRER.

Puis un gémissement monte de la place, près du puits.`, choices: [ { label: 'Entrer par la rue principale', goto: 46 }, { label: 'Contourner par les jardins abandonnés', goto: 47 }, { label: 'Observer les marques rouges avant d\'entrer', goto: 48 } ] })
  add(37, { title: 'Rogh', zone: 'Camp des Pillards', art: 'battlefield', text: `L'orque blessé se nomme Rogh. Il garde son bras contre ses côtes, mais son regard reste dur.

« Mon clan n'a pas massacré les fermes d'Aldéris. On nous a montré les corps, puis on a montré nos bannières. Quelqu'un voulait la guerre. »

Il crache dans le feu.

« Et les imbéciles l'ont donnée. »`, choices: [ { label: 'Lui proposer une dette : vous l\'aidez, il vous aide', effect: { ally: 'Rogh', secret: 'Le clan de Rogh a été accusé à tort', reputation: 1 }, goto: 36 }, { label: 'Laisser Rogh et partir', goto: 36 } ] })
  add(38, { title: 'Marn le Crochu', zone: 'Camp des Pillards', art: 'battlefield', text: `Le chef du camp sort de sa tente avec une hache courte et un sourire fendu.

« Un survivant qui marche, ça vaut plus cher qu'un mort. Surtout quand il porte une marque bizarre. »

Les autres pillards reculent. Ce duel décidera si vous partez libre ou attaché.`, enemy: mkEnemy(1, 38, 'Marn le Crochu', true), blocking: true, choices: [ { label: 'Combattre Marn', combat: true }, { label: 'Le provoquer pour le rendre imprudent — test d\'Esprit', test: 'esprit', dc: 13, success: 39, failCombat: true } ] })
  add(39, { title: 'La carte tachée', zone: 'Camp des Pillards', art: 'battlefield', text: `Vous repartez avec une carte grossière prise au camp. Trois lieux sont entourés : Val-Cendre, le vieux cimetière et Brumeval.

À côté de Brumeval, une main tremblée a écrit : ne pas entrer après le coucher du soleil.`, choices: [ { label: 'Garder la carte et fouiller le camp', effect: { item: 'Carte tachée', item2: 'Bouclier de bois', or: 5, secret: 'Brumeval est lié aux routes des pillards' }, goto: 36 } ] })
  add(40, { title: 'Le métal céleste', zone: 'Route de Val-Cendre', art: 'battlefield', text: `La boîte naine s'ouvre dans un claquement sec. À l'intérieur repose un éclat de métal pâle, trop froid pour ce monde.

Une rune gravée sur le couvercle dit simplement : pour ce qui franchit le Voile.`, choices: [ { label: 'Refermer la boîte et la garder', effect: { item: 'Métal céleste', secret: 'Le métal céleste peut blesser les créatures du Voile' }, goto: 36 } ] })
  add(41, { title: 'Le nom de la Veuve Rouge', zone: 'Camp des Pillards', art: 'battlefield', text: `Le prisonnier a vu la Veuve Rouge une seule fois : une femme voilée, entourée de mercenaires, qui achetait les témoins et les malades.

Elle ne cherchait pas de l'or. Elle cherchait des gens ayant entendu le puits parler.`, choices: [ { label: 'Noter ce nom et partir vers Val-Cendre', effect: { secret: 'La Veuve Rouge achète les témoins du surnaturel', quest: 'Identifier la Veuve Rouge' }, goto: 36 } ] })

  // Acte III — Val-Cendre
  add(46, { title: 'La rue principale', zone: 'Val-Cendre', art: 'village', text: `Vous franchissez l'entrée de Val-Cendre.

La rue principale est vide, mais pas silencieuse. Derrière les volets, des gens respirent trop fort. Une charrette renversée bloque l'accès à la place.

Au centre du village, le vieux puits semble plus noir que la nuit autour.`, choices: [ { label: 'Aller vers le puits', goto: 49 }, { label: 'Chercher les survivants', goto: 50 }, { label: 'Entrer dans la maison du guérisseur', goto: 51 } ] })
  add(47, { title: 'Les jardins abandonnés', zone: 'Val-Cendre', art: 'village', text: `Vous contournez le village par les jardins. Les potagers sont noyés de mauvaises herbes. Des paniers de légumes pourrissent près des portes.

Vous découvrez une trace fraîche menant à l'arrière de la maison du guérisseur. Un malade, les yeux vides, surgit d'un taillis mort.`, enemy: mkEnemy(1, 47, 'Malade en crise', false), blocking: true, choices: [ { label: 'Combattre le malade', combat: true }, { label: 'Fuir vers le guérisseur — test de Dextérité', test: 'dex', dc: 11, success: 51, failCombat: true }, { label: 'L\'immobiliser sans le blesser — test de Force', test: 'force', dc: 12, success: 55, failCombat: true } ] })
  add(48, { title: 'Les marques rouges', zone: 'Val-Cendre', art: 'village', text: `Les marques de quarantaine ne sont pas toutes identiques. Certaines ont été peintes par peur. D'autres forment un alphabet rituel, dissimulé sous les lettres maladroites du mot PESTE.

Val-Cendre n'a pas seulement été contaminé. Il a été préparé.`, choices: [ { label: 'Suivre les marques jusqu\'au puits', effect: { secret: 'Les maisons marquées forment un rituel autour du puits' }, goto: 49 }, { label: 'Chercher qui a peint ces signes', goto: 53 } ] })
  add(49, { title: 'Le puits de Val-Cendre', zone: 'Val-Cendre', art: 'well', text: `Le puits occupe le centre de la place. Sa margelle est couverte de traces d'ongles. Une corde pend dans l'ouverture, mais le seau a disparu.

Lorsque vous vous penchez, une odeur de vase et de fièvre vous remonte au visage.

Quelque chose respire là-dessous.`, choices: [ { label: 'Descendre tout de suite', goto: 76 }, { label: 'Chercher d\'abord le guérisseur', goto: 51 }, { label: 'Aller à la chapelle barricadée', goto: 54 } ] })
  add(50, { title: 'La maison barricadée', zone: 'Val-Cendre', art: 'village', text: `Vous frappez à une porte barricadée.

« Partez ! » répond une voix. « Ceux qui toussent deviennent méchants. Ceux qui boivent au puits oublient leurs enfants. »

Un enfant pleure derrière les planches. Un adulte étouffe une quinte de toux.`, choices: [ { label: 'Convaincre les survivants de vous ouvrir — test d\'Esprit', test: 'esprit', dc: 12, success: 55, fail: 56 }, { label: 'Forcer la porte — test de Force', test: 'force', dc: 13, success: 55, failCombat: true }, { label: 'Promettre de revenir avec un remède', effect: { quest: 'Rassurer les survivants de Val-Cendre' }, goto: 51 } ], enemy: mkEnemy(1, 50, 'Villageois contaminé', false) })
  add(51, { title: 'La maison du guérisseur', zone: 'Val-Cendre', art: 'village', text: `La maison du guérisseur a été fouillée. Les fioles sont brisées, les tiroirs ouverts, les plantes arrachées.

Sur la table, un journal taché d'encre reste lisible. La dernière page porte une phrase soulignée trois fois : la maladie ne vient pas des rats. Elle monte du puits.`, choices: [ { label: 'Lire le journal en entier', effect: { secret: 'La peste vient du puits', quest: 'Préparer le remède de Val-Cendre' }, goto: 57 }, { label: 'Fouiller la cave du guérisseur', goto: 58 }, { label: 'Chercher les ingrédients du remède', goto: 59 } ] })
  add(52, { title: 'La remise du guérisseur', zone: 'Val-Cendre', art: 'village', text: `La serrure cède. Dans la remise, vous trouvez des bandages secs, une ration et un petit couteau de récolte.

Sur le mur, quelqu'un a tracé un plan du village avec trois cercles autour du puits, de la chapelle et de la maison du guérisseur.`, choices: [ { label: 'Prendre ce qui peut servir', effect: { item: 'Ration', item2: 'Armure de cuir', secret: 'Le guérisseur reliait le puits, la chapelle et sa maison' }, goto: 51 } ] })
  add(53, { title: 'La main qui a peint', zone: 'Val-Cendre', art: 'village', text: `Dans une ruelle, vous trouvez un pot de peinture rouge renversé. À côté, des empreintes ne vont pas vers une maison, mais vers la chapelle.

Un mercenaire se retourne brusquement. Il portait lui-même ces marques. Il ne veut pas de témoin.`, enemy: mkEnemy(1, 53, 'Mercenaire du Cercle', false), blocking: true, choices: [ { label: 'Combattre le mercenaire', combat: true }, { label: 'L\'interroger — test d\'Esprit', test: 'esprit', dc: 13, success: 61, failCombat: true } ] })
  add(54, { title: 'La chapelle barricadée', zone: 'Val-Cendre', art: 'chapel', text: `La chapelle de Val-Cendre est bloquée par des bancs, des poutres et des prières.

Le prêtre parle derrière la porte : « Si vous venez du puits, partez. Si vous venez pour mentir, partez aussi. »

Votre marque inconnue devient chaude, sans lumière.`, choices: [ { label: 'Lui parler du journal du guérisseur', goto: 60 }, { label: 'Montrer la marque sans l\'expliquer', goto: 61 }, { label: 'Forcer l\'entrée — test de Force', test: 'force', dc: 14, success: 62, failCombat: true } ], enemy: mkEnemy(1, 54, 'Fidèle contaminé', false) })
  add(55, { title: 'Les survivants ouvrent', zone: 'Val-Cendre', art: 'village', text: `La porte s'entrouvre. Des visages maigres vous observent.

Une femme nommée Mira vous montre son fils. L'enfant respire à peine. Ses veines noires forment un dessin qui semble répondre à votre marque.`, choices: [ { label: 'Examiner l\'enfant — test d\'Esprit', test: 'esprit', dc: 12, success: 63, fail: 64 }, { label: 'Promettre de trouver un remède', effect: { quest: 'Sauver l\'enfant de Mira', reputation: 1 }, goto: 59 }, { label: 'Demander ce qu\'ils savent du puits', effect: { secret: 'Les malades empirent après avoir bu au puits' }, goto: 49 } ] })
  add(56, { title: 'La peur gagne', zone: 'Val-Cendre', art: 'village', text: `Les survivants refusent d'ouvrir. La peur rend leurs voix dures.

« On a déjà laissé entrer un homme en noir. Le lendemain, trois familles toussaient du sang. »`, choices: [ { label: 'Retenir l\'information et partir chez le guérisseur', effect: { secret: 'Un homme en noir est entré avant la peste' }, goto: 51 }, { label: 'Aller à la chapelle', goto: 54 } ] })
  add(57, { title: 'La recette incomplète', zone: 'Val-Cendre', art: 'village', text: `Le journal détaille un remède possible : herbe blanche, eau bénite, cendre de goule.

Le guérisseur n'a pas pu le terminer. Sa dernière note tremble : si je disparais, chercher sous la chapelle.`, choices: [ { label: 'Chercher l\'herbe blanche dans le jardin mort', goto: 65 }, { label: 'Demander l\'eau bénite à la chapelle', goto: 54 }, { label: 'Descendre chercher la source du mal', goto: 76 } ] })
  add(58, { title: 'La cave remue', zone: 'Val-Cendre', art: 'village', text: `La cave sent l'humidité et la fièvre. Quelque chose gratte derrière les étagères.

Un malade enfermé là s'est transformé. Il ne reste dans son regard qu'une faim confuse.`, enemy: mkEnemy(1, 58, 'Zombie malade', false), blocking: true, choices: [ { label: 'Combattre le malade', combat: true }, { label: 'L\'enfermer et remonter — test de Dextérité', test: 'dex', dc: 12, success: 57, failCombat: true } ] })
  add(59, { title: 'Trois ingrédients', zone: 'Val-Cendre', art: 'village', text: `Vous savez ce qu'il faut chercher : une plante qui résiste à la fièvre, une eau qui n'a pas été touchée par le puits, et la cendre d'une créature déjà rongée par la maladie.

Le remède ne sauvera peut-être pas tout Val-Cendre, mais il peut empêcher le village de devenir un cimetière debout.`, choices: [ { label: 'Chercher l\'herbe blanche', goto: 65 }, { label: 'Obtenir l\'eau bénite', goto: 60 }, { label: 'Descendre vers le puits pour affronter la source', goto: 76 } ] })
  add(60, { title: 'La confession du prêtre', zone: 'Val-Cendre', art: 'chapel', text: `Le prêtre finit par parler.

« J'ai vu un homme jeter une pierre noire dans le puits. J'ai voulu sonner l'alarme. Puis il m'a montré des morts qui marchaient derrière lui. J'ai fermé la porte de la chapelle et j'ai prié que quelqu'un d'autre soit courageux à ma place. »`, choices: [ { label: 'Lui demander l\'eau bénite', effect: { item: 'Eau bénite', secret: 'Le prêtre a vu le puits être empoisonné', reputation: 1 }, goto: 59 }, { label: 'Lui reprocher son silence', effect: { reputation: -1, memoire: 1 }, goto: 62 }, { label: 'Lui demander le passage sous la chapelle', goto: 66 } ] })
  add(61, { title: 'La marque et la porte', zone: 'Val-Cendre', art: 'chapel', text: `Vous montrez votre poignet.

Un silence tombe derrière la porte. Puis le prêtre murmure : « Ce signe n'est pas celui du Cercle. Mais je ne sais plus s'il annonce le secours ou un malheur plus ancien. »

La barricade bouge enfin.`, choices: [ { label: 'Entrer sans répondre', effect: { memoire: 1 }, goto: 62 }, { label: 'Demander ce qu\'il reconnaît', effect: { secret: 'La marque inconnue est plus ancienne que le village' }, goto: 66 } ] })
  add(62, { title: 'Dans la chapelle', zone: 'Val-Cendre', art: 'chapel', text: `La chapelle abrite une vingtaine de survivants. Des cierges tremblent autour d'un autel fendu.

Près du chœur, une trappe descend vers une crypte ancienne. Le prêtre refuse de s'en approcher.`, choices: [ { label: 'Prendre l\'eau bénite', effect: { item: 'Eau bénite' }, goto: 59 }, { label: 'Descendre dans la crypte', goto: 66 }, { label: 'Retourner vers le puits', goto: 76 } ] })
  add(63, { title: 'L\'enfant de Mira', zone: 'Val-Cendre', art: 'village', text: `Vous posez deux doigts sur le poignet de l'enfant. La fièvre ne bat pas comme une maladie ordinaire. Elle répond par vagues, comme si quelque chose appelait depuis le puits.

Votre marque chauffe, puis s'apaise. L'enfant respire mieux. Pas longtemps, mais assez pour gagner du temps.`, choices: [ { label: 'Promettre à Mira de terminer le remède', effect: { quest: 'Sauver l\'enfant de Mira', reputation: 2, memoire: 1 }, goto: 59 }, { label: 'Aller directement au puits', goto: 76 } ] })
  add(64, { title: 'Un souffle trop faible', zone: 'Val-Cendre', art: 'village', text: `Vous ne trouvez pas le bon geste. L'enfant gémit, et Mira serre les dents pour ne pas hurler.

« Si vous ne pouvez pas le sauver ici, alors trouvez ce qui le tue. »`, choices: [ { label: 'Jurer de trouver la source', effect: { quest: 'Trouver la source de la peste', reputation: 1 }, goto: 76 }, { label: 'Chercher le remède', goto: 59 } ] })
  add(65, { title: 'L\'herbe blanche', zone: 'Val-Cendre', art: 'village', text: `Dans le jardin mort du guérisseur, tout est noirci sauf une plante pâle qui pousse sous une pierre.

Lorsque vous la cueillez, les racines autour se contractent, comme si le sol ne voulait pas rendre ce qu'il reste de sain.`, choices: [ { label: 'Cueillir la plante rapidement', effect: { item: 'Herbe blanche' }, goto: 59 }, { label: 'Examiner les racines — test d\'Esprit', test: 'esprit', dc: 12, success: 67, fail: 59 } ] })
  add(66, { title: 'Sous la chapelle', zone: 'Val-Cendre', art: 'chapel', text: `La crypte sous la chapelle n'a rien d'un simple caveau. Le Soleil brisé apparaît sur une dalle, à moitié effacé.

Un nom a été martelé jusqu'à devenir illisible. Pourtant, devant cette pierre, votre douleur au crâne revient.`, choices: [ { label: 'Toucher la dalle effacée', effect: { memoire: 2, secret: 'Un nom lié au Soleil brisé a été effacé sous Val-Cendre' }, goto: 68 }, { label: 'Remonter avec l\'eau bénite', goto: 59 } ] })
  add(67, { title: 'La terre contaminée', zone: 'Val-Cendre', art: 'village', text: `Les racines portent de minuscules veines noires. La plante blanche a survécu parce qu'elle poussait sur une pierre marquée du même symbole que votre médaillon.

Le village cache des traces plus anciennes que la peste.`, choices: [ { label: 'Prendre la pierre marquée', effect: { item: 'Pierre du Soleil brisé', secret: 'Val-Cendre a été bâti sur un ancien lieu des Veilleurs', memoire: 1 }, goto: 59 } ] })
  add(68, { title: 'Une image sous la pierre', zone: 'Val-Cendre', art: 'chapel', text: `Une image vous traverse : vous êtes à genoux dans cette même crypte. Quelqu'un vous demande de cacher ce que vous savez. Vous refusez. Puis vous acceptez.

Vous revenez à vous avec le goût du sang dans la bouche.`, choices: [ { label: 'Remonter vers le puits', effect: { memoire: 2, corruption: 1 }, goto: 76 }, { label: 'Chercher une issue secrète', test: 'dex', dc: 12, success: 69, fail: 76 } ] })
  add(69, { title: 'Le passage du guérisseur', zone: 'Val-Cendre', art: 'chapel', text: `Derrière une pierre descellée, un tunnel étroit rejoint la base du puits. Le guérisseur l'avait découvert avant de disparaître.

Ce chemin évite la corde et les regards, mais pas ce qui attend en dessous.`, choices: [ { label: 'Entrer par le passage secret', effect: { secret: 'Le guérisseur avait trouvé un accès caché au puits' }, goto: 76 } ] })

  // Acte IV — Puits Maudit
  add(76, { title: 'Descendre dans le puits', zone: 'Le Puits Maudit', art: 'well', text: `La descente commence dans une odeur de corde mouillée et de pierre froide.

Plus bas, les bruits du village disparaissent. Il ne reste que l'eau qui goutte, votre respiration, et des murmures que vous n'êtes pas certain d'entendre avec vos oreilles.`, choices: [ { label: 'Continuer jusqu\'au fond', goto: 77 }, { label: 'Utiliser Lueur pâle pour éclairer', effect: { mana: -4, memoire: 1 }, goto: 78 }, { label: 'Remonter chercher des survivants avant de descendre', goto: 87 } ] })
  add(70, { title: 'Demander de l\'aide', zone: 'Val-Cendre', art: 'village', text: `Vous rassemblez ceux qui peuvent encore tenir debout. Les survivants ont peur du puits, mais certains acceptent de tenir la corde, de garder la place ou de prier à la chapelle.

Ce soutien ne gagnera pas le combat à votre place. Il peut seulement vous empêcher d'être seul.`, choices: [ { label: 'Redescendre avec leur aide', effect: { reputation: 1, flag: 'aide_val_cendre' }, goto: 76 } ] })
  add(77, { title: 'L\'eau malade', zone: 'Le Puits Maudit', art: 'well', text: `Vos bottes touchent une eau noire et froide. Elle monte à mi-mollet, puis se retire d'elle-même comme si elle avait senti votre présence.

Des racines percent les murs du tunnel. Elles convergent toutes vers une lueur sombre.`, choices: [ { label: 'Avancer dans l\'eau — test de Chance', test: 'chance', dc: 12, success: 79, fail: 80 }, { label: 'Couper les racines au passage', test: 'force', dc: 13, success: 79, failCombat: true } ], enemy: mkEnemy(1, 77, 'Noyé pestiféré', false) })
  add(78, { title: 'La lumière pâle', zone: 'Le Puits Maudit', art: 'well', text: `Votre sort n'éclaire pas vraiment : il révèle. Les pierres portent des traces de doigts. Les racines ne sont pas des plantes, mais des veines de quelque chose enterré sous le village.

Au bout du tunnel, une forme noire bat comme un cœur.`, choices: [ { label: 'Approcher du cœur noir', effect: { secret: 'Le puits contient un fragment vivant de la faille' }, goto: 81 } ] })
  add(79, { title: 'Les noyés', zone: 'Le Puits Maudit', art: 'well', text: `Des corps flottent sous la surface. Lorsque vous passez, ils ouvrent les yeux.

Ils ne veulent pas vous tuer par haine. Ils veulent vous entraîner là où leurs voix sont restées prisonnières.`, choices: [ { label: 'Les repousser et courir', goto: 81 }, { label: 'Les affronter', combat: true }, { label: 'Utiliser l\'eau bénite si vous l\'avez', effect: { corruption: -1, memoire: 1 }, goto: 81 } ], enemy: mkEnemy(1, 79, 'Noyés pestiférés', false), blocking: true })
  add(80, { title: 'La fièvre noire', zone: 'Le Puits Maudit', art: 'well', text: `L'eau s'infiltre sous vos vêtements. Une chaleur mauvaise remonte dans votre sang.

Pendant quelques secondes, vous oubliez pourquoi vous êtes descendu. Puis votre marque brûle et vous ramène à vous.`, choices: [ { label: 'Continuer malgré la fièvre', effect: { pv: -5, corruption: 1 }, goto: 81 }, { label: 'Boire une potion ou manger une ration si possible', effect: { pv: 4 }, goto: 81 } ] })
  add(81, { title: 'L\'autel sous le puits', zone: 'Le Puits Maudit', art: 'well', text: `Le tunnel s'élargit sous la place du village. Au centre, un fragment noir est planté dans un autel ancien.

Autour, l'eau forme des cercles réguliers, comme si le puits récitait un rituel.`, choices: [ { label: 'Arracher le fragment — test de Force', test: 'force', dc: 14, success: 82, failCombat: true }, { label: 'Le purifier avec Lueur pâle', effect: { mana: -5, corruption: -1 }, goto: 83 }, { label: 'Le garder pour vous', effect: { item: 'Fragment du puits', corruption: 4, spell: 'Flamme spectrale' }, goto: 84 } ], enemy: mkEnemy(1, 81, 'Esprit pestiféré', true), blocking: true })
  add(82, { title: 'Le fragment cède', zone: 'Le Puits Maudit', art: 'well', text: `Le fragment se détache dans un bruit de racine arrachée. Aussitôt, une forme se lève de l'eau : visage d'enfant, bras de noyé, ombre de démon.

Ce n'est pas la peste. C'est ce qui la chante.`, choices: [ { label: 'Affronter l\'esprit pestiféré', combat: true } ], enemy: mkEnemy(1, 82, 'Esprit pestiféré du puits', true), blocking: true })
  add(83, { title: 'La source purifiée', zone: 'Le Puits Maudit', art: 'well', text: `La lumière pâle traverse l'eau. Les racines noires se crispent, puis se changent en cendre.

Une plainte immense remonte du puits. Lorsque le silence revient, l'air semble respirable pour la première fois.`, choices: [ { label: 'Remonter vers Val-Cendre avec l\'eau purifiée', effect: { done: 'Purifier le puits de Val-Cendre', reputation: 3, memoire: 2, corruption: -2 }, goto: 85 } ] })
  add(84, { title: 'Le choix sombre', zone: 'Le Puits Maudit', art: 'well', text: `Vous arrachez le fragment et le gardez. Le puits se calme, mais pas parce qu'il est guéri. Parce qu'une partie de son mal vous suit désormais.

Au-dessus, Val-Cendre respirera peut-être. Vous, moins.`, choices: [ { label: 'Remonter avec le fragment', effect: { done: 'Prendre le fragment du puits', corruption: 3, memoire: 1 }, goto: 86 } ] })
  add(85, { title: 'Val-Cendre respire', zone: 'Val-Cendre', art: 'village', text: `Lorsque vous remontez, les survivants sentent le changement avant même de comprendre. Le puits ne murmure plus.

Mira serre son enfant contre elle. Le remède peut maintenant agir.`, choices: [ { label: 'Préparer le remède si vous avez les ingrédients', effect: { done: 'Sauver Val-Cendre', reputation: 3, item: 'Amulette de Mira' }, goto: 96 }, { label: 'Partir avant les remerciements', effect: { reputation: 1 }, goto: 96 } ] })
  add(86, { title: 'Le village sauvé à moitié', zone: 'Val-Cendre', art: 'village', text: `Le puits s'est calmé, mais une ombre demeure dans votre sac ou votre chair. Les villageois ne savent pas ce que vous avez pris.

Certains survivront. D'autres rêveront encore d'eau noire.`, choices: [ { label: 'Quitter Val-Cendre avant qu\'on pose trop de questions', effect: { done: 'Calmer le puits sans le purifier', reputation: 1 }, goto: 96 } ] })

  // Acte V — Cimetière des soldats
  add(96, { title: 'La route des croix', zone: 'Cimetière des Soldats', art: 'cemetery', text: `Vous quittez Val-Cendre par une route bordée de croix récentes.

Certaines portent des noms. D'autres seulement des peuples : humain, nain, orque, gobelin. Comme si même les morts avaient été classés pour servir un dernier ordre.`, choices: [ { label: 'Approcher de la grille du cimetière', goto: 97 }, { label: 'Lire les noms sur les croix', goto: 98 } ] })
  add(97, { title: 'Le portail rouillé', zone: 'Cimetière des Soldats', art: 'cemetery', text: `La grille du cimetière grince sous votre main.

Derrière, les tombes sont ouvertes. Pas toutes. Seulement celles des soldats tombés le jour de votre réveil.`, choices: [ { label: 'Entrer par l\'allée principale', goto: 99 }, { label: 'Contourner par le mur effondré — test de Dextérité', test: 'dex', dc: 12, success: 100, failCombat: true } ], enemy: mkEnemy(1, 97, 'Squelette de garde', false) })
  add(98, { title: 'Le nom rayé', zone: 'Cimetière des Soldats', art: 'cemetery', text: `Un nom revient sur plusieurs morceaux de registre cloués aux croix : Kaël.

Mais chaque fois, le reste a été gratté ou brûlé. Quelqu'un ne voulait pas que ce mort soit retrouvé. Ou que ce vivant se souvienne.`, choices: [ { label: 'Garder ce nom en tête', effect: { memoire: 2, secret: 'Le nom Kaël a été volontairement effacé' }, goto: 99 } ] })
  add(99, { title: 'Les tombes ouvertes', zone: 'Cimetière des Soldats', art: 'cemetery', text: `La terre a été retournée récemment. Des traces d'os traînent vers une crypte noire au fond du cimetière.

Un soldat mort, encore en armure, se tient devant vous. Contrairement aux autres, il parle.`, choices: [ { label: 'Lui parler', goto: 101 }, { label: 'Le combattre', combat: true }, { label: 'Passer sans le provoquer — test d\'Esprit', test: 'esprit', dc: 12, success: 102, failCombat: true } ], enemy: mkEnemy(1, 99, 'Capitaine mort-vivant', true), blocking: true })
  add(100, { title: 'Le mur effondré', zone: 'Cimetière des Soldats', art: 'cemetery', text: `Vous passez par le mur effondré et évitez la première allée. En contrebas, vous découvrez une fosse où les corps ont été déplacés après l'enterrement.

Ce n'est pas du pillage. C'est une récolte.`, choices: [ { label: 'Descendre dans la fosse', goto: 103 }, { label: 'Rejoindre la crypte noire', goto: 104 } ] })
  add(101, { title: 'Le capitaine qui se souvient', zone: 'Cimetière des Soldats', art: 'cemetery', text: `Le capitaine mort-vivant incline son casque brisé.

« On nous a ordonné de charger nos alliés. Puis de tenir contre ceux qui fuyaient. Puis de brûler les blessés. Trois ordres. Trois sceaux. Trois mensonges. »

Sa voix se fend.

« Trouve qui a parlé avec nos bouches. »`, choices: [ { label: 'Lui promettre de chercher la vérité', effect: { quest: 'Découvrir les faux ordres de la bataille', secret: 'Les armées ont reçu de faux ordres', memoire: 2 }, goto: 104 }, { label: 'Lui demander de vous laisser passer', goto: 102 } ] })
  add(102, { title: 'Le passage accordé', zone: 'Cimetière des Soldats', art: 'cemetery', text: `Le capitaine s'écarte lentement.

« Si tu mens, je le saurai quand tu reviendras parmi nous. »

Derrière lui, la crypte noire vous attend.`, choices: [ { label: 'Entrer dans la crypte noire', goto: 104 } ] })
  add(103, { title: 'La fosse commune', zone: 'Cimetière des Soldats', art: 'cemetery', text: `La fosse contient des traces de chaînes et de craie rituelle. Les corps n'ont pas été volés pour être cachés. Ils ont été emmenés pour être utilisés.

Une main osseuse jaillit de la terre. Puis une autre.`, choices: [ { label: 'Repousser les mains mortes', combat: true }, { label: 'Fuir vers la crypte — test de Dextérité', test: 'dex', dc: 13, success: 104, failCombat: true } ], enemy: mkEnemy(1, 103, 'Mains mortes', false), blocking: true })
  add(104, { title: 'La crypte noire', zone: 'Cimetière des Soldats', art: 'cemetery', text: `La crypte sent la cire, le fer froid et la chair ancienne.

Des survivants sont attachés à des piliers. Leurs yeux ne sont pas morts, mais ils ne sont plus entièrement vivants. Un livre ouvert repose sur un pupitre d'os.`, choices: [ { label: 'Libérer les prisonniers', goto: 105 }, { label: 'Lire le livre de chair', goto: 106 }, { label: 'Chercher le nécromancien', goto: 107 } ] })
  add(105, { title: 'Les prisonniers de la crypte', zone: 'Cimetière des Soldats', art: 'cemetery', text: `Vous coupez les liens. Les prisonniers s'effondrent, mais certains peuvent encore marcher.

L'un d'eux vous glisse une clef d'os dans la main.

« Il garde les noms derrière l'autel », murmure-t-il.`, choices: [ { label: 'Prendre la clef d\'os', effect: { item: 'Clef d\'os', item2: 'Bouclier de fer', done: 'Sauver les prisonniers du cimetière', reputation: 2 }, goto: 107 } ] })
  add(106, { title: 'Le livre de chair', zone: 'Cimetière des Soldats', art: 'cemetery', text: `Les pages ne sont pas de papier. Elles gardent la chaleur des vivants.

Vous pourriez apprendre à parler aux morts, peut-être même à leur arracher un souvenir. Mais chaque ligne semble vous lire en retour.`, choices: [ { label: 'Brûler le livre', effect: { corruption: -1, memoire: 1, secret: 'La nécromancie et la peste utilisent la même source' }, goto: 107 }, { label: 'Garder le livre', effect: { item: 'Livre de chair', spell: 'Flamme spectrale', corruption: 3 }, goto: 107 } ] })
  add(107, { title: 'Le nécromancien', zone: 'Cimetière des Soldats', art: 'cemetery', text: `Le nécromancien vous attend au centre de la crypte. Il n'a pas l'air surpris.

« Kaël... tu as oublié jusqu'à tes ennemis. C'est presque une miséricorde. »

Il referme sa main, et les morts autour de lui se redressent.`, enemy: mkEnemy(1, 107, 'Nécromancien du cimetière', true), blocking: true, choices: [ { label: 'Combattre le nécromancien', combat: true }, { label: 'Le forcer à parler — test d\'Esprit', test: 'esprit', dc: 15, success: 108, failCombat: true }, { label: 'Utiliser la clef d\'os si vous l\'avez', requiresItem: 'Clef d\'os', goto: 109 } ] })
  add(108, { title: 'Ce qu\'il sait', zone: 'Cimetière des Soldats', art: 'cemetery', text: `Le nécromancien recule, troublé par votre résistance.

« Le champ de bataille n'était qu'un début. Six royaumes. Six sceaux. Assez de haine pour que la porte s'ouvre d'elle-même. »

Il crache un nom : Azhraël.`, choices: [ { label: 'L\'affronter avec cette vérité', effect: { secret: 'Azhraël veut utiliser les six sceaux des royaumes', memoire: 2 }, combat: true } ], enemy: mkEnemy(1, 108, 'Nécromancien affaibli', true), blocking: true })
  add(109, { title: 'Les noms derrière l\'autel', zone: 'Cimetière des Soldats', art: 'cemetery', text: `La clef d'os ouvre une dalle derrière l'autel. Vous y trouvez un registre caché.

Votre nom y est écrit, puis barré. À côté : ne pas laisser le Cercle trouver le corps.

La crypte tremble. Le nécromancien comprend que vous avez trouvé ce qu'il gardait.`, choices: [ { label: 'Affronter le gardien du registre', effect: { secret: 'Le Cercle cherchait votre corps après la bataille', memoire: 3 }, combat: true } ], enemy: mkEnemy(1, 109, 'Nécromancien furieux', true), blocking: true })
  add(110, { title: 'La crypte s\'effondre', zone: 'Cimetière des Soldats', art: 'cemetery', text: `La mort du nécromancien brise le contrôle qu'il exerçait sur la crypte. Les os retombent. Les chaînes se desserrent.

Dans le silence, un souvenir vous revient : vous couriez vers une forêt en flammes, poursuivi par des hommes en noir. Quelque chose vous attendait là-bas.`, choices: [ { label: 'Ramasser l\'épée bénite parmi les os et partir', effect: { item: 'Épée de l\'aurore', done: 'Vaincre le nécromancien', memoire: 3, xp: 8, or: 12 }, goto: 121 } ] })

  // Nodes 111-120 are optional cemetery detours with forward-only routes, not loops
  add(111, { title: 'Le caveau des officiers', zone: 'Cimetière des Soldats', art: 'cemetery', text: `Un caveau secondaire contient des insignes d'officiers arrachés. Certains appartiennent à Aldéris, d'autres aux nains, aux orques, aux barbares.

Quelqu'un a voulu que tous les peuples accusent tous les autres.`, choices: [ { label: 'Prendre les insignes comme preuves', effect: { item: 'Insignes contradictoires', secret: 'Les preuves de trahison ont été fabriquées' }, goto: 112 } ] })
  add(112, { title: 'Le témoin spectral', zone: 'Cimetière des Soldats', art: 'cemetery', text: `Un spectre se détache d'une tombe. Il porte encore le manteau d'un messager.

« Je n'ai pas livré l'ordre », murmure-t-il. « On portait mon visage. »`, choices: [ { label: 'L\'écouter jusqu\'au bout', effect: { memoire: 1, secret: 'Des imposteurs ont transmis les ordres' }, goto: 113 }, { label: 'Le dissiper avec Lueur pâle', effect: { mana: -4, corruption: -1 }, goto: 113 } ] })
  add(113, { title: 'La sortie condamnée', zone: 'Cimetière des Soldats', art: 'cemetery', text: `La grille par laquelle vous êtes entré s'est refermée. Une autre sortie mène vers une route de cendres.

La forêt brûlée n'est donc pas un détour. C'est la seule piste encore chaude.`, choices: [ { label: 'Suivre la route de cendres', goto: 121 } ] })
  add(114, { title: 'Un mort reconnaissant', zone: 'Cimetière des Soldats', art: 'cemetery', text: `Un ancien soldat, libéré du contrôle du nécromancien, incline la tête.

« Quand tu verras les arbres noirs, ne coupe pas le premier qui parle. Il souffre plus qu'il ne ment. »`, choices: [ { label: 'Retenir l\'avertissement', effect: { secret: 'L\'ent de la forêt peut être apaisé', memoire: 1 }, goto: 121 } ] })
  add(115, { title: 'La dernière tombe ouverte', zone: 'Cimetière des Soldats', art: 'cemetery', text: `Une tombe ouverte porte votre médaillon gravé dans la pierre. Elle est vide.

Vous comprenez que quelqu'un avait préparé une sépulture pour vous. Ou une preuve de votre mort.`, choices: [ { label: 'Descendre dans la tombe vide', effect: { memoire: 2 }, goto: 116 }, { label: 'Ne pas perdre de temps', goto: 121 } ] })
  add(116, { title: 'La tombe de Kaël', zone: 'Cimetière des Soldats', art: 'cemetery', text: `Au fond, vous trouvez un morceau d'armure marqué du Soleil brisé. Il a été brisé net, comme si on avait voulu faire croire que son porteur était mort.

Mais le corps n'a jamais été là.`, choices: [ { label: 'Emporter le morceau d\'armure', effect: { item: 'Morceau d\'armure du Soleil brisé', secret: 'La mort de Kaël a été mise en scène' }, goto: 121 } ] })
  add(117, { title: 'Les corbeaux du cimetière', zone: 'Cimetière des Soldats', art: 'cemetery', text: `Les corbeaux vous suivent d'une tombe à l'autre. L'un d'eux laisse tomber une bague dans la boue.

Elle porte le même signe que la cape de l'adepte noir.`, choices: [ { label: 'Prendre la bague', effect: { item: 'Bague du Cercle de Cendre', corruption: 1 }, goto: 121 }, { label: 'L\'écraser sous votre botte', effect: { corruption: -1 }, goto: 121 } ] })
  add(118, { title: 'Le repos des morts', zone: 'Cimetière des Soldats', art: 'cemetery', text: `Après la chute du nécromancien, certains morts retrouvent enfin l'immobilité. Le silence qui suit n'est pas paisible, mais il est moins cruel.

Vous pouvez respirer avant de poursuivre.`, choices: [ { label: 'Vous reposer près de la grille', effect: { pv: 10, mana: 5 }, goto: 121 }, { label: 'Partir immédiatement', goto: 121 } ] })
  add(119, { title: 'Le chemin des cendres', zone: 'Cimetière des Soldats', art: 'cemetery', text: `La route vers la forêt est couverte d'une poussière noire. Elle ne vient pas d'un incendie récent.

Elle vient de quelque chose qui brûle encore sous la terre.`, choices: [ { label: 'Continuer vers les arbres brûlés', goto: 121 } ] })
  add(120, { title: 'La promesse aux morts', zone: 'Cimetière des Soldats', art: 'cemetery', text: `Vous quittez le cimetière avec plus de noms que de réponses.

Derrière vous, les tombes restent ouvertes. Devant vous, la forêt brûlée attend. Si les morts disent vrai, elle garde la suite de votre mémoire.`, choices: [ { label: 'Entrer dans la forêt brûlée', goto: 121 } ] })

  add(87, { title: 'Appel aux survivants', zone: 'Val-Cendre', art: 'village',
    text: `Vous remontez la corde. Les survivants de Val-Cendre vous attendent dans la lumière grise.

Mira vous tend une torche. L'ancien milicien vérifie vos nœuds. Le prêtre murmure une prière courte.

Ce soutien ne descendra pas avec vous. Mais il change quelque chose dans votre façon de tenir la corde.`,
    choices: [
      { label: 'Redescendre avec leur soutien', effect: { reputation: 1, pv: 4, flag: 'aide_val_cendre' }, goto: 76 }
    ]
  })

  return n
})()

const CLASSES = {
  veilleur: {
    nom: 'Survivant amnésique',
    desc: 'Équilibré, avec une marque étrange dont l\'origine reste inconnue. Bon choix pour une première partie.',
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
  'Bouclier d\'éther': { cout: 6, type: 'shield', desc: 'Réduit la prochaine attaque.' },
}

const BOOKS = {
  1: {
    title: 'Livre I — Le Réveil des Cendres',
    subtitle: 'Se réveiller sans mémoire, survivre au champ de bataille et comprendre les premières traces du complot.',
    code: 'CENDRES-I',
    zones: [
      { start: 1, end: 35, name: 'Le Champ des Morts', art: 'battlefield', theme: 'cadavres, pillards, goules, premiers souvenirs' },
      { start: 36, end: 75, name: 'Val-Cendre', art: 'village', theme: 'village pestiféré, survivants, enquête' },
      { start: 76, end: 95, name: 'Le Puits Maudit', art: 'well', theme: 'source de la peste, esprits, racines noires' },
      { start: 96, end: 120, name: 'Le Cimetière des Soldats', art: 'cemetery', theme: 'squelettes, nécromancien, registre des morts' },
      { start: 121, end: 165, name: 'La Forêt Brûlée', art: 'forest', theme: 'braconniers, esprits de la forêt, ent corrompu' },
      { start: 166, end: 210, name: 'Le Manoir de Brumeval', art: 'manor', theme: 'vampires, assassins, fragments de mémoire' },
      { start: 211, end: 250, name: 'La Chapelle en Ruine', art: 'chapel', theme: 'relique ancienne, Guilde Noire, choix de confiance' },
      { start: 251, end: 300, name: 'La Première Faille', art: 'rift', theme: 'portail démoniaque, Azhraël, final du livre I' },
    ],
    bosses: { 38: 'Marn le Crochu', 82: 'Esprit pestiféré du puits', 107: 'Nécromancien du cimetière', 155: 'Ent corrompu', 200: 'Sire Vael Draven', 235: 'Adepte majeur du Cercle', 285: 'Démon mineur de la faille' },
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
    bosses: { 40: 'Roi possédé', 80: 'Golem de forge', 120: 'Ent malade', 165: 'Vampire ancien', 210: 'Champion orque corrompu', 250: 'Momie royale', 285: 'Dragon des ruines', 300: 'Héraut d\'Azhraël' },
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
      { start: 276, end: 300, name: 'Le Trône d\'Azhraël', art: 'rift', theme: 'combat final, sacrifice, vraie fin' },
    ],
    bosses: { 35: 'Général spectral', 75: 'Roi des goules', 115: 'Kraken de cendre', 155: 'Gardien momifié', 205: 'Dragon corrompu', 245: 'Avatar d\'Azhraël', 285: 'Ancien compagnon possédé', 300: 'Azhraël, Dévoreur de Voiles' },
  },
}

const QUEST_TITLES = [
  'Sauver les survivants', 'Récupérer un fragment de mémoire', 'Briser un rituel noir', 'Trouver une relique cachée',
  'Négocier avec une guilde', 'Libérer un prisonnier', 'Purifier une source maudite', 'Découvrir un faux ordre de guerre',
  'Forger une arme contre les démons', 'Épargner ou exécuter un ennemi', 'Retrouver une carte secrète', 'Protéger un enfant malade',
  'Démasquer un traître', 'Fermer une brèche du Voile', 'Obtenir l\'aide d\'un peuple ennemi', 'Résister à un pacte noir',
]

const SECRET_TITLES = [
  'La bataille était un rituel', 'Les six sceaux protègent le Voile', 'Azhraël cherche le vrai nom du héros',
  'La Guilde Noire manipule plusieurs royaumes', 'Les orques ont été accusés à tort', 'Un vampire connaît le passé de Kaël',
  'Les puissances anciennes ne disent pas toute la vérité', 'Un allié peut être possédé', 'Le Soleil brisé est l\'emblème des Veilleurs',
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
    classKey, nom: c.nom, rolls, force, dex, chance, chanceMax: chance, esprit, pv: pvMax, pvMax, mana: manaMax, manaMax, magicDotPerTurn: 0,
    xp: 0, or: 0, memoire: 0, corruption: 0, reputation: 0, niveau: 1,
    items: [...c.objets], spells: [...c.sorts], allies: [], quests: [], done: [], secrets: [], flags: {}, endings: [], visited: [],
  }
}

function generatedPassage(bookId, id, hero) {
  const book = BOOKS[bookId]
  if (bookId === 1 && MANUAL_BOOK1[id]) return MANUAL_BOOK1[id]
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
      text: `Vous ouvrez les yeux dans le noir. Quelque chose pèse sur votre poitrine. Une main morte recouvre votre visage. L'odeur du sang, de la boue et de la chair brûlée vous soulève le cœur.\n\nVous êtes allongé sous un tas de cadavres. Des humains. Des orques. Des nains. Des gobelins. Des soldats dont les armures sont fendues. Des bannières déchirées flottent dans la pluie.\n\nVous essayez de vous souvenir de votre nom. Rien. Seulement une douleur vive à l'arrière du crâne. Puis une voix lointaine résonne : « Relève-toi. Pas ici. Pas encore. »\n\nAutour de votre poignet, une marque pâle commence à brûler.`,
      choices: [
        { label: 'Ramper hors du tas de cadavres', goto: 2 },
        { label: 'Rester immobile et écouter les pillards', test: 'chance', dc: 10, success: 3, failCombat: true },
        { label: 'Fouiller les corps autour de vous', effect: { item: 'Médaillon du Soleil brisé', or: 3, memoire: 1, secret: 'Le Soleil brisé marque les Veilleurs du Voile' }, goto: 4 },
        { label: 'Appeler à l\'aide', combat: true },
      ],
      enemy: mkEnemy(bookId, id, 'Cadavre animé', false),
    }
  }

  if (id === 1) {
    return {
      title: bookId === 2 ? 'Les royaumes brûlent' : 'La dernière guerre du Voile', zone: zone.name, art: zone.art,
      text: bookId === 2
        ? `Vous quittez les ruines de Val-Cendre avec les premières réponses et trop de nouvelles questions. Devant vous, les six royaumes s'accusent, s'arment et saignent. Chaque souverain possède un sceau. Azhraël n'a pas besoin de les voler : il lui suffit que les royaumes se détruisent entre eux.`
        : `Le portail s'ouvre enfin. Les choix des deux premiers livres vous suivent comme des ombres : alliés, dettes, corruptions, serments et morts abandonnés. Face à Azhraël, il ne suffira plus de survivre. Il faudra décider ce qui mérite d'être sauvé.`,
      choices: [{ label: 'Commencer ce livre', goto: 2 }],
    }
  }

  if (id === 300) {
    const ending = bookId === 1 ? 'FIN-I' : bookId === 2 ? 'FIN-II' : 'FIN-TRILOGIE'
    return {
      title: boss || 'Fin du livre', zone: zone.name, art: zone.art,
      text: bookId === 3
        ? `Le trône d'Azhraël se fissure sous vos pieds. Le Dévoreur de Voiles prononce enfin votre nom, mais il arrive trop tard : vous avez retrouvé assez de mémoire pour choisir qui vous êtes. Selon votre corruption, vos alliés et les secrets découverts, Astréa connaîtra la victoire du Voile, le sacrifice, le règne des cendres ou la vraie fin.`
        : `Le dernier obstacle de ce livre vous attend. Derrière lui, une seule certitude demeure : Astréa n'est pas sauvée, elle vient seulement de survivre à une première nuit. Vos choix composeront désormais un code de sauvegarde pour la suite.`,
      final: true, ending,
      enemy: mkEnemy(bookId, id, boss || 'Gardien final', true),
    }
  }

  if (boss) {
    const text = `${zoneData.bossIntro || 'La route se referme devant vous.'}\n\n${boss} apparaît. ${danger}. Sa présence n'est pas une rencontre de hasard : tout ce que vous avez fait dans ${zone.name} vous mène à cet affrontement.\n\nImpossible de continuer sans résoudre ce passage. Il faut combattre, utiliser vos ressources et assumer les choix qui vous ont conduit ici.`
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
    const text = `${zoneData.exit || 'Vous atteignez enfin la limite de cette zone.'}\n\nDerrière vous, ${zone.name} garde ses morts, ses secrets et les conséquences de vos choix. Devant vous, ${nextZone ? nextZone.name : 'la conclusion du livre'} vous attend. Vous sentez que l'aventure avance d'un cran : ce n'est pas un détour, mais la suite logique de votre route.`
    return {
      title: `Quitter ${zone.name}`,
      zone: zone.name,
      art: zone.art,
      text,
      choices: [{ label: nextZone ? `Continuer vers ${nextZone.name}` : 'Aller vers la conclusion', goto: next }],
    }
  }

  const isCombat = local % 5 === 0 || local % 9 === 0
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
        { label: 'Tenter de distraire ou parlementer — test d\'Esprit', test: 'esprit', dc: dc + 2, success: alt, failCombat: true },
        { label: 'Tenter un coup de Chance', test: 'chance', dc: dc + 2, success: next, failCombat: true },
      ],
    }
  }

  if (isQuest) {
    const text = `${scene}\n\n${npc} vous entraîne vers une affaire qui ne peut pas être ignorée : ${quest}. Ce n'est pas une parenthèse gratuite. Cette quête éclaire ce qui se passe dans ${zone.name} et peut modifier vos alliés, votre réputation ou votre corruption.`
    return {
      title: `Quête — ${quest}`,
      zone: zone.name,
      art: zone.art,
      text,
      choices: [
        { label: 'Accepter la quête et aider', effect: { quest, reputation: 1 }, goto: next },
        { label: 'Chercher une solution rapide — test d\'Esprit', test: 'esprit', dc, success: alt, fail: next, effect: { memoire: 1 } },
        { label: 'Refuser et continuer la route', effect: { reputation: -1, corruption: 1 }, goto: next },
      ],
    }
  }

  if (isSecret) {
    const text = `${scene}\n\n${object} attire votre attention. Ce détail semble presque insignifiant, pourtant il relie ${zone.name} à un mystère plus vaste : ${secret}. Si vous prenez le temps d'enquêter, la progression sera plus lente, mais plus cohérente avec votre quête de mémoire.`
    return {
      title: 'Un indice sous la cendre',
      zone: zone.name,
      art: zone.art,
      text,
      choices: [
        { label: 'Examiner l\'indice — test d\'Esprit', test: 'esprit', dc, success: alt, fail: next, effect: { secret, memoire: 1 } },
        { label: 'Le conserver sans perdre de temps', effect: { item: object, memoire: 1 }, goto: next },
        { label: 'Le détruire par prudence', effect: { corruption: -1 }, goto: next },
      ],
    }
  }

  if (isRest) {
    const text = `${scene}\n\nVous trouvez un court répit. ${detail}. Ce repos ne vous éloigne pas de l'objectif : il marque une pause logique avant la prochaine menace.`
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
      { label: zoneData.investigate || 'Examiner les lieux avant d\'avancer', test: 'esprit', dc, success: alt, fail: next, effect: { memoire: 1 } },
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
    npcs: ['Un survivant tremblant vous observe', 'Une silhouette hésite à se montrer', 'Une voix lointaine appelle à l\'aide'],
    objects: ['un éclat de métal gravé', 'une page tachée de boue', 'une pierre froide marquée d\'un cercle'],
    secrets: ['Azhraël étend son influence au-delà de cette zone', 'les faux ordres de guerre ont été transmis par le Cercle de Cendre', 'la marque inconnue réagit aux lieux blessés par le Voile'],
    quests: ['secourir un survivant', 'retrouver une preuve cachée', 'briser un petit rituel noir'],
    enemies: ['Pillard', 'Squelette', 'Goule', 'Possédé', 'Mercenaire'],
    forward: 'Continuer prudemment', investigate: 'Chercher un indice cohérent', risk: 'Tenter un passage dangereux',
  }

  const livre1 = [
    {
      titles: ['La boue et le sang', 'La bannière tombée', 'Les voix des charognards', 'Un survivant sous les morts', 'Le cercle dans la pluie'],
      scenes: ['Vous vous extirpez peu à peu du charnier. La pluie colle les cheveux à votre front et transforme la terre en boue rouge.', 'Entre les corps, des bannières déchirées claquent encore dans le vent, comme si la bataille refusait de se taire.', 'Vous rampez entre des boucliers fendus et des lances brisées. Chaque cadavre pourrait cacher un indice ou un danger.'],
      details: ['Une odeur de fer, de cendre et de chair brûlée vous prend à la gorge', 'Un corbeau se pose sur un casque ouvert et vous fixe comme s\'il vous reconnaissait', 'Une empreinte fraîche traverse la boue entre les morts'],
      dangers: ['les pillards fouillent déjà les corps autour de vous', 'quelque chose bouge sous les cadavres', 'une silhouette encapuchonnée inspecte les survivants'],
      npcs: ['Un soldat agonisant murmure un nom que vous avez presque reconnu', 'Une éclaireuse blessée vous observe depuis un chariot renversé', 'Un nain mourant serre contre lui une boîte scellée'],
      objects: ['un médaillon du Soleil brisé', 'une lettre adressée à Kaël', 'une chevalière couverte de sang'],
      secrets: ['la bataille était un rituel de masse', 'quelqu\'un recherche le porteur de la marque', 'les six peuples ont été sacrifiés pour fissurer le Voile'],
      quests: ['sauver l\'éclaireuse Élyane', 'protéger la boîte du nain Borik', 'échapper au camp des pillards'],
      enemies: ['Cadavre animé', 'Pillard de champ de bataille', 'Goule fraîche', 'Adepte de la Guilde Noire'],
      forward: 'Ramper vers la sortie du champ de bataille', investigate: 'Fouiller les morts avec prudence', risk: 'Traverser à découvert entre les pillards',
      exit: 'Le champ des morts s\'éloigne derrière vous. Au bout de la route, un clocher fume au-dessus de Val-Cendre.',
      bossIntro: 'Les cadavres autour de vous se redressent comme si une seule volonté les commandait.',
    },
    {
      titles: ['Les portes closes', 'La place sans voix', 'Derrière les volets', 'La maison barricadée', 'La cloche de Val-Cendre'],
      scenes: ['Val-Cendre vous accueille par des volets fermés et une cloche qui sonne seule.', 'La place du village semble vide, mais chaque maison retient son souffle.', 'Une charrette renversée bloque la rue principale ; sur ses planches, quelqu\'un a gravé un signe de quarantaine.'],
      details: ['Des traces de pas mènent toutes vers le puits central', 'Une femme malade serre un enfant contre elle derrière une porte entrouverte', 'La suie sur les murs montre que les villageois ont brûlé leurs morts trop vite'],
      dangers: ['la peste n\'est pas naturelle', 'certains malades grattent les portes de l\'intérieur', 'un symbole de la Guilde Noire a été dissimulé sous les marques de quarantaine'],
      npcs: ['Mira, une mère épuisée, vous supplie d\'aider son fils', 'Un ancien milicien vous accuse d\'apporter la malédiction avec vous', 'Le prêtre refuse d\'ouvrir la chapelle tant que la marque n\'a pas parlé'],
      objects: ['le journal du guérisseur', 'une fiole de remède inachevé', 'une clef rouillée de la chapelle'],
      secrets: ['le puits a été empoisonné par un fragment démoniaque', 'le guérisseur savait que la peste venait du Voile', 'un homme du Cercle de Cendre est passé avant vous'],
      quests: ['sauver l\'enfant de Mira', 'trouver les trois ingrédients du remède', 'convaincre les survivants de Val-Cendre'],
      enemies: ['Villageois contaminé', 'Rat pestiféré', 'Zombie malade', 'Pillard revenu du champ'],
      forward: 'Avancer vers la place du village', investigate: 'Interroger les survivants', risk: 'Forcer une maison barricadée',
      exit: 'Val-Cendre n\'est plus seulement un village pestiféré : c\'est la preuve que la guerre continue dans l\'eau, les murs et les corps.',
    },
    {
      titles: ['La gorge du puits', 'Sous les pierres noires', 'Les racines malades', 'L\'eau qui murmure', 'Le cœur de la peste'],
      scenes: ['Vous descendez sous Val-Cendre par les pierres humides du vieux puits.', 'Les tunnels sous le village respirent comme une bête endormie.', 'L\'eau noire reflète votre visage, mais pas exactement votre regard.'],
      details: ['Des racines noires serrent les pierres comme des doigts', 'Une vapeur froide remonte du fond et porte des voix d\'enfants', 'Des symboles rouges ont été tracés sous la mousse'],
      dangers: ['un esprit pestiféré garde la source', 'l\'eau tente de noircir vos veines', 'le fragment démoniaque pulse dans la pierre centrale'],
      npcs: ['La voix de Mira semble vous suivre depuis la surface', 'Une âme noyée répète que le prêtre a menti', 'Un ancien guérisseur apparaît dans un reflet trouble'],
      objects: ['une racine noire encore vivante', 'une fiole d\'eau bénite fendue', 'un fragment du puits'],
      secrets: ['la peste est une fuite du monde démoniaque', 'les fragments peuvent soigner ou corrompre', 'la marque inconnue semble pouvoir refermer les petites failles'],
      quests: ['purifier le puits', 'détruire le fragment démoniaque', 'sauver Val-Cendre avant la nuit complète'],
      enemies: ['Noyé pestiféré', 'Goule du puits', 'Esprit malade', 'Possédé de Val-Cendre'],
      forward: 'Descendre plus bas', investigate: 'Étudier les racines noires', risk: 'Traverser l\'eau contaminée',
      exit: 'Lorsque vous remontez, l\'air de Val-Cendre a changé. Le village n\'est peut-être pas sauvé, mais la source du mal a été révélée.',
      bossIntro: 'Le puits vomit une brume pâle. Une forme d\'enfant et de noyé se recompose devant vous.',
    },
    {
      titles: ['Les croix penchées', 'La fosse ouverte', 'Le registre des morts', 'La crypte noire', 'Les soldats sans repos'],
      scenes: ['La route du cimetière est bordée de croix fraîches et de tombes trop nombreuses.', 'Le cimetière des soldats s\'étend dans la brume, couvert de bannières à moitié enterrées.', 'Des tombes ouvertes montrent que certains morts ont été déplacés après la bataille.'],
      details: ['Un registre trempé porte votre nom, mais la ligne a été rayée', 'Des traces d\'ossements mènent vers une crypte entrouverte', 'Une épée rouillée pointe vers le nord comme une accusation'],
      dangers: ['les morts obéissent à un nécromancien', 'la peste et la nécromancie utilisent la même énergie noire', 'un capitaine mort-vivant garde encore les faux ordres'],
      npcs: ['Un capitaine mort-vivant réclame le nom du traître', 'Un prisonnier attaché dans la crypte vous supplie de le libérer', 'Une ombre de soldat vous appelle Kaël'],
      objects: ['le registre des morts', 'une clef d\'os', 'un livre de chair interdit'],
      secrets: ['Kaël a été déclaré mort puis effacé', 'les armées ont reçu de faux ordres', 'la bataille a nourri un rituel nécromantique'],
      quests: ['libérer les prisonniers de la crypte', 'découvrir qui a falsifié les ordres', 'brûler ou garder le livre de chair'],
      enemies: ['Squelette de soldat', 'Capitaine mort-vivant', 'Goule de fosse', 'Expérience de chair'],
      forward: 'Suivre les tombes ouvertes', investigate: 'Lire les noms des morts', risk: 'Descendre dans une fosse commune',
      exit: 'La crypte s\'effondre derrière vous. Vous repartez avec une certitude : votre mort officielle était un mensonge utile.',
      bossIntro: 'Dans la crypte, les os forment un cercle. Au centre, une silhouette lève un livre cousu de peau.',
    },
    {
      titles: ['La lisière calcinée', 'Les cendres vivantes', 'La clairière malade', 'Les cages des braconniers', 'Le cœur brûlé'],
      scenes: ['La forêt brûlée commence par une odeur d\'orage ancien et de bois mort.', 'Les arbres calcinés se penchent au-dessus du chemin comme des juges noirs.', 'Sous vos pas, la cendre conserve des empreintes qui ne sont pas toutes humaines.'],
      details: ['Un sentier réel disparaît sous une voûte de feuillage sombre', 'Une plume de griffon est coincée dans une cage abandonnée', 'La sève rouge d\'un arbre forme presque un symbole'],
      dangers: ['les braconniers profitent du chaos pour capturer les dernières créatures', 'la forêt elle-même souffre d\'un fragment démoniaque', 'un ent corrompu frappe tout ce qui approche'],
      npcs: ['Un jeune elfe blessé vous observe derrière des branches', 'Un esprit de clairière prend la forme d\'une enfant de feuilles', 'Un braconnier affirme que la forêt était morte avant son arrivée'],
      objects: ['une plume de griffon', 'une carte des pistes secrètes', 'un cœur de bois noir'],
      secrets: ['Sylvéria sait déjà que le Voile se fissure', 'les esprits naturels semblent reconnaître la marque inconnue', 'un passage secret mène vers Brumeval'],
      quests: ['libérer les captifs des braconniers', 'apaiser l\'esprit de la forêt', 'retirer le fragment du cœur brûlé'],
      enemies: ['Braconnier', 'Chef braconnier', 'Ronce animée', 'Ent corrompu'],
      forward: 'Suivre le sentier sous les branches', investigate: 'Écouter les murmures des arbres', risk: 'Couper à travers les ronces noires',
      exit: 'La forêt s\'ouvre enfin sur une route plus froide. Brumeval attend au-delà des branches.',
      bossIntro: 'La clairière tremble. Un arbre immense se redresse, sa douleur changée en rage.',
    },
    {
      titles: ['La grille de Brumeval', 'Le hall aux portraits', 'La cave aux cercueils', 'Le salon rouge', 'Le souvenir enfermé'],
      scenes: ['Le manoir de Brumeval surgit dans la brume, trop élégant pour être honnête.', 'Les grilles s\'ouvrent sans un grincement, comme si quelqu\'un vous attendait.', 'Dans le hall, des portraits suivent votre passage avec des regards peints trop vivants.'],
      details: ['Un portrait porte votre visage et le nom Kaël Ardent', 'Des traces de sang frais descendent vers la cave', 'Un rideau bouge alors qu\'aucune fenêtre n\'est ouverte'],
      dangers: ['les vampires de Brumeval connaissent votre passé', 'les Lames du Voile testent votre identité', 'chaque souvenir offert ici réclame un prix'],
      npcs: ['Une servante vampire prononce votre nom sans hésiter', 'Un assassin masqué vous demande de prouver que vous êtes encore Kaël', 'Sire Vael Draven vous accueille comme un vieil invité'],
      objects: ['l\'anneau de Brumeval', 'un journal des Veilleurs', 'une lame cérémonielle des Lames du Voile'],
      secrets: ['vous avez caché une partie de votre mémoire à Brumeval', 'Azhraël ne peut posséder entièrement ce qu\'il ne peut nommer', 'les vampires peuvent devenir alliés ou ennemis jurés'],
      quests: ['libérer les prisonniers de la cave', 'réussir le duel rituel des Lames', 'refuser ou accepter le pacte vampirique'],
      enemies: ['Vampire mineur', 'Assassin du Voile', 'Servante vampire', 'Sire Vael Draven'],
      forward: 'Entrer plus profondément dans le manoir', investigate: 'Examiner les portraits', risk: 'Descendre seul dans la cave',
      exit: 'Brumeval disparaît derrière vous, mais le souvenir qu\'il gardait continue de brûler dans votre crâne.',
      bossIntro: 'Dans la chambre du maître, les rideaux se soulèvent sans vent. Un vampire ancien se tient devant le balcon.',
    },
    {
      titles: ['Les pierres sacrées', 'L\'autel fendu', 'Le reliquaire', 'Les hommes en noir', 'Le jugement de la marque'],
      scenes: ['La chapelle en ruine se dresse sur une colline battue par le vent.', 'Entre les arches brisées, votre marque pulse comme un second cœur.', 'Des éclats de vitraux craquent sous vos pas, reflétant une lumière pâle.'],
      details: ['Un reliquaire d\'argent repose derrière l\'autel fendu', 'Des cendres rouges dessinent le cercle de la Guilde Noire', 'Une fresque représente les six royaumes autour d\'un portail fermé'],
      dangers: ['la chapelle peut rejeter un héros trop corrompu', 'la Guilde Noire vous rattrape ici', 'l\'Éclat du Voile attire les serviteurs d\'Azhraël'],
      npcs: ['Un prêtre mort depuis longtemps murmure encore dans la nef', 'Un adepte du Cercle vous propose de rendre votre mémoire', 'Les alliés sauvés sur votre route peuvent vous rejoindre'],
      objects: ['l\'Éclat du Voile', 'l\'anneau de cendre', 'une relique fendue'],
      secrets: ['les six royaumes gardent encore les sceaux', 'le Livre II mènera à la guerre totale', 'la foi et la corruption changent les fins possibles'],
      quests: ['obtenir l\'Éclat du Voile', 'refuser le marché du Cercle', 'rassembler les alliés avant la faille'],
      enemies: ['Garde noir du Cercle', 'Adepte du Cercle', 'Mercenaire noir', 'Possédé de la chapelle'],
      forward: 'Avancer vers l\'autel', investigate: 'Étudier la fresque des six royaumes', risk: 'Forcer le reliquaire',
      exit: 'La chapelle vous livre sa dernière lumière. Au loin, la terre tremble : la première faille s\'ouvre.',
      bossIntro: 'Les hommes en noir encerclent la nef. Leur chef lève un anneau rouge vers votre marque.',
    },
    {
      titles: ['Le sanctuaire effondré', 'Les corps du rituel', 'La faille rouge', 'La voix d\'Azhraël', 'Le dernier verrou'],
      scenes: ['Le sanctuaire de la faille n\'est plus qu\'un cercle de colonnes brisées.', 'La réalité se fend devant vous comme une peau trop tendue.', 'Un ciel rouge apparaît dans la déchirure, au-delà du monde.'],
      details: ['Six corps sont disposés autour du portail, un pour chaque peuple', 'Les pierres tremblent au rythme d\'un cœur immense', 'Votre marque devient douloureuse, presque insoutenable'],
      dangers: ['le rituel s\'accélère à chaque instant', 'un démon tente de se hisser dans Astréa', 'Azhraël cherche à entendre votre vrai nom'],
      npcs: ['Élyane peut couvrir votre avancée si elle vous fait confiance', 'Borik peut renforcer votre arme s\'il vous doit la vie', 'Rogh peut briser la ligne ennemie si vous l\'avez aidé'],
      objects: ['l\'Éclat du Voile', 'un fragment démoniaque brûlant', 'la dernière cendre du rituel'],
      secrets: ['la première faille n\'est qu\'un essai', 'les six sceaux seront la cible du Livre II', 'Kaël était un Veilleur du Voile'],
      quests: ['interrompre le rituel final', 'fermer la première faille', 'choisir la voie du Voile ou la voie sombre'],
      enemies: ['Ombre de la faille', 'Garde noir', 'Adepte final', 'Démon mineur de la faille'],
      forward: 'Approcher du portail', investigate: 'Étudier le cercle des six corps', risk: 'Frapper la faille directement',
      exit: 'La faille vacille. Ce que vous avez gagné ici ne sauvera pas Astréa, mais cela vous donne une chance de poursuivre.',
      bossIntro: 'Le portail s\'élargit. Une griffe noire se pose sur le sol d\'Astréa.',
    },
  ]

  const livreGeneric = [
    {
      titles: ['Une couronne en guerre', 'La route des sceaux', 'Le serment fragile', 'La frontière armée', 'Le prix de l\'alliance'],
      scenes: [`Vous progressez dans ${zone.name}, où chaque bannière semble accuser une autre bannière.`, `Dans ${zone.name}, les rumeurs vont plus vite que les cavaliers.`, `Les routes de ${zone.name} portent la fatigue d'un royaume prêt à se briser.`],
      details: ['Un messager cache un sceau sous son manteau', 'Une patrouille vous observe sans savoir si vous êtes un allié', 'Une carte royale a été déchirée et recousue à la hâte'],
      dangers: ['une guerre civile menace d\'éclater', 'un conseiller possédé influence le pouvoir', 'la Guilde Noire achète des témoins'],
      npcs: ['Un capitaine épuisé vous demande de choisir un camp', 'Une diplomate affirme que la paix est encore possible', 'Un prisonnier d\'un peuple ennemi prétend détenir la vérité'],
      objects: ['un sauf-conduit royal', 'un fragment de sceau', 'une lettre diplomatique codée'],
      secrets: ['un sceau a déjà été copié par magie noire', 'certains ennemis ont été manipulés', 'une alliance sauvera des vies dans le Livre III'],
      quests: ['obtenir la confiance d\'un royaume', 'déjouer une fausse accusation', 'récupérer un fragment de sceau'],
      enemies: ['Mercenaire royal', 'Assassin', 'Possédé de cour', 'Champion corrompu'],
      forward: 'Poursuivre la mission des sceaux', investigate: 'Chercher la vérité politique', risk: 'Forcer une audience dangereuse',
    },
  ]

  const livre3 = [
    {
      titles: ['La dernière marche', 'La cendre du monde', 'Le seuil impossible', 'Le vrai nom', 'Le choix final'],
      scenes: [`Dans ${zone.name}, chaque pas ressemble à une fin.`, `La guerre finale transforme ${zone.name} en frontière entre Astréa et l'abîme.`, `${zone.name} n'est plus seulement un lieu : c'est une épreuve pour tout ce que vous avez choisi.`],
      details: ['Les alliés gagnés autrefois tiennent encore une ligne fragile', 'Un souvenir ancien vous revient au pire moment', 'La corruption offre une solution trop facile'],
      dangers: ['Azhraël connaît presque votre vrai nom', 'le portail avale peu à peu la réalité', 'un ancien compagnon pourrait être possédé'],
      npcs: ['Un allié vous rappelle une dette ancienne', 'Un survivant vous confie le dernier message d\'un royaume tombé', 'Une voix lointaine hésite entre vous guider et vous condamner'],
      objects: ['une clef du Voile', 'une lame forgée contre les démons', 'un éclat de couronne brisée'],
      secrets: ['la vraie fin exige assez de mémoire', 'la corruption peut vaincre Azhraël sans sauver Astréa', 'le sacrifice n\'est pas toujours la mort'],
      quests: ['protéger les derniers alliés', 'tenir la ligne du Voile', 'affronter le vrai nom d\'Azhraël'],
      enemies: ['Démon majeur', 'Général spectral', 'Dragon corrompu', 'Avatar d\'Azhraël'],
      forward: 'Avancer vers le portail', investigate: 'Chercher la vraie fin', risk: 'Utiliser la corruption contre l\'abîme',
    },
  ]

  if (bookId === 1) return { ...base, ...livre1[zoneIndex] }
  if (bookId === 2) return { ...base, ...livreGeneric[0] }
  return { ...base, ...livre3[0] }
}


// ── Catalogue d'équipements ─────────────────────────────────────────────────
const WEAPONS = {
  'Poings nus':       { degats: 2, type: 'physique', desc: 'Aucune arme équipée.' },
  'Épée brisée':      { degats: 5, type: 'physique', desc: 'Fiable mais abîmée.' },
  'Lance de fantassin':{ degats: 6, type: 'physique', desc: 'Bonne portée.' },
  'Hache fendue':     { degats: 6, type: 'physique', desc: 'Lourde mais puissante.' },
  'Épée du griffon':  { degats: 8, type: 'physique', desc: 'Lame d\'officier, bien balancée.' },
  'Épée usée':        { degats: 7, type: 'physique', desc: 'Encore utilisable.' },
  'Dague rouillée':   { degats: 4, type: 'physique', desc: 'Légère, idéale pour la furtivité.' },
  'Épée de l\'aurore':{ degats: 11, type: 'sacre',   desc: 'Brûle les morts-vivants (+4 vs mort-vivant/démon).' },
  'Bâton des cendres':{ degats: 7,  type: 'magique',  desc: 'Amplifie les sorts (+2 dégâts magiques).' },
  'Éclat du Voile':   { degats: 9,  type: 'magique',  desc: 'Dégâts magiques par tour si équipé.' },
}

const ARMORS = {
  'Aucune':             { armor: 0,  desc: 'Pas de protection.' },
  'Vêtements usés':     { armor: 1,  desc: 'Protection minimale.' },
  'Armure de cuir':     { armor: 3,  desc: 'Légère, ne gêne pas les tests de Dextérité.' },
  'Armure d\'écailles': { armor: 5,  desc: 'Bonne protection, légèrement encombrante.' },
  'Armure de plates':   { armor: 8,  desc: 'Protection maximale. -1 aux tests de Dextérité.' },
  'Armure de l\'aube':  { armor: 6,  desc: 'Armure bénie. Résiste aux sorts maudits.' },
}

const SHIELDS = {
  'Aucun':              { block: 0,  desc: 'Pas de bouclier.' },
  'Bouclier de bois':   { block: 2,  desc: 'Léger, peut se briser.' },
  'Bouclier de fer':    { block: 4,  desc: 'Solide, protection fiable.' },
  'Bouclier runique':   { block: 5,  desc: 'Absorbe aussi les dégâts magiques.' },
}

function getWeapon(items) {
  for (const w of Object.keys(WEAPONS).reverse()) {
    if (items.includes(w)) return { nom: w, ...WEAPONS[w] }
  }
  return { nom: 'Poings nus', ...WEAPONS['Poings nus'] }
}
function getArmor(items) {
  for (const a of Object.keys(ARMORS).reverse()) {
    if (items.includes(a)) return { nom: a, ...ARMORS[a] }
  }
  return { nom: 'Aucune', ...ARMORS['Aucune'] }
}
function getShield(items) {
  for (const s of Object.keys(SHIELDS).reverse()) {
    if (items.includes(s)) return { nom: s, ...SHIELDS[s] }
  }
  return { nom: 'Aucun', ...SHIELDS['Aucun'] }
}

function mkEnemy(bookId, id, name, boss) {
  // Scale progressif : faible en début de livre, croissant vers la fin
  // Livre 1 id 1-100 : scale 0-5 ; id 100-200 : scale 5-10 ; id 200-300 : scale 10-15
  const bookBase = (bookId - 1) * 8
  const idScale = Math.floor(id / 30)
  const scale = bookBase + idScale
  return {
    nom: name,
    pvMax: (boss ? 40 : 14) + scale * (boss ? 6 : 3),
    attaque: (boss ? 7 : 3) + Math.floor(scale / 2),
    defense: (boss ? 3 : 0) + Math.floor(scale / 6),
    xp: (boss ? 14 : 4) + scale,
    or: boss ? 18 + scale * 2 : 4 + Math.floor(scale / 2),
    boss,
    type: name.toLowerCase().includes('démon') || name.toLowerCase().includes('azhraël') ? 'demon'
        : name.toLowerCase().includes('noyé') || name.toLowerCase().includes('pestiféré') || name.toLowerCase().includes('esprit') ? 'mort-vivant'
        : name.toLowerCase().includes('squelette') || name.toLowerCase().includes('goule') || name.toLowerCase().includes('zombie') || name.toLowerCase().includes('mort-vivant') ? 'mort-vivant'
        : 'normal',
  }
}

function applyEffect(h, eff = {}) {
  const n = { ...h, items: [...h.items], spells: [...h.spells], allies: [...h.allies], quests: [...h.quests], done: [...h.done], secrets: [...h.secrets], flags: { ...h.flags }, endings: [...h.endings] }
  if (eff.item) n.items = uniq(n.items, eff.item)
  if (eff.item2) n.items = uniq(n.items, eff.item2)
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
  const [shieldActive, setShieldActive] = useState(false)

  useEffect(() => { setSavedAvailable(Boolean(localStorage.getItem(SAVE_KEY))) }, [])


  const passage = useMemo(() => generatedPassage(bookId, pid, hero), [bookId, pid, hero])

  function resolveTarget(rawTarget) {
    const target = clamp(rawTarget || 1, 1, 300)
    const visited = hero?.visited || []
    // On n'évite un passage que s'il est DERRIÈRE la progression ET déjà visité.
    // Un passage en avant (target > pid) est toujours autorisé, même s'il a été vu (convergence narrative normale).
    // Un passage en arrière déjà visité est redirigé vers le prochain non visité.
    if (target < pid && visited.includes(`${bookId}:${target}`)) {
      for (let candidate = pid + 1; candidate <= 300; candidate++) {
        if (!visited.includes(`${bookId}:${candidate}`)) return candidate
      }
      return Math.min(300, pid + 1)
    }
    return target
  }

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

  function go(goto, eff) {
    const target = resolveTarget(goto)
    if (eff) setHero(h => applyEffect(h, eff))
    if (target !== goto && target > goto) addLog('Retour en arrière évité.')
    setHero(h => {
      if (!h) return h
      const key = `${bookId}:${pid}`
      if (h.visited?.includes(key)) return h
      return { ...h, visited: [...(h.visited || []), key] }
    })
    setPid(target)
    setCombat(null)
    setLastRoll(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
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
        if (choice.successCombat) return setTimeout(() => startCombat(passage.enemy), 3000)
        return setTimeout(() => go(choice.success, choice.effect), 3000)
      }
      if (choice.failCombat) return setTimeout(() => { addLog('Échec : la menace vous force au combat.'); startCombat(passage.enemy) }, 3000)
      setTimeout(() => go(choice.fail, null), 3000)
      return
    }
    go(choice.goto, choice.effect)
  }

  function startCombat(enemy) { if (!enemy) { addLog('Erreur : aucun ennemi défini pour ce passage.'); return } setCombat({ ...enemy, pv: enemy.pvMax, log: [`${enemy.nom} surgit.`] }) }
  function heroDamage(spell) {
    const weapon = getWeapon(hero.items)
    const armor  = getArmor(hero.items)
    const shield = getShield(hero.items)
    if (spell) {
      const spellBonus = hero.items.includes('Bâton des cendres') ? 2 : 0
      const holy = spell.type === 'damageHoly' && ['demon', 'mort-vivant'].includes(combat.type)
      return Math.max(1, d6() + Math.floor(hero.esprit / 2) + spell.degats + spellBonus + (holy ? 6 : 0) - combat.defense)
    }
    const sacreBonus = weapon.type === 'sacre' && ['demon', 'mort-vivant'].includes(combat.type) ? 4 : 0
    return Math.max(1, d6() + Math.floor(hero.force / 2) + weapon.degats + sacreBonus - combat.defense)
  }
  function enemyStrike(c) {
    const armor  = getArmor(hero.items)
    const sh     = getShield(hero.items)
    let dmg = Math.max(1, c.attaque + d6() - armor.armor - sh.block - Math.floor(hero.force / 3))
    if (shieldActive) { dmg = Math.ceil(dmg / 2); setShieldActive(false) }
    return Math.max(0, dmg)
  }
  function finishVictory(c) {
    const ve = passage?.victoryEffect || {}
    setHero(h => applyEffect(h, { xp: c.xp, or: c.or, memoire: c.boss ? 2 : 0, reputation: c.boss ? 1 : 0, ...ve }))
    if (ve.item) addLog(`Trouvé : ${ve.item} !`)
    addLog(`Victoire contre ${c.nom}.`)
    if (pid === 300) {
      const code = `${BOOKS[bookId].code}-${hero.corruption > 45 ? 'CENDRE' : hero.memoire > 35 ? 'VOILE' : 'SURVIVANT'}-${String(hero.xp).padStart(3, '0')}`
      setHero(h => ({ ...h, endings: uniq(h.endings, code) }))
      addLog(`Code de fin : ${code}`)
      setCombat(null)
      return
    }
    // Boss du cimetière (107/108/109) → toujours §110 (crypte s'effondre)
    if (bookId === 1 && [107, 108, 109].includes(pid)) {
      setCombat(null); go(110); return
    }
    // Boss du puits (81/82) → §83 (source purifiée, victoire propre)
    if (bookId === 1 && [81, 82].includes(pid)) {
      setCombat(null); go(83); return
    }
    const afterBoss = resolveTarget(pid + 1)
    setCombat(null); go(afterBoss)
  }
  function attack() {
    const dmg = heroDamage()
    // Dégâts magiques par tour (Éclat du Voile)
    const dot = hero.items.includes('Éclat du Voile') ? 3 : 0
    // Bâton des cendres : +2 dégâts magiques par tour si équipé
    const dotBaton = hero.items.includes('Bâton des cendres') ? 2 : 0
    const totalDot = dot + dotBaton
    const npv = Math.max(0, combat.pv - dmg - totalDot)
    if (npv <= 0) return finishVictory(combat)
    const taken = enemyStrike(combat)
    const logLines = [`Vous infligez ${dmg} dégâts physiques.`]
    if (totalDot > 0) logLines.push(`✨ Dégâts magiques : ${totalDot} (par tour).`)
    logLines.push(`${combat.nom} riposte : ${taken} dégâts.`)
    setCombat(c => ({ ...c, pv: npv, log: logLines }))
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
    if (s.type === 'shield') { setShieldActive(true); return setCombat(c => ({ ...c, log: [`${name} : prochaine attaque réduite.`] })) }
    const dmg = heroDamage(s)
    const npv = Math.max(0, combat.pv - dmg)
    if (npv <= 0) return finishVictory(combat)
    const taken = enemyStrike(combat)
    setCombat(c => ({ ...c, pv: npv, log: [`${name} : ${dmg} dégâts.`, `${c.nom} riposte : ${taken} dégâts.`] }))
    setHero(h => ({ ...h, pv: clamp(h.pv - taken, 0, h.pvMax) }))
  }
  function restItem() { const item = hero.items.find(i => ['Ration', 'Potion de soin', 'Remède argenté'].includes(i)); if (!item) return; const heal = item === 'Ration' ? 6 : 14; setHero(h => { const idx = h.items.findIndex(x => x === item); return { ...h, pv: clamp(h.pv + heal, 0, h.pvMax), items: h.items.filter((_, i) => i !== idx) } }); addLog(`${item} utilisé : +${heal} PV.`) }

  if (screen === 'home') return <Home selectedBook={selectedBook} setSelectedBook={setSelectedBook} rollHero={rollHero} confirmStart={confirmStart} rolledHero={rolledHero} pendingClass={pendingClass} savedAvailable={savedAvailable} load={load} erase={erase} />

  const art = ILLUSTRATIONS[passage.art] || ILLUSTRATIONS.battlefield
  return <main className="app"><div className="shell">
    <section className="panel">
      <div className="header"><div><div className="kicker">{BOOKS[bookId].title} · Progression {pid}/300 · {passage.zone}</div><h1>{passage.title}</h1></div><div className="btnbar"><button className="btn good" onClick={save}>Sauvegarder</button><button className="btn" onClick={restart}>Menu</button></div></div>
      <div className="content">
        <img className="illustration" src={art} alt="Illustration noir et blanc" />
        <article className="paper"><h3>{passage.title}</h3><p className="text">{passage.text}</p></article>
        {lastRoll && <div className={'rollResult ' + (lastRoll.ok ? 'roll-success' : 'roll-failure')}><div className="rollTitle">{lastRoll.ok ? '✔ Réussite' : '✘ Échec'}</div><div className="rollDetails"><span className="dice">🎲 {lastRoll.a} + {lastRoll.b}</span><span>+ {lastRoll.stat} {lastRoll.bonus}</span><span className="rollTotal">= {lastRoll.total}</span><span className="rollDc">/ {lastRoll.dc} requis</span></div></div>}
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
  return <main className="home"><section className="panel heroBox"><div className="kicker">V4 · Livre-jeu RPG propre</div><h1>Les Cendres d'Astréa</h1><h2>Combats · quêtes · secrets · illustrations noir et blanc</h2><p className="intro">Un homme se réveille amnésique sous un tas de cadavres, au milieu d\'un champ de bataille. Le monde est en guerre, les épidémies ravagent les villages, les routes sont livrées aux pillards et des rumeurs parlent de morts qui ne restent pas morts. Vous ignorez qui vous êtes, et pourquoi certains semblent vous chercher.</p>{savedAvailable && <div className="btnbar" style={{marginTop:16}}><button className="btn good" onClick={load}>Continuer la sauvegarde</button><button className="btn bad" onClick={erase}>Effacer la sauvegarde</button></div>}<h2 style={{marginTop:24}}>Choisis le livre</h2><div className="books">{Object.entries(BOOKS).map(([id,b]) => <button key={id} className="selectCard" onClick={() => setSelectedBook(Number(id))} style={{outline: selectedBook===Number(id)?'2px solid #f1c36d':'none'}}><h3>{b.title}</h3><p>{b.subtitle}</p><b>Aventure longue</b></button>)}</div><h2 style={{marginTop:24}}>Choisis ton héros</h2><div className="classes">{Object.entries(CLASSES).map(([k,c]) => <button key={k} className="selectCard" onClick={() => rollHero(k)} style={{outline: pendingClass===k?'2px solid #f1c36d':'none'}}><h3>{c.nom}</h3><p>{c.desc}</p><small>Clique pour préparer le lancer de dés</small></button>)}</div>{rolledHero && <div className="rollBox"><div className="kicker">Création du héros · lancer de dés</div><h2>Points de capacité obtenus</h2><p className="intro">Les dés déterminent tes capacités. Tu peux relancer avant de commencer l\'aventure.</p><div className="diceGrid"><Stat label="Dé Force" value={rolledHero.rolls.force}/><Stat label="Dé Dextérité" value={rolledHero.rolls.dex}/><Stat label="Dé Chance" value={rolledHero.rolls.chance}/><Stat label="Dé Esprit" value={rolledHero.rolls.esprit}/><Stat label="Dés PV" value={rolledHero.rolls.pv}/><Stat label="Dé Mana" value={rolledHero.rolls.mana}/></div><div className="diceGrid finalStats"><Stat label="Force finale" value={rolledHero.force}/><Stat label="Dextérité finale" value={rolledHero.dex}/><Stat label="Chance finale" value={rolledHero.chance}/><Stat label="Esprit final" value={rolledHero.esprit}/><Stat label="PV max" value={rolledHero.pvMax}/><Stat label="Mana max" value={rolledHero.manaMax}/></div><div className="btnbar" style={{marginTop:16}}><button className="btn" onClick={() => rollHero(pendingClass)}>Relancer les dés</button><button className="btn primary" onClick={confirmStart}>Commencer l\'aventure</button></div></div>}</section></main>
}

function Combat({ combat, hero, attack, chanceMove, cast, restItem }) {
  return <div className="combat"><div className="combatTitle"><div><div className="kicker">Combat</div><h2>{combat.nom}</h2></div><b>{combat.pv}/{combat.pvMax} PV</b></div><div className="track"><div className="fill red" style={{width:pct(combat.pv, combat.pvMax)}} /></div><div className="combatActions"><button className="btn primary" onClick={attack}>Attaquer à l\'arme</button><button className="btn" onClick={chanceMove}>Tenter la chance</button><button className="btn good" onClick={restItem}>Utiliser soin/ration</button>{hero.spells.map(s => <button key={s} className="btn" onClick={() => cast(s)}>{s} ({SPELLS[s]?.cout || 0} mana)</button>)}</div><div className="log" style={{marginTop:12}}>{combat.log.map((l,i)=><p key={i}>{l}</p>)}</div></div>
}

function Sidebar({ hero, bookId, pid, log }) {
  const weapon = getWeapon(hero.items)
  const armor  = getArmor(hero.items)
  const sh     = getShield(hero.items)
  return <aside className="side"><div className="card"><h3>Feuille d'aventure</h3><b>{hero.nom}</b><Meter label="PV" value={hero.pv} max={hero.pvMax} cls="red"/><Meter label="Mana" value={hero.mana} max={hero.manaMax} cls="blue"/><div className="grid2"><Stat label="Force" value={hero.force}/><Stat label="Dextérité" value={hero.dex}/><Stat label="Chance" value={`${hero.chance}/${hero.chanceMax}`}/><Stat label="Esprit" value={hero.esprit}/></div></div><div className="card"><h3>Équipement</h3><div className="equipRow"><div className="equipItem"><span>⚔ <span className="equipName">{weapon.nom}</span></span><span className="equipStat">+{weapon.degats} dégâts</span></div><div className="equipItem"><span>🛡 <span className="equipName">{armor.nom}</span></span><span className="equipStat">{armor.armor} armure</span></div><div className="equipItem"><span>🔰 <span className="equipName">{sh.nom}</span></span><span className="equipStat">{sh.block} blocage</span></div></div></div><div className="card"><h3>Progression</h3><p>Livre {bookId} · Progression {pid}/300</p><Meter label="Mémoire" value={hero.memoire} max={100} cls="purple"/><Meter label="Corruption" value={hero.corruption} max={100} cls="red"/><Meter label="Réputation" value={hero.reputation + 100} max={200}/><p>Niveau {hero.niveau} · XP {hero.xp} · Or {hero.or}</p></div><Tags title="Inventaire" items={hero.items}/><Tags title="Sorts" items={hero.spells}/><Tags title="Alliés" items={hero.allies}/><Tags title="Quêtes actives" items={hero.quests}/><Tags title="Quêtes terminées" items={hero.done}/><Tags title="Secrets" items={hero.secrets}/>{hero.endings.length>0 && <div className="card"><h3>Codes de fin</h3>{hero.endings.map(e=><p className="endCode" key={e}>{e}</p>)}</div>}<div className="card"><h3>Journal</h3><div className="log">{log.map((l,i)=><p key={i}>{l}</p>)}</div></div></aside>
}
function Meter({ label, value, max, cls='' }) { return <div className="meter"><div className="meterRow"><span>{label}</span><span>{value}/{max}</span></div><div className="track"><div className={'fill '+cls} style={{width:pct(value,max)}} /></div></div> }
function Stat({ label, value }) { return <div className="stat"><span>{label}</span><b>{value}</b></div> }
function Tags({ title, items }) { return <div className="card"><h3>{title}</h3><div className="tags">{items.length ? items.map((x,i)=><span className="tag" key={x+i}>{x}</span>) : <span className="tag">Aucun</span>}</div></div> }
