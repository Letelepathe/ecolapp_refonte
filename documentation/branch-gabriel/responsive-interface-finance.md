# Ajustements responsifs de l’interface financière

## Objectif

Adapter les écrans aux ordinateurs, tablettes et téléphones sans modifier leur identité visuelle ni leur fonctionnement.

## Changements

- Les boutons principaux des paiements se répartissent sur la largeur disponible et passent proprement à la ligne.
- Les champs disposés en demi-colonne occupent toute la largeur sur les petits téléphones.
- Les modales respectent la hauteur de l’écran et leur contenu devient défilable sans masquer les actions.
- Les en-têtes des reçus et rapports se réorganisent verticalement lorsque la largeur est insuffisante.
- Les textes longs peuvent revenir à la ligne sans agrandir le document.
- Les signatures se répartissent selon la place disponible.
- Les tableaux riches conservent un défilement horizontal afin de garder des colonnes lisibles.
- Les images et logos ne peuvent plus dépasser leur conteneur.
- Le bureau d’administration utilise une grille fluide : les cartes occupent automatiquement le nombre de colonnes permis par l’écran, restent sur deux colonnes sur la majorité des téléphones et passent sur une colonne uniquement lorsque l’écran est très étroit.
- Les listes du cycle scolaire (années, semestres ou trimestres et périodes) n’imposent plus une largeur de grand tableau lorsqu’elles ne contiennent que quelques colonnes.
- Le générateur d’horaires utilise un bouton « Retour » compact qui reste dans le flux de la page et ne recouvre plus le titre ou son icône.
- Les listes de devises conservent la colonne Action visible au lieu de la repousser à l’extrémité d’un tableau artificiellement large.
- La liste des paiements affiche ses actions dans une grille compacte et ses filtres sur une ligne adaptable, afin de laisser rapidement la place au tableau.
- Les petites listes de référence, notamment semestres, classes et fonctions, conservent une vraie colonne Action sur chaque ligne avec une largeur compacte et stable.
- Le tableau Membres du bureau d’administration conserve avatar, utilisateur et email sur téléphone ; les colonnes secondaires sont masquées et les emails longs sont tronqués proprement sans agrandir la page.
- Sur téléphone et tablette, la carte Membres supprime ses espacements horizontaux imbriqués afin d’occuper la même largeur que la carte Admins.
- La transformation automatique des actions est désactivée pour les petites listes : leurs boutons restent dans la colonne de chaque ligne et tout ancien menu « Actions » injecté est nettoyé.
- Les listes des modes de paiement n’affichent plus deux actions d’ajout : une seule action « Ajouter un mode » est conservée dans l’en-tête.
- Les aperçus « paiements en ordre », « paiements avec dettes » et « état financier global » séparent maintenant le titre du modal, les filtres, les actions et la page blanche imprimable. Le reçu individuel reste inchangé.
- Dans les listes de paiements générale, en ordre et avec dette, la recherche apparaît en première position à gauche et les sélections utilisent le même panneau de filtres compact.

## Test local conseillé

Tester les largeurs `320`, `375`, `768`, `1024` et un grand écran depuis les outils de développement du navigateur, en particulier les listes de paiements, les formulaires, les modales, les reçus et l’état financier global.

Ces changements sont uniquement frontend et ne nécessitent aucune API ou modification de base de données.
