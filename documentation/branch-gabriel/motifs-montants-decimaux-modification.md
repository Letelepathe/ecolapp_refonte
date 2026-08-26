# Motifs : décimales et modification

- `motifs.montant` utilise `DECIMAL(12,2)` afin de conserver les centimes.
- Les saisies `20.5` et `20,5` sont normalisées en `20.50`.
- Le formulaire et la liste sont partagés entre les trois cycles.
- La liste propose **Modifier** et **Supprimer** avec confirmation.
- La suppression reste logique : l’historique est conservé.
- Un montant ne peut pas descendre sous le maximum déjà réparti dans les tranches d’une année.
- Une devise ne peut plus changer lorsque des tranches utilisent le motif.

API utilisées : `POST /api/motif/create`, `PUT /api/motif/edit/{motif}` et `GET /api/motif/delete/{id}`.
