# PDR_PresenceRobot

Ce dossier présente plusieurs fichiers permmettant la mise en mouvement du robot, le contrôle à distance sur carte, la géolocalisation du robot et la visualisation de la caméra.

.Pour cela, dans le répertoire launcher on trouve: un script "main.sh" et un fichier "ros.launch".

Le fichier ros.launch permet de lancer: 

  -Le noyau roslauch (ros bringup.launch),
  -Le serveur de map (permet de récuperer la carte avec mapserver),
  -amcl, 
  -La configuration move_base, 
  -Le web socket sur le port 9090 (permet l'accès à l'interface web avec la carte pour commander le robot à distance. 10.1.16.57:8080).
  
Le script main.sh permet de:

  -Charger la configuration réseaux pour le port Ethernet (enp0s25) (adresse ip et masque),
  -Configurer le NAT (config des cameras sur les port 90(celle du bas) et 80(celle du haut)),
  -Lancer les elements du fichier ros.launch précédemment décrit,
  -Configurer le serveur web (Node.js), 
  -Lancer rviz avec sa configuration d'abonnement pré-définit (/map, /pos..). 
  
 Remarque: toutes les configurations réseaux (hors ethernet) se font sur le reseau "robots".
 De plus, pour activer la camera du haut le plug-in QuickTime et safari sont neccesaire. Les flux vidéos ne sont pas recuperés sur Mozzilla. 
  
.Dans le répertoire map on trouve différentes cartes de l'étage de Lahure permettant de faire des tests sur le robots (et aussi des cartes mofidiées avec un éditeur: repasser en noir des murs, protéger du vide...).
Ces cartes sont établis à l'aide de Gmapping: roslaunch gmapping.launch. 

.Le dossier params contients toutes les configurations de move_base (trajectoire, position, vitesses...).
NB: Nous avions des erreurs des trajectoires lors des déplacements du robot avec les objectifs d'arrivées (le robot voulait passer à travers les murs), que nous avons résolues en rajoutant notamment une taille pour le robot de 50 cm (robot_radius).

.Le dossier rviz contient la configuration rviz permettant de lancer toutes les options requises ainsi que les abonnements de cette interface graphique pour déplacer le robot (position, trajectoire, "goal"...).

.Le dossier web contient les fichiers de programation de l'interface WEB de contrôle. 

Alexandre Codaccioni/Mathias Delahaye Promotion 2018. 
