# Adaptation de la maternelle à la réalité de la RDC

## Sources métier

Cette adaptation repose sur le Programme national de l'enseignement maternel publié par le ministère congolais :

- programme destiné aux enfants de 3 à 5 ans ;
- cycle organisé en trois années/niveaux ;
- apprentissage centré sur les activités, les jeux et cinq compétences de base ;
- évaluation continue des connaissances pendant les activités ;
- évaluation des compétences à la fin de chaque trimestre ;
- outils recommandés : portfolio, grille d'observation, grille d'appréciation, fiche et bilan des compétences.

Sources :

- https://edu-nc.gouv.cd/programmes-nationaux
- https://edu-nc.gouv.cd/wp-content/uploads/2023/06/RECUEIL-DE-NORMES-DE-LENSEIGNEMENT-PRESCOLAIRE-EN-REPUBLIQUE-DEMOCRATIQUE-DU-CONGO-06.06.2022-FINAL.pdf

## Changements frontend

- Ajout des trois niveaux maternels dans la configuration partagée :
  - 1re année maternelle, 3 ans ;
  - 2e année maternelle, 4 ans ;
  - 3e année maternelle, 5 ans.
- Validation de l'âge entre 3 et 5 ans.
- Suppression visuelle des options et sections dans les flux maternels.
- Inscription simplifiée : aucune école de provenance ni aucun pourcentage n'est demandé.
- Le code parent reste facultatif.
- Les « cours » deviennent des « activités d'éveil ».
- Le « titulaire » devient un « éducateur titulaire ».
- Les filtres d'option sont retirés des élèves et des paiements.
- Les semestres visibles deviennent des trimestres.
- Les résultats sont présentés comme suivi continu, bilan trimestriel et bilan annuel des compétences.
- Les périodes ne sont plus proposées dans le menu administratif maternel.

## Architecture et compatibilité

Les différences entre secondaire, primaire et maternelle sont centralisées dans `src/config/cyclesScolaires.js`. Les écrans partagés lisent :

- `ageMinimum` et `ageMaximum` ;
- `utiliseOptions` et `utiliseSections` ;
- `utilisePeriodes` ;
- `modeEvaluation` ;
- les libellés du cycle ;
- les niveaux et domaines d'activités.

Le formulaire public maternel est placé dans `src/composants/Ecoles/common/Inscriptions/InscriptionMaternelle.jsx`. Le fichier du cycle reste un wrapper léger afin de respecter les routes et l'architecture actuelle.

Le backend actuel exige encore `options_id`. Le frontend sélectionne uniquement une option technique neutre telle que `Sans option - Maternelle`. S'il n'en trouve pas, il bloque l'enregistrement au lieu d'associer l'enfant à une mauvaise option.

## Backend nécessaire

### Structure

- Rendre `options_id` nullable pour le cycle maternel.
- Ajouter `cycle`, `niveau` et `division` aux classes.
- Contraindre le niveau maternel aux valeurs 1, 2 et 3.
- Valider l'âge en fonction de la date de rentrée scolaire, pas seulement de la date courante.

### Inscription

- Accepter `ecole_provenance`, `percent` et `code_parent` comme champs facultatifs.
- Retourner les règles d'âge et les niveaux via l'API de configuration de l'école.
- Ne pas prendre le navigateur comme autorité finale de validation.

### Évaluation des compétences

Le modèle actuel de cotes numériques du secondaire ne suffit pas. Ajouter :

- `domaines_competence` ;
- `competences` reliées au niveau maternel ;
- `observations_competence` avec élève, trimestre, éducateur, appréciation et commentaire ;
- `portfolios` et pièces jointes ;
- une échelle configurable, par exemple `non_observe`, `en_cours`, `acquis`, `maitrise`.

API proposée :

- `GET /api/maternelle/domaines?ecole_id=&niveau=`
- `GET /api/maternelle/competences?niveau=`
- `GET /api/maternelle/eleves/{id}/bilan?annee_id=&trimestre_id=`
- `PUT /api/maternelle/eleves/{id}/observations`
- `POST /api/maternelle/eleves/{id}/portfolio`

Le backend devra générer un bilan qualitatif et conserver l'historique des observations. Les anciennes routes de cotes doivent rester disponibles pendant la migration afin de ne pas perdre les données existantes.

## Migration sûre

1. Ajouter les nouvelles tables sans supprimer les cotes actuelles.
2. Activer le nouveau modèle seulement pour les directions de cycle maternel.
3. Faire fonctionner temporairement les deux formats.
4. Migrer ou archiver les anciennes cotes après validation par chaque école.
5. Ne supprimer aucune donnée historique automatiquement.
