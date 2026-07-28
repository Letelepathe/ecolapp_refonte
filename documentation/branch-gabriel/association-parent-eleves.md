# Association parent–élèves

- La modification d'un élève affiche maintenant le message précis renvoyé pour
  un code parent inconnu.
- Le détail d'un parent demandé depuis l'administration transmet l'école et la
  direction actives afin de n'afficher que les élèves concernés.
- Les noms de classe et d'option acceptent les formats API `name` et `nom`.
- Le backend centralise l'association par code pour l'ajout et la modification.
- Un même compte parent peut ainsi apparaître dans plusieurs écoles lorsqu'il
  est relié à des élèves de ces écoles.
