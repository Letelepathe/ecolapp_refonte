# Listes d'élèves et impression financière

- Ajout de la colonne `Type d'élève` dans les listes du secondaire, du primaire
  et de la maternelle.
- Résolution centralisée du libellé du type, compatible avec une relation déjà
  incluse dans l'élève ou avec son identifiant `type_eleve_id`.
- Ajout d'un aperçu d'impression commun aux paiements en ordre et aux paiements
  avec dette pour les trois cycles.
- L'impression peut porter sur toutes les classes ou une classe précise, toutes
  les dates, un jour précis ou une période.
- Les critères sont validés avant l'ouverture de l'impression et un message
  explicite est affiché lorsqu'aucun paiement ne correspond.
- Aucun endpoint ni schéma de base de données supplémentaire n'est requis.
