# Correction de la modification d'un eleve

## Probleme

L'API pouvait refuser silencieusement une modification lorsque la date ou le
lieu de naissance etait vide. La validation renvoyait toutefois un statut HTTP
200, ce qui amenait le frontend a afficher un faux message de succes. Certains
champs valides etaient egalement absents des champs modifiables du modele.

## Correction

- La date et le lieu de naissance restent optionnels lors d'une modification.
- Une erreur de validation utilise maintenant le statut HTTP 422.
- Le modele `Eleve` persiste l'adresse, la date et le lieu de naissance.
- L'API renvoie l'eleve relu apres enregistrement.
- Le frontend centralise l'appel de modification et controle aussi le statut
  metier de l'ancienne API afin de ne plus afficher de faux succes.

## Perimetre

La correction concerne les formulaires de modification des eleves du
secondaire, du primaire et de la maternelle. Aucun deploiement n'est inclus.
