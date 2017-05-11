# PDR_PresenceRobot

*Authors*: Alexandre Codaccioni et Mathias Delahaye Promotion 2018

Ce dossier présente plusieurs fichiers permmettant la mise en mouvement du robot, le contrôle à distance sur carte, la géolocalisation du robot et la visualisation de la caméra.

## Aperçu de l'interface



## Installer le projet 

Pré-requis :

- Ubuntu
- ROS Kinetic
- Robulab drivers
- ...


TODO

	git clone ....
	mv
	cd

## Lancer la démo

TODO

	cd xxx
	./main.sh
	


# Détails Techniques

Le répertoire `PDR/launcher` contient deux fichiers: `main.sh` et `ros.launch`.

## `main.sh`

Permet de :

- Charger la configuration réseaux pour le port Ethernet (enp0s25) (adresse ip et masque),
- Configurer le NAT (config des cameras sur les port 90 (celle du bas) et 80 (celle du haut)),
	- TODO: mieux expliquer ici. maintenant localhost:90 est redirigé vers `IP_CAMERA_BASSE:90` ?
- Lancer `ros.launch` décrit ci-après,
- Configurer un serveur web (Node.js), 
- Lancer rviz avec sa configuration d'abonnement pré-définie (/map, /pos..). 


## `ros.launch` 

Permet de lancer : 

- `bringup.launch` (drivers du robot: odométrie, laser, ...)
- `mapserver` qui permet de récuperer la carte avec ,
- `amcl` TODO, 
- `move_base` qui est également un fichier launch permettant de TODO, 
- une web socket sur le port 9090 permet l'accès à l'interface web avec la carte pour commander le robot à distance (`IP_ROBOT:8080`). Exemple: 10.1.16.57:8080
  
*Remarque*: toutes les configurations réseaux (hors ethernet) se font sur le reseau "robots".
De plus, pour activer la camera du haut le plug-in QuickTime et safari sont neccesaires. Les flux vidéos ne sont pas recuperés sur Mozzilla. 
 
## Répertoire `map`

Dans le répertoire map on trouve différentes cartes de l'étage de Lahure permettant de faire des tests sur le robots (et aussi des cartes mofidiées avec un éditeur: repasser en noir des murs, protéger du vide...).
Ces cartes sont établis à l'aide de Gmapping: roslaunch gmapping.launch. 

## Répertoire `params`

Le dossier params contients toutes les configurations de move_base (trajectoire, position, vitesses...).
NB: Nous avions des erreurs des trajectoires lors des déplacements du robot avec les objectifs d'arrivées (le robot voulait passer à travers les murs), que nous avons résolues en rajoutant notamment une taille pour le robot de 50 cm (robot_radius).

## Répertoire `rviz`

Le dossier rviz contient la configuration rviz permettant de lancer toutes les options requises ainsi que les abonnements de cette interface graphique pour déplacer le robot (position, trajectoire, "goal"...).

## Répertoire `web`

Le dossier web contient les fichiers de programation de l'interface WEB de contrôle. 
Cette interface permet de repérer le robot sur la carte, définir une destination, visualiser la trajectoire du robot et visualiser les cameras du robot. 


# Pistes d'améliorations

- Scanner l'interieur des salles de cours et rentrer les coordonnées de ces salles dans l'interface graphique pour avoir une gestion complète. 
- Mettre en place un système d'échange, comme un micro avec des enceintes ou un chat,  pour intéragir avec les gens d'une salle
- Tester le robot avec de meilleurs cameras 
- Configurer des deplacements automatiques en relations avec un emploi du temps d'un élève (ce qui necessiterait un connexion utilisateur)
- Lancer en simultané gmapping avec le scan laser et les déplacements move_base sur la carte pour affiner la carte pendant les deplacements du robot
- Régler les petits problemes d'affichage de trajectoire sur l'interface
- Etre sûr que le robot prenne le chemin le plus court


