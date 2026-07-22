# Cartes personnel QR

Ce module génère des cartes professionnelles avec QR code pour les membres du personnel.

## Chemin

```text
src/composants/Ecoles/common/CartesPersonnel
```

## Routes

```text
/secondaire/cartes_personnel
/primaire/cartes_personnel
/maternelle/cartes_personnel
```

## Fichiers importants

```text
CartesPersonnel.jsx   Composant principal commun
```

Wrappers par cycle :

```text
src/composants/Ecoles/secondaire/Administration/CartesPersonnel.jsx
src/composants/Ecoles/primaire/Administration/CartesPersonnel.jsx
src/composants/Ecoles/maternelle/Administration/CartesPersonnel.jsx
```

## Fonctionnalités

- Charge le personnel de l'école courante et de la direction courante.
- Affiche un tableau de sélection.
- Génère une carte par agent sélectionné.
- Ajoute un QR code personnel.
- Permet l'impression de la sélection.

## Contenu du QR code

Payload JSON :

```json
{
  "type": "personnel",
  "id": "ID_UTILISATEUR",
  "matricule": "MATRICULE_OU_EMAIL",
  "nom": "NOM COMPLET",
  "role": "FONCTION_OU_ROLE",
  "ecole_id": "ID_ECOLE",
  "direction": "DIRECTION"
}
```

## Utilisation

1. Aller dans le dashboard du cycle.
2. Ouvrir `Cartes personnel QR`.
3. Sélectionner les agents.
4. Cliquer sur `Imprimer la sélection`.
5. Remettre la carte imprimée à chaque membre du personnel.

## Lien avec la présence

Les cartes personnel sont compatibles avec :

```text
/presence-qr
```

Premier scan : arrivée. Deuxième scan : départ.
