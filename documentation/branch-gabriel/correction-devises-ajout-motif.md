# Devises dans l’ajout d’un motif

## Correction

Les formulaires d’ajout d’un motif des cycles secondaire, primaire et maternelle chargent maintenant les devises avec l’école et la direction actives :

`GET /api/devise/ecole/{ecole_id}/direction/{direction}`

La valeur contrôlée du sélecteur utilise désormais la propriété correcte `devise_id`.

## Résultat attendu

- seules les devises de l’établissement et du cycle connectés sont proposées ;
- la devise choisie reste visible dans le formulaire ;
- aucune modification de la structure de la base de données n’est nécessaire.

## Correction backend complémentaire

`DevisesController::store` applique maintenant l’unicité du nom dans le périmètre de l’école et de la direction. Une devise précédemment désactivée est réactivée au lieu de créer un doublon. Une nouvelle devise reçoit explicitement le statut actif `1`.

Quand aucune devise active n’existe, le formulaire d’ajout d’un motif affiche un lien direct vers **Ajouter une devise**.
