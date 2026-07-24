# Dashboard, sidebars et menus par rôle

Ce dossier contient les composants communs des tableaux de bord.

## Chemin

```text
src/composants/common/TableauDeBord
```

## Fichiers importants

```text
menusTableauBord.js             Définitions des menus admin général et école
SidebarEcole.jsx                Sidebar des administrateurs d'école
SidebarUtilisateurEcole.jsx     Sidebar des utilisateurs d'école selon rôle
BarreLaterale.jsx               Rendu visuel générique de la sidebar
BureauEcole.jsx                 Dashboard école commun
CarteStat.jsx                   Carte statistique
NavHautDashboard.jsx            Barre supérieure dashboard
```

## Organisation des menus école

Les groupes sont organisés par utilité :

- Vue générale.
- Comptes & accès.
- Cycle scolaire.
- Communications.
- Enseignants.
- Élèves.
- Cours & horaires.
- Finances & paiements.
- Structure scolaire.
- Personnel & rôles.
- Suivi & rapports.

## Nouveaux liens QR

Dans les menus école :

```text
Cartes élèves QR       /:cycle/cartes_eleves
Présences du jour & scan QR   /presence-qr
Cartes personnel QR    /:cycle/cartes_personnel
```

## Menus par rôle utilisateur

`SidebarUtilisateurEcole.jsx` distingue notamment :

- Administrateur / super administrateur : accès au menu école complet.
- Enseignant : cours, cotes, travaux, titularisation si applicable.
- Élève : classe, parcours scolaire, travaux.
- Comptable / caissier / financier : accès aux menus finance.
- Secrétaire / secrétariat : dossiers élèves, inscriptions, cartes élèves QR et scanner de présence.

## Ajouter un nouveau rôle

1. Normaliser le nom du rôle dans `SidebarUtilisateurEcole.jsx`.
2. Ajouter le rôle dans la liste adaptée.
3. Ajouter un bloc de menus ciblés.
4. Éviter de donner le menu administrateur complet si le rôle n'est pas administratif.

## Ajouter un nouveau lien de menu

Utiliser le helper :

```js
lien("/route", "Label", Icone)
```

Puis l'ajouter dans le groupe métier approprié.
