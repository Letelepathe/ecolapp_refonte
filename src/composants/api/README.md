# Configuration API globale

Ce dossier contient la configuration centralisée des URLs API et publiques du projet.

## Fichier principal

```text
src/composants/api/api.js
```

## Objectif

Éviter de coder de nouvelles URLs en dur dans les composants et faciliter le développement local comme la production.

## Variables exposées

- `API_BASE_URL` : URL de base des endpoints API.
  - En local : `http://localhost:8000/api`
  - En production : `https://api.ecolapp.cd/api`
- `PUBLIC_BASE_URL` : URL de base des fichiers publics.
  - En local : `http://localhost:8000`
  - En production : `https://api.ecolapp.cd`
- `api` : instance Axios avec `baseURL` déjà configurée.
- `urlPublic(chemin)` : construit une URL publique pour les images, documents, vidéos et fichiers.
- `messageErreur(erreur, fallback)` : extrait un message lisible depuis une réponse API.
- `installerConfigurationApi()` : installe un intercepteur global Axios.

## Utilisation recommandée

### Nouvelle requête API

```js
import { api, messageErreur } from "../api/api";

try {
  const response = await api.get("/ecole");
} catch (error) {
  setErreur(messageErreur(error, "Impossible de charger les écoles."));
}
```

### Fichier public

```js
import { urlPublic } from "../api/api";

const photo = urlPublic(`public/imgUser/${user.file}`);
```

## Intercepteur global

L'intercepteur global est activé dans :

```text
src/main.jsx
```

Il normalise les anciennes URLs comme :

```text
https://api.ecolapp.cd/api
https://api.ecolapp.com/api
http://localhost:8000/api
http://localhost/ecole-app/apis
```

vers la bonne URL selon l'environnement.

## Bonnes pratiques

### Limitation globale des appels

`installerConfigurationApi()` installe aussi un rate limiter sur Axios et sur l'instance `api`.
Il conserve toutes les routes existantes et agit uniquement dans le navigateur :

- six requêtes au maximum peuvent être actives simultanément ;
- les départs sont espacés de 120 ms afin d'absorber les rafales ;
- les requêtes supplémentaires attendent dans une file FIFO ;
- après 30 secondes d'attente, une erreur lisible demande à l'utilisateur de réessayer ;
- une requête annulée avec `AbortController` est retirée avant son envoi.

Les valeurs sont exposées par `CONFIGURATION_RATE_LIMITER` dans `api.js`. Une requête non-API
exceptionnelle peut ignorer la file avec l'option Axios `{ ecolappRateLimiter: false }`.

- Pour tout nouveau composant, utiliser `api.get`, `api.post`, `api.put`, `api.delete`.
- Pour les erreurs, utiliser `messageErreur()`.
- Pour les images et fichiers publics, utiliser `urlPublic()`.
- Éviter d'ajouter de nouvelles URLs `https://api.ecolapp.cd/api` directement dans les composants.
