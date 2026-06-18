# Ecolapp

Ecolapp est une application web de gestion scolaire construite avec React et Vite. Elle regroupe les espaces publics, parents, élèves, enseignants, administrations d’écoles et administration générale.

## Fonctionnalités principales

- Gestion des écoles, provinces et provinces éducationnelles.
- Espaces séparés pour la maternelle, le primaire et le secondaire.
- Gestion des élèves, enseignants, classes, cours, horaires, cotes, paiements et communiqués.
- Génération des cartes d’élèves et ajout groupé d’élèves.
- Interfaces de connexion unifiées pour les administrateurs, utilisateurs d’école et parents.
- Tableaux, cartes dashboard, sidebars et formulaires alignés sur une charte visuelle bleue uniforme.

## Charte UI

- Le style global est centralisé dans `src/css/style-uniforme.css`.
- Les composants ne doivent pas contenir de CSS inline statique ni de balises `<style>`.
- Les sidebars doivent utiliser les composants communs du dossier `src/composants/common/TableauDeBord`.
- Les pages de connexion doivent utiliser `src/composants/common/LoginRefonte.jsx`.
- Les nouvelles interfaces doivent privilégier des cartes blanches, des bordures douces, des ombres légères et la couleur principale `#2563eb`.

## Structure utile

- `src/App.jsx` : routes de l’application.
- `src/css/style-uniforme.css` : feuille de style unique de l’application.
- `src/composants/common` : composants réutilisables.
- `src/composants/common/TableauDeBord` : sidebars, topbars, cartes dashboard et menus.
- `src/composants/Ecoles` : parcours public des écoles et espaces par direction.
- `src/composants/AdminGeneral` : administration générale.
- `src/composants/Parent` : espace parent.

## Installation

```bash
npm install
```

## Lancement en développement

```bash
npm run dev
```

## Build de production

```bash
npm run build
```

## Bonnes pratiques de développement

- Écrire les nouveaux noms de variables et composants métier en français quand c’est possible.
- Ajouter les styles dans `src/css/style-uniforme.css`.
- Réutiliser les composants communs avant de créer une nouvelle variante.
- Éviter les emojis dans l’interface métier ; utiliser `react-icons` ou Bootstrap Icons.
- Garder les tableaux lisibles : titres clairs, padding régulier, hover doux et pagination quand la liste est longue.
