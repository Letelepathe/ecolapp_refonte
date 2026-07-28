# Impression du reçu et logo de l'école

- Le reçu utilise maintenant le logo de l'école associée au paiement.
- Le logo Ecolapp reste utilisé lorsque l'école n'a pas de logo ou si son image
  ne peut pas être chargée.
- La résolution de l'école et de son logo est centralisée dans
  `src/services/ecoles/ecoleAssets.js`.
- La fenêtre d'impression reçoit une copie avec styles calculés, puis attend les
  feuilles CSS, les polices, les images et deux cycles de mise en page.
- L'aperçu, l'impression et le téléchargement PDF conservent ainsi le même
  modèle visuel.
- Le backend expose le logo par `GET /api/ecoles/{ecole}/logo`, avec vérification
  du fichier et cache HTTP.
