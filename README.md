# Aiguilles des Îles — site frontend multi-pages

Site vitrine réalisé en HTML, CSS et JavaScript, sans framework.

## Pages
- `index.html` : accueil
- `concours.html` : présentation et conditions du concours
- `calendrier.html` : étapes du concours
- `candidature.html` : formulaire de candidature
- `contact.html` : page de contact indépendante

## Dossiers
- `css/styles.css` : tout le style, les couleurs, le responsive et les images de fond.
- `js/main.js` : menu mobile, page active, animations au scroll et interactions des formulaires.
- `assets/` : dossier pour ajouter vos images et ressources locales.

## Ouvrir le site
Décompressez le ZIP puis ouvrez `index.html` dans un navigateur. Dans VS Code, vous pouvez aussi utiliser l'extension Live Server.

## Personnaliser
- Modifier les textes directement dans chaque fichier HTML.
- Modifier les couleurs au début de `css/styles.css`, dans `:root`.
- Remplacer les images en modifiant les URL `images.unsplash.com` dans `css/styles.css`.
- Le menu est commun à chaque page : si vous changez les liens, faites-le dans chaque fichier HTML.

## Comportements demandés
- Menu fixé en haut de l'écran.
- Image de fond de la bannière d'accueil fixée pendant le défilement sur ordinateur (`background-attachment: fixed`). Sur téléphone, le navigateur utilise un comportement normal pour éviter les problèmes de performance.
- Apparition progressive des blocs au défilement.
- Transitions discrètes sur les boutons et les images.
- Menu mobile.

## Important
Les formulaires sont des démonstrations frontend. Ils ne transmettent ni n'enregistrent aucune donnée. Pour recevoir les candidatures et messages, il faudra ajouter un backend (par exemple PHP + MySQL), la validation serveur et le stockage sécurisé des fichiers.
Les photos proviennent d'Unsplash et nécessitent une connexion Internet. Vous pouvez les remplacer par vos propres fichiers dans `assets/`.
