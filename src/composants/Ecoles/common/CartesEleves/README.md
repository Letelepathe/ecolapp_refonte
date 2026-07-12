# Cartes élèves QR

Ce module génère des cartes d'élèves imprimables avec QR code personnel.

## Chemin

```text
src/composants/Ecoles/common/CartesEleves
```

## Routes

```text
/secondaire/cartes_eleves
/primaire/cartes_eleves
/maternelle/cartes_eleves
```

## Fichiers importants

```text
CartesEleves.jsx        Page principale du module
useCartesEleves.js      Chargement élèves/classes/options et export PDF
CarteEleve.jsx          Design d'une carte élève
PhotoEleve.jsx          Affichage photo ou avatar par défaut
outilsCarte.js          Helpers de données, photo, QR et formatage
ModalApercuCartes.jsx   Aperçu avant impression/téléchargement
TableEleves.jsx         Tableau de sélection
FiltresCartes.jsx       Recherche et filtres classe/option
BarreActions.jsx        Actions de sélection et génération
```

## Fonctionnalités

- Chargement des informations école, classes, options et élèves.
- Recherche par nom, prénom ou matricule.
- Filtrage par classe et option.
- Sélection individuelle ou groupée.
- Aperçu avant impression.
- Export PDF.
- QR code personnel sur chaque carte.
- Style professionnel pour impression.

## Contenu du QR code

Le QR code est généré par `payloadQrEleve(eleve, ecole)` dans :

```text
outilsCarte.js
```

Payload JSON :

```json
{
  "type": "eleve",
  "id": "ID_ELEVE",
  "matricule": "MATRICULE",
  "nom": "NOM COMPLET",
  "ecole_id": "ID_ECOLE",
  "direction": "DIRECTION",
  "classe_id": "ID_CLASSE",
  "option_id": "ID_OPTION"
}
```

## Utilisation

1. Aller dans le dashboard du cycle.
2. Ouvrir `Cartes élèves QR`.
3. Filtrer si nécessaire.
4. Sélectionner les élèves.
5. Cliquer sur `Générer aperçu`.
6. Imprimer ou télécharger les cartes.

## Lien avec la présence

Le QR code peut être scanné dans :

```text
/presence-qr
```

Le premier scan de la journée enregistre l'arrivée, le deuxième scan enregistre le départ.
