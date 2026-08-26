# Modification des élèves — primaire et maternelle

## Ajout réalisé

- Une route `/{cycle}/modifier_eleve/{id}` existe maintenant pour le primaire et la maternelle.
- La liste des élèves propose les actions `Modifier` et `Supprimer`.
- Un composant commun charge l'élève, les classes, les années, les options et les types d'élèves dans le périmètre de l'école et du cycle.
- Le code parent peut être recherché et associé comme dans le formulaire secondaire.
- La modification du type d'élève conserve le service d'attribution existant.
- Si aucune option n'est configurée, l'enregistrement est bloqué avec une indication claire.

## Navigation

Le menu actif `Structure scolaire` affiche désormais `Options / programmes` en primaire et en maternelle. Les sections restent uniquement visibles pour le secondaire.

## API utilisée

- `GET /api/eleve/{id}`
- `PUT /api/eleve/edit/{id}`
- `GET /api/classe/ecole/{ecole_id}/direction/{direction}`
- `GET /api/option/ecole/{ecole_id}/direction/{direction}`
- `GET /api/annee/ecole/{ecole_id}/direction/{direction}`

Aucune nouvelle table ni migration n'est nécessaire pour cette fonctionnalité.
