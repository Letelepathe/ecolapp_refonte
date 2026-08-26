# Correction de la création des années scolaires

## Problème

Le backend imposait une unicité globale sur le nom de l’année scolaire. Une année déjà créée dans une école ou au secondaire empêchait donc sa création au primaire ou à la maternelle.

## Correction

- L’unicité est maintenant limitée à `name + ecole_id + direction`.
- Le formulaire commun utilise explicitement le cycle de la page, au lieu d’une direction potentiellement périmée dans le navigateur.
- Les erreurs de validation retournées par Laravel sont affichées clairement.
- Le même composant est partagé entre secondaire, primaire et maternelle.

## API concernée

`POST /api/annee/create`

Corps attendu :

```json
{
  "name": "2026-2027",
  "ecole_id": 1,
  "direction": "primaire"
}
```

Une même année peut être créée dans plusieurs écoles ou directions, mais pas deux fois dans la même école et la même direction.

La direction envoyée à l’API respecte le schéma historique : maternelle `1`, primaire `2`, secondaire `3`. Les noms de cycles restent utilisés uniquement dans les routes du frontend.
