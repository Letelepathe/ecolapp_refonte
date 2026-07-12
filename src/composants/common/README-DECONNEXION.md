# Déconnexion avec confirmation

Ce composant standardise l'expérience de déconnexion dans Ecolapp.

## Chemin

```text
src/composants/common/DeconnexionAvecConfirmation.jsx
```

## Objectif

Éviter la déconnexion automatique sans confirmation et réduire la duplication de logique dans les espaces admin, cycles et parent.

## Props

```js
<DeconnexionAvecConfirmation
  redirection="/"
  champs={["userId"]}
/>
```

- `redirection` : route vers laquelle l'utilisateur est redirigé après confirmation.
- `champs` : clés `localStorage` à vider.

## Utilisations actuelles

```text
src/composants/AdminGeneral/DeconnexionAdmin.jsx
src/composants/Ecoles/secondaire/Users/Activites/Deconnexion.jsx
src/composants/Ecoles/primaire/Users/Activites/Deconnexion.jsx
src/composants/Ecoles/maternelle/Users/Activites/Deconnexion.jsx
src/composants/Parent/DeconnexionParent.jsx
```

## Routes concernées

```text
/admin-general/deconnexion
/secondaire/deconnexion
/primaire/deconnexion
/maternelle/deconnexion
/parent/deconnexion
```

## Utilisation

1. L'utilisateur clique sur `Déconnexion`.
2. Une boîte de dialogue s'affiche.
3. `Annuler` revient à la page précédente.
4. `Oui, me déconnecter` vide les clés demandées puis redirige.
