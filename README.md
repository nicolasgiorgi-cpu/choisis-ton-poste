# Choisis ton poste · M12 jeu à 10

Site statique (HTML/CSS/JS, sans installation) pour que les enfants découvrent les 7 postes du jeu à 10 et envoient leurs postes préférés (1 à 3).

## Contenu du dossier

| Fichier | Rôle |
|---|---|
| `index.html` | La page |
| `style.css` | Le style |
| `data.js` | **Le contenu des 7 cartes** (textes, étoiles, joueurs, vidéos) |
| `config.js` | **Le branchement du Google Form** |
| `app.js` | Le fonctionnement (cartes, choix, formulaire) |

## Mettre en ligne sur GitHub Pages

1. Sur github.com : **New repository**, nom par ex. `choisis-ton-poste`, visibilité **Public** (GitHub Pages gratuit l'exige).
2. **Add file › Upload files** : glisse tout le contenu du dossier (index.html, css, js, images), puis **Commit changes**.
3. **Settings › Pages** : Source = *Deploy from a branch*, Branch = `main`, dossier `/ (root)`, **Save**.
4. Après 1 à 2 minutes, le site est à l'adresse `https://<ton-compte>.github.io/choisis-ton-poste/`.

Le site n'est pas référencé par les moteurs de recherche (balise `noindex`) : seules les personnes qui ont le lien le trouvent.

Pour modifier ensuite : ouvre le fichier sur GitHub, icône crayon, modifie, **Commit**. Le site se met à jour en 1 minute. Dans `index.html`, augmente le numéro `?v=` des fichiers modifiés pour que les téléphones ne gardent pas l'ancienne version en cache.

## Le formulaire (Google Form)

Le site est branché sur le Google Form « M12 - 26/27 - Choix de postes » (questions Prénom, Nom, Choix 1, Choix 2, Choix 3, Message, Test Aide-moi à choisir). Les réponses arrivent dans l'onglet **Réponses** du Form ; bouton « Associer à Sheets » pour les avoir dans une Google Sheet. Chaque envoi = une ligne datée ; c'est le dernier envoi d'un enfant qui compte.

Les enfants peuvent envoyer 1, 2 ou 3 choix : un choix non fait arrive dans le Form sous la forme « — ».

Ne renomme pas et ne supprime pas les questions du Form : les numéros `entry.xxx` de `config.js` changeraient. Si `config.js` est vidé, le site repasse en **mode test** (rien n'est envoyé).

Pour rebrancher un autre Form :

1. Crée un Google Form avec des questions « Réponse courte » : **Prénom, Nom, Choix 1, Choix 2, Choix 3**, et si tu veux **Message**.
2. Onglet Réponses : relie-le à une Google Sheet.
3. Menu ⋮ › **Obtenir le lien prérempli** : écris `PRENOM`, `NOM`, `C1`, `C2`, `C3`, `MSG` dans les champs, puis **Obtenir le lien** et copie-le.
4. Dans ce lien, chaque champ apparaît sous la forme `entry.1234567890=PRENOM`. Recopie les `entry.xxx` dans `config.js`.
5. `formAction` = l'adresse du Form en remplaçant la fin `/viewform?...` par `/formResponse`.
6. Dans les paramètres du Form, décoche « Limiter à 1 réponse » et toute connexion obligatoire.

(Ou envoie le lien prérempli à Claude, qui remplit `config.js` pour toi.)

## Photos des joueurs

Les photos viennent de Wikimedia Commons (licences libres) : dans `data.js`, champ `commons` = nom du fichier Commons, `credit` = auteur et licence (affichés sur la photo). Pour mettre ta propre photo à la place :

1. Sur GitHub, **Add file › Upload files** et dépose l'image (ex. `marchand.jpg`, format portrait de préférence).
2. Dans `data.js`, à la ligne du joueur : `photo: "marchand.jpg"`.

Utilise des photos dont tu as le droit (par ex. Wikimedia Commons, en citant l'auteur dans `info`).

## Changer une vidéo

Dans `data.js`, remplace l'`id` (ce qui suit `watch?v=` dans l'adresse YouTube). Pour ne montrer qu'un extrait, ajoute `start: 92, end: 118` (en secondes). Si une vidéo refuse de s'afficher dans le site, c'est que son auteur bloque l'intégration : choisis-en une autre.

## Le test « Aide-moi à choisir »

La carte en haut de la liste lance 5 questions (1 ou 2 réponses à chaque fois). Chaque réponse donne des points aux postes ; à la fin, les 3 postes les plus compatibles s'affichent dans l'ordre, et l'enfant peut les garder dans ses choix. À l'envoi, la colonne « Test Aide-moi à choisir » du Form reçoit les postes proposés et les réponses cochées (ou « Pas fait »). Les questions, les réponses et les points sont dans `app.js`, tableau `QUIZ` (P = pilier, T = talonneur, L = 3e ligne, N = demi de mêlée, O = ouvreur, C = centre, A = ailier).
