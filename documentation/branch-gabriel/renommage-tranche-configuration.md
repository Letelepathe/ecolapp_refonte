# Renommage d'une tranche depuis sa configuration

## Modification

Le champ `Nom` n'est plus désactivé lors de la configuration d'une tranche existante. Le comportement est partagé par le secondaire, le primaire et la maternelle via `GestionTranches`.

À l'enregistrement :

1. une tranche nouvelle est créée comme auparavant ;
2. pour une tranche existante, son nom est enregistré avec `PUT /api/tranche/edit/{id}` ;
3. les montants, le motif, l'année et les règles par type sont ensuite enregistrés par l'API de configuration financière.

Une configuration au statut `Clôturée` reste entièrement protégée et ne peut donc pas être renommée. Cette protection conserve l'intégrité de l'historique financier.

## Test local conseillé

- ouvrir la liste des tranches dans chacun des trois cycles ;
- configurer une tranche non clôturée ;
- modifier son nom et enregistrer ;
- vérifier le nouveau nom dans la liste puis rouvrir la configuration ;
- vérifier qu'une tranche clôturée reste en lecture seule.

Cette version est préparée pour un test local et n'est pas déployée automatiquement.
