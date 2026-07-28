# Backend Laravel : intégration et tests

Backend concerné : `api-ecolappMis/api`.

## Ce qui a été ajouté

- `type_eleves` : types propres à une école et une direction, actifs/inactifs et un type par défaut.
- `type_eleve_id` nullable sur `eleves` et `inscriptions` : les anciennes données restent valides.
- configuration financière sur `tranches` : motif, année, montant, devise, ordre, échéance informative et statut.
- `reglements_payement` : montant ou non-applicabilité d'une tranche selon le type d'élève.
- calcul serveur de la situation financière d'un élève.
- validation du paiement avec le vrai solde de la tranche.
- correction des paramètres école/direction des anciennes routes « en ordre » et « avec dette ».

Les migrations sont additives : elles ne suppriment ni élève, ni inscription, ni paiement, ni tranche existante.

## API disponibles

### Types d'élèves

- `GET|POST /api/ecoles/{ecole}/directions/{direction}/types-eleves`
- `PUT /api/types-eleves/{type}`
- `GET|PUT /api/eleves/{eleve}/type-eleve`
- `GET|PUT /api/inscriptions/{inscription}/type-eleve`

Le premier type créé devient automatiquement le type par défaut. Ajouter
`?inclure_inactifs=1` pour l'administration.

### Tranches et règles

- `GET /api/ecoles/{ecole}/directions/{direction}/tranches-reglements?annee_id={annee}`
- `GET|PUT /api/tranches/{tranche}/reglements-payement`

Le serveur refuse notamment : une devise différente de celle du motif, un
ordre dupliqué, une somme supérieure au motif, un type d'une autre école et un
montant de type supérieur à la tranche.

### Situation et paiement

- `GET /api/eleves/{eleve}/situation-financiere?motif_id={motif}&annee_id={annee}`
- `POST /api/paiement/create`

L'échéance produit un statut informatif mais ne bloque jamais l'encaissement.

## Tester en local

Ne pas commencer sur la base en ligne. Dupliquer d'abord la base.

Le frontend utilise maintenant l'API par défaut. Pour revenir temporairement au
stockage navigateur pendant un diagnostic seulement :

```env
VITE_TYPES_ELEVES_REPOSITORY=browser
VITE_REGLEMENTS_TRANCHES_REPOSITORY=browser
```

```powershell
cd D:\gabriel\programmationWeb\projets\projetNextJs\nextjs\cria\ecolapp\api-ecolappMis\api
composer install
Copy-Item .env.example .env
php artisan key:generate
```

Configurer dans `.env` la copie locale de MySQL, puis :

```powershell
php artisan migrate:status
php artisan migrate --pretend
php artisan migrate
php artisan route:list
php artisan test
php artisan serve
```

Dans le frontend, définir l'URL API locale dans la configuration
d'environnement prévue par le projet, puis :

```powershell
npm install
npm start
```

Parcours fonctionnel minimal :

1. créer `Ordinaire`, puis `Enfant enseignant` ;
2. confirmer une inscription avec un type ;
3. répartir un motif sur deux tranches ;
4. personnaliser une tranche pour le second type ;
5. vérifier la situation financière ;
6. payer exactement le solde, puis essayer de le dépasser ;
7. vérifier que les anciens élèves et paiements sont toujours présents.

## Déployer en ligne

1. sauvegarder la base et les fichiers ;
2. déployer le code backend ;
3. exécuter `php artisan migrate --pretend` et relire le SQL ;
4. exécuter `php artisan migrate --force` ;
5. exécuter `php artisan optimize:clear` ;
6. tester avec une école pilote avant d'activer le frontend pour toutes les écoles ;
7. conserver l'ancien mode du frontend tant que les API ne sont pas validées.

Ne jamais exécuter `migrate:fresh`, `db:wipe` ou un rollback global en
production.

## Vérification encore nécessaire

La machine utilisée pour cette intégration ne fournit pas actuellement
l'exécutable `php` dans le `PATH`. La syntaxe et les routes Laravel doivent donc
être contrôlées avec les commandes ci-dessus avant toute migration.
