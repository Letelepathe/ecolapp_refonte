# Espace présence QR

L'espace présence QR sert à pointer l'arrivée et le départ des élèves ou du personnel à partir des cartes QR.

## Chemin

```text
src/composants/common/PresenceQr.jsx
```

## Route

```text
/presence-qr
```

## Fonctionnement

- Un QR code contient un payload JSON avec `type`, `id`, `matricule`, `nom`, `ecole_id` et `direction`.
- Le premier scan d'une personne dans la journée crée un pointage d'arrivée.
- Le second scan du même QR dans la journée complète le pointage avec l'heure de départ.
- Les données sont conservées localement pendant la journée.
- Une copie de secours est écrite dans un cookie.
- Une synchronisation manuelle est disponible.
- Une synchronisation automatique est programmée en fin de journée.

## Stockage local

Clé `localStorage` :

```text
ecolapp_presences_YYYY-MM-DD
```

Cookie :

```text
ecolapp_presences_YYYY-MM-DD
```

## Endpoint de synchronisation

Le composant réutilise la route Laravel déjà appelée par les tableaux de présence avec cases à cocher :

```text
POST /presences/create
```

Payload :

```json
{
  "presences": [
    {
      "eleve_id": 1,
      "date_presence": "2026-07-12",
      "ecole_id": 1,
      "direction": 2,
      "present": 1,
      "motif_absence": null
    }
  ]
}
```

## Utilisation avec caméra

1. Aller sur `/presence-qr`.
2. Cliquer sur `Caméra téléphone` ou `Scanner en direct`.
3. Présenter le QR code devant la caméra.
4. Vérifier le message de confirmation.

## Utilisation avec lecteur QR USB

1. Brancher le lecteur QR.
2. Cliquer dans le champ `Saisie manuelle / lecteur USB`.
3. Scanner la carte.
4. Le lecteur saisit le contenu et valide avec Entrée.

## Limites connues

- La caméra directe utilise `html5-qrcode` et conserve `BarcodeDetector` en solution de secours.
- Le bouton `Caméra téléphone` ouvre la caméra système lorsque la caméra web est limitée.
- La route `/presences/create` existante enregistre les présences des élèves. Les arrivées/départs du personnel restent locaux tant qu'aucune route Laravel correspondante n'est présente dans le projet front.
