# Champs facultatifs de l'inscription élève

## Objectif

La date de naissance, le lieu de naissance, le pourcentage obtenu et l'école de provenance ne bloquent plus une inscription lorsqu'ils ne sont pas connus. Une valeur renseignée reste contrôlée.

## Frontend

- Ajout direct par l'administration : date et lieu de naissance facultatifs dans le formulaire partagé par les trois cycles.
- Inscription publique : date et lieu facultatifs en secondaire, primaire et maternelle.
- Pourcentage facultatif dans les formulaires où ce champ existe (secondaire et transfert primaire).
- École de provenance facultative en secondaire et en maternelle. Elle reste obligatoire uniquement pour un transfert primaire explicite.
- Les valeurs vides sont envoyées à l'API sous la forme `null`.
- Le pourcentage accepte le point ou la virgule, puis est normalisé avec un point. Il doit rester compris entre 0 et 100.

## API Laravel

- `ElevesController::store` accepte une date et un lieu de naissance absents.
- `InscriptionsController::store` accepte une date, un lieu et un pourcentage absents.
- `InscriptionsController::store` accepte également une école de provenance absente.
- Une date fournie doit être valide et ne pas être future.
- Un pourcentage fourni doit être numérique et compris entre 0 et 100.

## Base de données

La migration `2026_08_07_000001_make_student_birth_and_percent_optional.php` rend uniquement nullable :

- `eleves.lieu_de_naissance` ;
- `eleves.date_naissance` ;
- `inscriptions.percent`.
- `inscriptions.ecole_provenance` via la migration complémentaire `2026_08_07_000002_make_school_origin_optional.php`.

Elle ne supprime ni ne modifie les données scolaires existantes. Au déploiement autorisé, exécuter `php artisan migrate --force` dans l'API.

## Déploiement

Le frontend, l'API et la migration doivent être déployés ensemble. Aucun déploiement n'est effectué sans validation explicite.
