# Numéro séquentiel du reçu par école

Chaque école et chaque cycle possèdent leur propre numérotation permanente :
01, 02, 03, etc. Cette numérotation ne redémarre pas lors d'un changement
d'année scolaire et un numéro supprimé n'est pas réutilisé.

La colonne `paiements.numero_recu` contient le numéro visible. La contrainte
unique `(ecole_id, direction, numero_recu)` empêche deux reçus identiques dans
un même cycle d'une école. La table `compteurs_recus_paiements` conserve le
prochain numéro de chaque couple école/cycle et le backend la verrouille
pendant l'enregistrement afin de supporter plusieurs caissiers simultanément.

Lors de l'installation, les paiements existants sont numérotés chronologiquement
dans leur propre couple école/cycle, en utilisant `created_at`, puis `id` pour
départager deux paiements simultanés. Ils conservent donc un affichage normal
`N°01`, `N°02`, etc. Le compteur de chaque couple commence ensuite juste après
son dernier paiement. L'affichage utilise au minimum deux chiffres, puis continue
naturellement avec `100`, `101`, etc.

L'API retourne le paiement créé et ses relations dans le champ canonique
`paiement`. Les anciens champs `Paiement` et `last_id` restent temporairement
présents pour les clients déjà déployés.

Le frontend vérifie que l'objet créé possède un `id`. Avec une ancienne API,
il recharge les détails en utilisant précisément `Paiement.id`, puis contrôle
que l'identifiant retourné est identique. Le tableau et le reçu affichent
`numero_recu`; le QR conserve également `paiements.id` pour la traçabilité.
