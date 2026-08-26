# Adaptation du cycle primaire à la réalité de la RDC

## Objectif

Le primaire ne doit plus être présenté comme une copie du secondaire. L'interface s'appuie maintenant sur une configuration centralisée par cycle et conserve la compatibilité avec les données et les routes déjà utilisées en production.

Aucune donnée existante n'est supprimée et aucun fichier du backend n'a été modifié.

## Comportement du frontend

- Le primaire utilise les niveaux de la 1re à la 6e primaire.
- L'âge minimum indicatif d'inscription est fixé à 6 ans.
- Une inscription distingue une première inscription, un transfert et une réinscription.
- L'école de provenance et le résultat précédent ne sont demandés que pour un transfert.
- Le code parent est facultatif.
- Les options et sections ne sont plus montrées dans la navigation primaire.
- Les formulaires d'élève, de branche et de titulaire n'exigent plus que l'utilisateur choisisse une option.
- Les cours sont présentés comme des « branches ».
- Le titulaire est présenté comme « titulaire de classe ».
- Les paiements et la liste des élèves se filtrent par classe, sans filtre d'option.
- Les écrans d'évaluation présentent les trimestres, tout en conservant les noms techniques attendus par l'API actuelle.

## Compatibilité temporaire

Le backend actuel exige encore `options_id` pour plusieurs opérations. Le frontend recherche donc automatiquement une option neutre dans cet ordre :

1. un nom contenant `Sans option` ;
2. un nom contenant `Primaire` ;
3. un nom contenant `Générale` ;
4. à défaut, l'enregistrement est bloqué avec un message de configuration afin de ne pas associer l'élève à une mauvaise option.

Pour une école primaire, il est conseillé de créer une option technique nommée `Sans option - Primaire`. Elle n'est pas présentée aux utilisateurs, mais permet de continuer à appeler l'API existante.

## Configuration réutilisable

Le fichier `src/config/cyclesScolaires.js` contient les capacités et les libellés propres à chaque cycle :

- utilisation des options ;
- utilisation des sections ;
- trimestres ou semestres ;
- âge minimum ;
- niveaux ;
- vocabulaire de classe, branche et titulaire.

Les nouveaux modules doivent lire cette configuration au lieu de recopier des conditions propres au primaire.

## Backend recommandé

Ces évolutions doivent être réalisées plus tard dans le backend, sans casser les écoles existantes :

### Structure scolaire

- Ajouter un champ `cycle` à l'école ou à la direction : `maternelle`, `primaire`, `secondaire`.
- Modéliser une classe par `niveau` et `division` : par exemple niveau `1`, division `A`.
- Rendre `options_id` nullable pour les élèves, inscriptions, branches, horaires et titulaires lorsque le cycle ne gère pas les options.
- Conserver les anciennes valeurs et relations pour le secondaire.

### Inscription

- Ajouter `type_admission` : `premiere_inscription`, `transfert`, `reinscription`.
- Rendre `ecole_provenance`, `resultat_precedent` et `code_parent` réellement facultatifs.
- Valider l'âge minimum à partir d'une règle configurable par cycle et année scolaire.
- Exposer les règles d'inscription par une route de configuration, au lieu de les figer dans le navigateur.

### Évaluation

- Ajouter une entité générique `sequence_evaluation` avec un type (`periode`, `trimestre`, `semestre`, `examen`) et un ordre.
- Éviter que le primaire soit obligé d'enregistrer un trimestre dans une table ou un champ nommé `semestre`.
- Permettre à l'école de configurer les pondérations et le calcul du bulletin selon les règles officielles applicables.

### API minimale attendue

- `GET /api/ecoles/{id}/configuration-scolaire`
- `GET /api/classes?ecole_id=&direction=&cycle=primaire`
- `POST /api/classes` avec `cycle`, `niveau`, `division`
- `POST /api/inscriptions` avec `type_admission` et champs conditionnels
- `POST /api/eleves` avec `options_id` nullable au primaire
- `POST /api/branches` avec `options_id` nullable au primaire
- `POST /api/titulaires` avec `classe_id`, sans option obligatoire au primaire
- `GET /api/evaluations/configuration?cycle=primaire`

## Migration sûre

La migration devra être additive :

1. ajouter les nouveaux champs comme nullables ;
2. remplir progressivement `cycle`, `niveau` et `division` à partir des données existantes ;
3. accepter temporairement les anciens et nouveaux formats d'API ;
4. connecter ensuite le frontend au nouveau format ;
5. ne supprimer les champs historiques qu'après validation et sauvegarde.

## Limite actuelle

Le frontend améliore la réalité métier et l'ergonomie, mais le calcul officiel des bulletins, les règles d'admission et l'intégrité des associations doivent être validés côté serveur. Le navigateur ne doit jamais être l'autorité finale pour ces règles.
