# Formats d'impression des reçus de paiement

## Formats disponibles

- POS 58 mm
- POS 80 mm
- A6
- A5
- A4

Le format se choisit dans la modal d'aperçu du reçu. La préférence est mémorisée dans le navigateur pour chaque école et s'applique à l'impression comme au PDF téléchargé.

Les formats POS conservent l'identité visuelle du reçu administratif : couleurs, logo, badge, blocs et hiérarchie. Seules la largeur, la disposition et les dimensions sont adaptées au rouleau. Une imprimante thermique monochrome convertira elle-même les couleurs en nuances de gris.

## Impression Bluetooth sur téléphone

L'application prépare le reçu à la bonne largeur puis ouvre l'impression système du navigateur. Sur Android ou iOS, l'imprimante Bluetooth doit être installée et reconnue par le service d'impression du téléphone ou par l'application du fabricant. Le navigateur ne communique pas directement avec tous les protocoles propriétaires des imprimantes thermiques.

En cas d'absence de service d'impression compatible, l'utilisateur peut télécharger le PDF au format POS choisi puis l'ouvrir dans l'application fournie avec l'imprimante.

## Architecture

Les profils sont centralisés dans `src/services/impression/formatsRecuPaiement.js`. Le composant de reçu reçoit uniquement l'identifiant du format, tandis que les utilitaires génériques d'impression acceptent désormais les dimensions standards et personnalisées.

Cette modification concerne les reçus de paiement. L'impression des cartes d'élèves reste inchangée.
# LisibilitÃ© des tickets POS

Les formats POS 58 et 80 mm utilisent une hauteur calculÃ©e selon le contenu afin d'Ã©viter les tickets inutilement longs et la rÃ©duction automatique du texte. Le logo est conservÃ©. Les textes sont renforcÃ©s, l'adresse de l'Ã©cole est affichÃ©e et un lien `Localiser l'Ã©cole` ouvre sa position ou son adresse dans Google Maps.

Le rendu POS est strictement noir et blanc pour les imprimantes thermiques. Le logo est converti en niveaux de gris et un QR code compact contient l'URL Google Maps construite depuis les coordonnÃ©es de l'Ã©cole lorsqu'elles existent, sinon depuis son adresse complÃ¨te.

Le QR contient maintenant le numÃ©ro du reÃ§u, l'Ã©cole, l'Ã©lÃ¨ve, le matricule, la classe, l'annÃ©e, le motif, la tranche, le mode, le montant, la date, l'encaisseur, l'imprimeur et la localisation. La mise en page place les libellÃ©s et valeurs sur la mÃªme ligne, retire le badge `PAYÃ‰` et supprime les espaces verticaux inutiles.

L'adresse, le lien de localisation et le QR d'authentification sont Ã©galement affichÃ©s sur les formats A4, A5 et A6. Leur taille est adaptÃ©e au papier, tandis que la prÃ©sentation thermique compacte reste rÃ©servÃ©e aux formats POS.

L'impression POS utilise dÃ©sormais le HTML directement au lieu d'une capture bitmap. Le texte reste vectoriel, net et Ã  sa taille rÃ©elle dans le dialogue d'impression. Les polices POS sont augmentÃ©es, les libellÃ©s raccourcis et le QR est placÃ© en bas du ticket. Les impressions A4, A5 et A6 conservent leur moteur existant.

Dans le pied du ticket, la date POS utilise un format court, et les valeurs `Date`, `Imprime par` et `Percu par` utilisent une taille renforcÃ©e avec des libellÃ©s et deux-points clairement visibles.

Sans backend, le QR embarque un contenu autonome compact avec des clÃ©s courtes (`R`, `E`, `A`, `EL`, `MAT`, `CL`, `AN`, `MO`, `TR`, `MP`, `MT`, `D`, `ENC`, `IMP`). Cette rÃ©duction amÃ©liore la lecture sur une imprimante thermique. L'adresse est agrandie, la signature est rapprochÃ©e, une ligne discontinue sÃ©pare le QR et le ticket se termine par `Genere par ecolapp.cd`.

Tous les textes visibles conservent maintenant l'orthographe franÃ§aise UTF-8, notamment `Ã‰lÃ¨ve`, `AnnÃ©e`, `ImprimÃ© par`, `PerÃ§u par`, `Ã©cole`, `reÃ§u` et `GÃ©nÃ©rÃ© par ecolapp.cd`.
