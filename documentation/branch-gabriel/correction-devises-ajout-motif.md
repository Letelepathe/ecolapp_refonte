# Devises dans l’ajout d’un motif

## Correction

Les formulaires d’ajout d’un motif des cycles secondaire, primaire et maternelle chargent maintenant les devises avec l’école et la direction actives :

`GET /api/devise/ecole/{ecole_id}/direction/{direction}`

La valeur contrôlée du sélecteur utilise désormais la propriété correcte `devise_id`.

## Résultat attendu

- seules les devises de l’établissement et du cycle connectés sont proposées ;
- la devise choisie reste visible dans le formulaire ;
- aucune modification du backend ou de la base de données n’est nécessaire.
