# Par cœur

Apprendre une poésie par cœur, morceau par morceau, en 5 à 10 minutes par jour. Pour les enfants de CM (9 à 11 ans), sur téléphone ou tablette. Premier poème : « Le loup et l'agneau » de Jean de La Fontaine. Un adulte peut ajouter d'autres poésies.

- **Jouer en ligne :** https://lechampdelaurore-boop.github.io/par-coeur/
- **Pour les parents :** [guide des parents](docs/guide-parents.md)
- **Pourquoi l'appli est faite comme ça :** [méthode et sources](docs/methode-et-sources.md)
- Fait partie de [Mes applis](https://lechampdelaurore-boop.github.io/), la page qui regroupe toutes les applis.

## Le principe

- **Comprendre d'abord.** On écoute le morceau, on voit qui parle (📖 le conteur, 🐺 le loup, 🐑 l'agneau) et on touche les mots difficiles pour voir leur sens.
- **Petits morceaux.** Le poème est coupé en morceaux de 2 à 5 vers, selon le sens. « Le loup et l'agneau » en a 8.
- **À voix haute, avec un geste.** Chaque morceau a une idée de geste (boire dans ses mains, marcher à pas de loup…).
- **L'aide s'efface en 4 marches :** texte complet, puis premières lettres de chaque mot, puis premier mot de chaque vers, puis rien.
- **On se teste.** L'enfant récite, touche « Vérifier », voit le texte et dit lui-même : « Je l'ai su », « Presque » ou « Pas encore ».
- **On enchaîne.** Chaque nouveau morceau est récité avec celui d'avant, puis on récite depuis le début.
- **On espace.** Un morceau su revient à J+1, J+2, J+4 puis J+7. Si une date de récitation est donnée, le plan s'organise pour être prêt à temps.
- **Le soir, on le redit une fois avant de dormir.** L'appli le rappelle à la fin de chaque séance.
- **Pas d'échec.** « Pas encore » redonne simplement une aide. Aucun morceau n'est verrouillé.

## Les écrans

- **L'écran de la poésie** : le poème en cours (« Morceaux sus : 3 sur 8 », « Récitation dans 4 jours ») et un seul gros bouton bleu : **« Ma séance du jour »**. En dessous, les morceaux en tuiles colorées, dans l'ordre, chacune avec un émoji et un titre court. Chaque tuile montre son état : nouveau, marche 1 à 4, su ⭐ (jusqu'à 3 étoiles au fil des révisions), à revoir 🔔. Le prochain morceau conseillé porte « 👉 Conseillé ». On peut toucher n'importe quel morceau. Boutons : « Réciter depuis le début », « Écouter toute la poésie », « Date de la récitation », « Mes poésies ».
- **Apprendre un morceau** (5 à 8 minutes) : écouter et comprendre, les 4 marches, « Le mot qui manque » (un vers avec un trou et 3 mots au choix, surtout pour les mots anciens et rares), enchaîner avec le morceau d'avant, puis bravo, étoiles et un personnage.
- **Réviser un morceau** : directement sans aide, puis « Vérifier ».
- **Réciter depuis le début** : tous les morceaux commencés, à la suite, sans aide (seulement les émojis de qui parle). Option **« Avec un adulte »** : l'adulte voit tout le texte et touche les vers où l'enfant a hésité ; ces vers-là sont mis à revoir.
- **Écouter tout le poème** : la voix lit le poème, le vers lu est surligné.

## Ma séance du jour

1. D'abord les révisions du jour (3 morceaux au plus).
2. Puis **un** morceau nouveau (deux ou trois si la récitation approche et qu'il reste beaucoup de morceaux).
3. Quand tous les morceaux sont sus, « Réciter depuis le début » fait partie de la séance.
4. La veille et le jour de la récitation, tout est à revoir.

Après une révision : « Je l'ai su » éloigne la prochaine révision, « Presque » la ramène au lendemain sans enlever d'étoile, « Pas encore » la ramène au lendemain et refait vite les marches avec aide.

## « Le loup et l'agneau »

Le texte suit la fiche donnée en classe (29 vers, ponctuation et majuscules comprises).

| # | Morceau | Vers | Qui parle |
|---|---|---|---|
| 1 | La morale | 1-2 | 📖 |
| 2 | L'agneau boit, le loup arrive | 3-6 | 📖 |
| 3 | Le loup se fâche | 7-9 | 🐺 📖 🐺 |
| 4 | L'agneau répond poliment | 10-12 | 🐑 |
| 5 | Je bois plus bas | 13-17 | 🐑 |
| 6 | L'an passé ? | 18-21 | 🐺 🐑 |
| 7 | Ton frère, les tiens | 22-25 | 🐺 🐑 🐺 |
| 8 | La fin | 26-29 | 🐺 📖 |

Les mots difficiles (onde, à jeun, breuvage, témérité, médis, épargnez, procès…) ont leur explication. Les formes anciennes *je me vas*, *encor*, *nous l'allons montrer* et *je ne puis* portent une petite étiquette « ancien » : ce ne sont pas des fautes, il faut les apprendre telles quelles.

## Ajouter une poésie

Par « 📚 Mes poésies » (ou ⚙ puis « Coin des parents ») : titre, auteur et texte collé. Une ligne vide marque un nouveau morceau ; sans ligne vide, l'appli coupe tous les 4 vers. Pour une poésie ajoutée, il n'y a ni émoji de qui parle, ni geste, ni mots expliqués, et « Le mot qui manque » porte sur le mot qui rime. On peut aussi supprimer une poésie ajoutée ou remettre à zéro les progrès d'une poésie.

## Réglages ⚙

Sons, animations, vibration, voix (oui ou non, lente ou normale) et date de la récitation. Les animations respectent aussi le réglage « réduire les animations » du téléphone. La voix est celle de l'appareil : elle peut mal prononcer certains mots anciens.

Les progrès et les poésies ajoutées restent dans le navigateur de l'appareil : aucun compte, et rien n'est envoyé sur internet. L'appli ne se sert pas du micro.

## Fichiers

- `index.html` : toute l'appli (HTML, CSS et JavaScript, sans bibliothèque), poème et personnages compris. Le haut du style reprend la charte commune des applis.
- `sw.js` et `manifest.webmanifest` : mode hors ligne et installation. Après une modification des fichiers de l'appli, changer la valeur de `CACHE` dans `sw.js`.
- `icons/` : icône de l'appli ; `fonts/` : polices Fredoka et Nunito (licence SIL Open Font License, voir les fichiers `OFL-*.txt`).
- `docs/` : le [guide des parents](docs/guide-parents.md) et la [méthode et les sources](docs/methode-et-sources.md).
- `tests/telephone.cjs` et `.github/workflows/test-telephone.yml` : après chaque mise en ligne, GitHub ouvre le site publié dans Chrome au format téléphone (7 tailles d'écran), joue un morceau, une révision et une récitation, et vérifie le mode hors ligne, l'absence de débordement et d'erreur dans la console. Résultat et captures dans l'onglet Actions. Lancement local : `npm install --no-save playwright && node tests/telephone.cjs`.

## Plus tard

- Enregistrer la voix d'un parent à la place de la voix de synthèse.
- Partager une poésie ajoutée par un lien.
