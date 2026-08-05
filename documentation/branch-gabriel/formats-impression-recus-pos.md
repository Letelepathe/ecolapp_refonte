# Formats d'impression des reçus de paiement

## Formats disponibles

- POS 58 mm
- POS 80 mm
- A6
- A5
- A4

Le format se choisit dans la modal d'aperçu du reçu. La préférence est mémorisée dans le navigateur pour chaque école et s'applique à l'impression comme au PDF téléchargé.

Les formats POS utilisent une présentation compacte, contrastée et adaptée aux imprimantes thermiques. Les formats papier conservent la présentation administrative du reçu avec des dimensions adaptées.

## Impression Bluetooth sur téléphone

L'application prépare le reçu à la bonne largeur puis ouvre l'impression système du navigateur. Sur Android ou iOS, l'imprimante Bluetooth doit être installée et reconnue par le service d'impression du téléphone ou par l'application du fabricant. Le navigateur ne communique pas directement avec tous les protocoles propriétaires des imprimantes thermiques.

En cas d'absence de service d'impression compatible, l'utilisateur peut télécharger le PDF au format POS choisi puis l'ouvrir dans l'application fournie avec l'imprimante.

## Architecture

Les profils sont centralisés dans `src/services/impression/formatsRecuPaiement.js`. Le composant de reçu reçoit uniquement l'identifiant du format, tandis que les utilitaires génériques d'impression acceptent désormais les dimensions standards et personnalisées.

Cette modification concerne les reçus de paiement. L'impression des cartes d'élèves reste inchangée.
