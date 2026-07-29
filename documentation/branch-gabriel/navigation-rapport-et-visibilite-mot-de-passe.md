# Rapport financier et visibilité des mots de passe

## Changements

- L’action **État financier global** est maintenant affichée directement dans la liste principale des paiements, à côté de **Paiements en ordre** et **Paiements avec dettes**, pour les cycles secondaire, primaire et maternelle.
- Les raccourcis déjà présents dans les listes « en ordre » et « avec dettes » sont conservés.
- Le bouton du rapport accepte une classe CSS fournie par la page appelante afin de rester réutilisable dans différents emplacements.
- Le composant partagé `ChampMotDePasse` ajoute une commande accessible pour afficher ou masquer temporairement un mot de passe.
- Ce composant est utilisé dans les connexions, créations de comptes administratifs et scolaires, ainsi que dans les écrans de réinitialisation.

## Sécurité et maintenance

- Le mot de passe reste masqué par défaut.
- L’affichage ne change ni la valeur saisie ni les données envoyées au backend.
- Le bouton est de type `button` : il ne soumet jamais accidentellement un formulaire.
- Les libellés accessibles indiquent clairement « Afficher » ou « Masquer le mot de passe ».

## Backend

Aucune nouvelle API ni modification de base de données n’est nécessaire pour ces changements d’interface. Le rapport utilise l’API d’état financier déjà intégrée.

## Impression financière

- Les impressions financières sont préparées sous forme de pages visuelles stables avant l’ouverture du dialogue système. Cela évite les aperçus blancs provoqués par des styles, polices ou images encore en chargement.
- Les documents longs sont découpés automatiquement selon le format et l’orientation demandés.
- Les listes « en ordre », « avec dettes » et l’état financier global utilisent un pied partagé avec date d’édition, zones de signature et cachet.
