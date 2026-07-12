# Ecolapp — plateforme web de gestion scolaire

Ecolapp est une application web de gestion scolaire construite avec **React 18** et **Vite**. Elle regroupe un site public, une administration générale, des espaces d'écoles par cycle (**maternelle**, **primaire**, **secondaire**), des espaces utilisateurs (**administrateurs**, **enseignants**, **élèves**, **parents**) et des outils pédagogiques/administratifs comme les bulletins, les quiz, les paiements, les communiqués et les cartes QR.

## Sommaire

- [Stack technique](#stack-technique)
- [Installation et lancement](#installation-et-lancement)
- [Configuration API](#configuration-api)
- [Fonctionnalités principales](#fonctionnalités-principales)
- [Nouvelles fonctionnalités QR et présence](#nouvelles-fonctionnalités-qr-et-présence)
- [Chemins importants](#chemins-importants)
- [Routes principales](#routes-principales)
- [Règles UI et bonnes pratiques](#règles-ui-et-bonnes-pratiques)
- [Documentation spécifique des nouveautés](#documentation-spécifique-des-nouveautés)

## Stack technique

- **React 18** : construction des interfaces.
- **Vite** : serveur de développement et build de production.
- **React Router DOM** : navigation et routes de l'application.
- **Axios** : communication avec l'API.
- **Zustand** : store léger pour l'utilisateur connecté.
- **Bootstrap / Bootstrap Icons / React Icons** : composants visuels et icônes.
- **Recharts** : graphiques et statistiques.
- **html2canvas + jsPDF** : export PDF des cartes élèves.
- **vite-plugin-pwa** : configuration PWA et service worker.

## Installation et lancement

```bash
npm install
```

Lancement en développement :

```bash
npm run dev
```

Build de production :

```bash
npm run build
```

Prévisualisation du build :

```bash
npm run serve
```

## Configuration API

La configuration API globale se trouve dans :

```text
src/composants/api/api.js
```

Elle expose :

- `API_BASE_URL` : `http://localhost:8000/api` en local, sinon `https://api.ecolapp.cd/api`.
- `PUBLIC_BASE_URL` : `http://localhost:8000` en local, sinon `https://api.ecolapp.cd`.
- `api` : instance Axios réutilisable.
- `messageErreur()` : extraction de messages d'erreur lisibles.
- `urlPublic()` : construction d'URLs publiques pour images/fichiers.
- `installerConfigurationApi()` : intercepteur Axios global qui normalise les anciennes URLs.

Cette configuration est activée au démarrage dans :

```text
src/main.jsx
```

## Fonctionnalités principales

### Site public

Chemins :

```text
src/composants/Index
```

Fonctionnalités :

- Accueil.
- À propos.
- Services.
- Contact.
- Inscriptions.
- Conditions d'utilisation.
- Politique de confidentialité.

Routes :

- `/`
- `/apropos`
- `/services`
- `/contact`
- `/inscriptions`
- `/politique`
- `/conditions`

### Administration générale

Chemin :

```text
src/composants/AdminGeneral
```

Fonctionnalités :

- Connexion administrateur général.
- Tableau de bord général.
- Création d'administrateurs généraux et super administrateurs.
- Gestion des provinces.
- Gestion des provinces éducationnelles.
- Gestion des écoles.
- Création de super administrateurs d'écoles.
- Profil administrateur.
- Déconnexion avec confirmation.

Routes principales :

- `/admin-general`
- `/admin-general/login`
- `/admin-general/bureau_admin`
- `/admin-general/ajouter_ecole`
- `/admin-general/liste_ecole`
- `/admin-general/ajouter_province`
- `/admin-general/liste_province`
- `/admin-general/ajouter_province_educationnelle`
- `/admin-general/liste_province_educationnelle`
- `/admin-general/deconnexion`

### Espaces écoles par cycle

Chemins :

```text
src/composants/Ecoles/maternelle
src/composants/Ecoles/primaire
src/composants/Ecoles/secondaire
```

Chaque cycle contient des modules pour :

- Administration.
- Inscriptions.
- Élèves.
- Enseignants.
- Classes.
- Cours.
- Horaires.
- Communiqués.
- Cotes / notes.
- Résultats.
- Paiements.
- Présences.
- Travaux.
- Forum.
- Récupération de mot de passe.
- Profils utilisateurs.

Routes de base :

- `/maternelle`
- `/primaire`
- `/secondaire`

### Parents

Chemin :

```text
src/composants/Parent
```

Fonctionnalités :

- Connexion parent.
- Inscription parent.
- Pré-connexion.
- Profil parent.
- Édition du compte.
- Déconnexion avec confirmation.

Routes :

- `/parent`
- `/parent/login`
- `/parent/inscription_parent`
- `/parent/profil_parent`
- `/parent/edition_compte_parent`
- `/parent/deconnexion`

### Bulletins et résultats

Chemins :

```text
src/composants/Bulletin
src/composants/Bulletins
```

Fonctionnalités :

- Vérification d'un matricule.
- Sélection d'une année scolaire.
- Affichage des bulletins périodiques, semestriels et annuels.

Routes :

- `/bulletin/checking`
- `/bulletin/selection_annee/:eleve_id/:ecole_id/:direction`
- `/bulletin/eleve/:eleve_id/annee/:annee_id/ecole/:ecole_id/direction/:direction`

### Quiz et jeux éducatifs

Chemins :

```text
src/composants/Quiz
src/composants/Jeux
```

Fonctionnalités :

- Création de quiz par cours.
- Ajout de questions.
- Réponse aux quiz.
- Quiz par enseignant.
- Jeux éducatifs thématiques : mathématiques, culture générale, physique, biologie, chimie, histoire, géographie, informatique, comptabilité, littérature, conjugaison, grammaire, etc.

Routes principales :

- `/quiz/cours/:coursId/:coursName`
- `/quiz/creer/:courseId/:coursName`
- `/quiz/ajouter_questions/:quizId`
- `/quiz/repondre/:quizId`
- `/quiz/by_enseignant`
- `/jeux/quiz`

## Nouvelles fonctionnalités QR et présence

### 1. Cartes élèves avec QR code

Chemin :

```text
src/composants/Ecoles/common/CartesEleves
```

Routes :

- `/secondaire/cartes_eleves`
- `/primaire/cartes_eleves`
- `/maternelle/cartes_eleves`

La carte élève contient maintenant :

- Les informations d'identification de l'élève.
- L'école et l'année scolaire.
- Un QR code personnel.
- Un payload QR de présence contenant le type, l'identifiant, le matricule, le nom, l'école, la direction, la classe et l'option.
- Un style plus professionnel pour l'impression.

Documentation détaillée :

```text
src/composants/Ecoles/common/CartesEleves/README.md
```

### 2. Cartes du personnel avec QR code

Chemin :

```text
src/composants/Ecoles/common/CartesPersonnel
```

Routes :

- `/secondaire/cartes_personnel`
- `/primaire/cartes_personnel`
- `/maternelle/cartes_personnel`

Fonctionnalités :

- Chargement du personnel de l'école et de la direction courante.
- Sélection des agents.
- Génération de cartes professionnelles.
- QR code personnel pour pointage arrivée/départ.
- Impression de la sélection.

Documentation détaillée :

```text
src/composants/Ecoles/common/CartesPersonnel/README.md
```

### 3. Espace présence QR

Chemin :

```text
src/composants/common/PresenceQr.jsx
```

Route :

```text
/presence-qr
```

Fonctionnalités :

- Scan caméra via `BarcodeDetector` quand le navigateur le supporte.
- Saisie manuelle compatible avec lecteur QR USB.
- Premier scan : enregistrement de l'heure d'arrivée.
- Deuxième scan du même QR dans la journée : enregistrement de l'heure de départ.
- Conservation journalière dans `localStorage`.
- Sauvegarde de secours dans un cookie.
- Synchronisation manuelle.
- Tentative de synchronisation automatique en fin de journée.

Documentation détaillée :

```text
src/composants/common/README-PRESENCE-QR.md
```

### 4. Déconnexion avec confirmation

Chemin :

```text
src/composants/common/DeconnexionAvecConfirmation.jsx
```

La déconnexion utilise maintenant une boîte de dialogue de confirmation dans :

- Administration générale.
- Maternelle.
- Primaire.
- Secondaire.
- Parent.

Documentation détaillée :

```text
src/composants/common/README-DECONNEXION.md
```

### 5. Menus dashboard adaptés aux rôles

Chemins :

```text
src/composants/common/TableauDeBord/SidebarUtilisateurEcole.jsx
src/composants/common/TableauDeBord/menusTableauBord.js
```

Les menus sont mieux organisés par utilité :

- Comptes & accès.
- Cycle scolaire.
- Communications.
- Enseignants.
- Élèves.
- Cours & horaires.
- Finances & paiements.
- Structure scolaire.
- Personnel & rôles.
- Suivi & rapports.

Les rôles financiers et secrétariat ont aussi des menus ciblés.

Documentation détaillée :

```text
src/composants/common/TableauDeBord/README.md
```

## Chemins importants

```text
src/App.jsx                                            Routes principales
src/main.jsx                                           Point d'entrée React
src/css/style-uniforme.css                             Styles globaux
src/composants/api/api.js                              Configuration API globale
src/composants/common                                  Composants réutilisables
src/composants/common/TableauDeBord                    Sidebars, menus et dashboard
src/composants/common/PresenceQr.jsx                   Espace de présence QR
src/composants/common/DeconnexionAvecConfirmation.jsx  Déconnexion avec confirmation
src/composants/Ecoles/common/CartesEleves              Cartes élèves QR
src/composants/Ecoles/common/CartesPersonnel           Cartes personnel QR
src/composants/AdminGeneral                            Administration générale
src/composants/Parent                                  Espace parent
src/composants/Bulletin                                Parcours bulletin
src/composants/Quiz                                    Quiz liés aux cours
src/composants/Jeux                                    Jeux éducatifs
```

## Routes principales

### Général

```text
/                         Accueil
/ecoles                   Liste / parcours écoles
/ecole/choix_direction    Choix de direction d'une école
/presence-qr              Scanner de présence QR
```

### Cycles

```text
/maternelle
/primaire
/secondaire
```

### Cartes QR

```text
/maternelle/cartes_eleves
/primaire/cartes_eleves
/secondaire/cartes_eleves

/maternelle/cartes_personnel
/primaire/cartes_personnel
/secondaire/cartes_personnel
```

### Déconnexion

```text
/admin-general/deconnexion
/maternelle/deconnexion
/primaire/deconnexion
/secondaire/deconnexion
/parent/deconnexion
```

## Règles UI et bonnes pratiques

- Centraliser les styles dans `src/css/style-uniforme.css`.
- Éviter le CSS inline statique et les balises `<style>` dans les composants.
- Réutiliser les composants communs de `src/composants/common` avant de créer une variante.
- Garder les noms métier en français quand c'est possible.
- Utiliser `react-icons` ou Bootstrap Icons plutôt que des emojis dans l'interface métier.
- Afficher un état de chargement avant les résultats d'une requête asynchrone.
- Afficher des messages d'erreur compréhensibles avec `messageErreur()`.
- Utiliser la configuration API globale au lieu de coder de nouvelles URLs en dur.

## Documentation spécifique des nouveautés

- [Configuration API globale](src/composants/api/README.md)
- [Cartes élèves QR](src/composants/Ecoles/common/CartesEleves/README.md)
- [Cartes personnel QR](src/composants/Ecoles/common/CartesPersonnel/README.md)
- [Espace présence QR](src/composants/common/README-PRESENCE-QR.md)
- [Déconnexion avec confirmation](src/composants/common/README-DECONNEXION.md)
- [Menus dashboard et rôles](src/composants/common/TableauDeBord/README.md)
