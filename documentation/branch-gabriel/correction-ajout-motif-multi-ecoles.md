# Correction de l’ajout des motifs

`MotifsController::store` accepte le même nom de motif dans des écoles ou directions différentes. Dans une même école et direction, un motif désactivé portant le même nom est réactivé et son montant ainsi que sa devise sont actualisés.

La devise sélectionnée doit être active et appartenir à la même école et à la même direction. Le montant doit être numérique et positif ou nul.

Les formulaires secondaire, primaire et maternelle affichent désormais le message précis renvoyé par l’API. La propriété incorrecte `erroList` n’est plus utilisée.

Cette correction ne supprime et ne modifie aucun paiement historique.
