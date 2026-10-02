# Options en primaire et maternelle

## Fonctionnement ajouté

- Chaque école crée ses propres options/programmes dans le cycle concerné.
- En primaire et en maternelle, une option ne dépend pas d'une section.
- Le formulaire d'inscription charge la première option active, l'affiche en lecture seule et envoie son identifiant à l'API.
- Sans option configurée, l'inscription est bloquée avec un message clair invitant à contacter l'administration.
- Le secondaire conserve son fonctionnement : une section reste obligatoire.

## API Laravel

- `POST /api/option/create` : accepte `section_id = null` pour les directions 1 (maternelle) et 2 (primaire), mais l'exige pour la direction 3 (secondaire).
- `POST /api/inscription/create` : vérifie que la classe et l'option sont actives et appartiennent à la même école et à la même direction que l'inscription.
- `GET /api/option/ecole/{ecole_id}/direction/{direction}` : alimente la liste d'administration et le choix automatique du formulaire.

## Base de données

La colonne `options.section_id` doit accepter `NULL` :

```sql
ALTER TABLE options MODIFY section_id BIGINT UNSIGNED NULL;
```

Cette modification ne supprime et ne transforme aucune donnée existante. Chaque école partenaire doit ensuite créer au moins une option pour son primaire et/ou sa maternelle avant d'enregistrer une inscription dans ce cycle.
