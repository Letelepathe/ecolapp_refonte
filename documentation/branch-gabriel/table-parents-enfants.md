# Tableau des parents et consultation des enfants

## Interface

- La ligne d’un parent affiche uniquement son premier enfant lié.
- L’action textuelle **Voir les enfants (N)** ouvre un modal dédié sans occuper la cellule comme un gros bouton.
- Le modal propose une recherche par nom, matricule, classe ou direction.
- Les enfants sont rendus par groupes de 10 afin de conserver une interface légère.
- Le composant `ModalElevesParent` est isolé et peut être réutilisé par d’autres cycles.

## Limite backend actuelle

La pagination réduit le nombre de lignes rendues par le navigateur, mais l’API actuelle renvoie encore tous les enfants avec les parents. Pour des parents ayant plusieurs centaines d’enfants, prévoir ensuite une API paginée :

`GET /api/parents/{parent}/eleves?ecole_id={ecole}&direction={direction}&page=1&per_page=10&search=`

L’API doit appliquer le périmètre de l’école et de la direction côté serveur.
