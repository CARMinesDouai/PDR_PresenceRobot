# PDR_PresenceRobot

*Authors*: Alexandre Codaccioni et Mathias Delahaye Promotion 2018

Ce dossier présente plusieurs fichiers permmettant la mise en mouvement du robot, le contrôle à distance de ce dernier sur une carte en 2D, sa géolocalisation ainsi que la visualisation de son environnement via les caméras installées.

## Aperçu de l'interface



## Installer le projet 

Pré-requis :

- Un ordinateur portable équipé d'une distribution Ubuntu comportant au moins deux interfaces réseau, dont l'une est de type Ethernet
- ROS Kinetic
- Robulab drivers
- Module Pharo qui fait la jonction entre l'ordinateur embarqué au sein du robot (un windows CE qui gère le hardware, ie moteurs, lasers, etc...) et le système ROS installé sur le PC portable équipé d'Ubuntu

Récupération et configuration du robot :

- récupération du dépôt que l'on place dans le dossier utilisateur (/home/nom_user/)
- adapter les liens des fichiers ./PDR/launcher/main.sh et ./PDR/launcher/ros.launch, pour que les noms d'utilisateurs concordent
- toujours dans le fichier ./PDR/launcher/main.sh, adapter le nom des interfaces

	git clone ....
	mv /home/bot/

## Lancer la démo

	cd /home/bot/PDR/launcher
	./main.sh
	


# Détails Techniques

Le répertoire `PDR/launcher` contient deux fichiers: `main.sh` et `ros.launch`.

Pour ce qui est de la configuration réseau, les fichiers à éditer sont :
- `/home/bot/PDR/launcher/main.sh (le début du fichier)`
- `/home/bot/PDR/web/app.js (le début du fichier)`
- la configuration machine

Actuellement, le PC doit être connecté à :
- kompai2 (pour enp0s25 (Ethernet) IP: 192.168.1.32/24)
- et sur un réseau Wifi (pour le réseau robots, l'adresse IP de la machine est 10.1.16.57, c'est à cette adresse qu'est accessible le site web sur le port non standard, mais presque, 8080)

Pour ce qui est des paramètres du robot :
- `/home/bot/PDR/params/*`

Pour ce qui est des topics à lancer ou autres noeuds, les lancements se font dans le fichier :
- `/home/bot/PDR/launcher/ros.launch`


## `main.sh`

Permet de :
- Charger la configuration réseaux pour le port Ethernet (enp0s25) (adresse ip et masque),
- Configurer le NAT : On a, sur le réseau de l'école, ADRESSE_IP_LINUX:80 qui est redirigé vers la caméra du haut et ADRESSE_IP_LINUX:90 qui est redirigé vers la caméra du bas. (les caméras étant sur un réseau distinct du réseau de l'école, l'acces à ce dernières se fait donc via l'adresse IP de l'ordinateur sur les ports 80 et 90 pour les caméras du haut et du bas respectivement.)
- Lancer `ros.launch` décrit ci-après,
- Configurer un serveur web (Node.js), 
- Lancer rviz avec sa configuration d'abonnement pré-définie (/map, /pos..). 



## `ros.launch` 

Permet de lancer : 

- `bringup.launch` (drivers du robot: odométrie, laser, ...)
- `mapserver` qui permet de récuperer la carte avec ,
- `amcl` est un module, basé sur l'approche de Monte Carlo, afin de localiser le robot sur une carte en 2D
- `move_base` qui est également un fichier launch permettant de définir un objectif à atteindre sur une carte en 2D, 
- une web socket sur le port 9090 permet l'accès au topics ROS, incluant la carte, la position, et les commandes afin de piloter  le robot à distance via son interface web accessible sur le socket `IP_LINUX:8080` (ie http://10.1.16.57:8080 avec la configuration à l'état du commit)
  
*Remarque*: toutes les configurations réseaux (hors ethernet) se font sur le reseau "robots".
De plus, pour activer la camera du haut le plug-in QuickTime et Safari sont neccesaires. Les flux vidéos ne sont pas recuperés sur Mozzilla. 
 
## Répertoire `map`

Dans le répertoire map on trouve différentes cartes de l'étage de Lahure permettant de faire des tests sur le robots (et aussi des cartes mofidiées avec un éditeur: repasser en noir des murs, protéger du vide...).
Ces cartes sont établis à l'aide de Gmapping: roslaunch gmapping.launch. 
Pour acquérir la carte, il faut executer:

`$ ~/Pharo-WS/src/robulab_gmapping/launch/gmapping.launch`


## Répertoire `params`

Le dossier params contients toutes les configurations de move_base (trajectoire, position, vitesses...).
NB: Nous avions des erreurs des trajectoires lors des déplacements du robot avec les objectifs d'arrivées (le robot voulait passer à travers les murs), que nous avons résolues en rajoutant notamment une taille pour le robot de 50 cm (robot_radius). Cette modification se trouve dans `/home/bot/PDR/params/costmap_common_robulab.yam`

## Répertoire `rviz`

Le dossier rviz contient la configuration rviz permettant de lancer toutes les options requises ainsi que les abonnements de cette interface graphique pour déplacer le robot (position, trajectoire, "goal"...).

Rviz : logiciel qui peut s'abonner à des flux pour écouter les topics (/map, /pose, etc...) et qui permet donc d'afficher une carte, ou de définir un objectif, ce n'est qu'une interface: il n'y a pas de configuration à faire, aucune donnée n'est enregistrée / enregistrable sur ce programme.

On peut juste sauvegarder la liste des paramètres que l'on souhaite afficher mais pas leurs états.

Quelques commandes utiles:
- $ rostopic list : affiche la liste des topics de ROS
- $ rosrun map_server map_saver -f nom_du_fichier : sauvegarde la carte présente dans le topic /map vers le fichier spécifié
- $ rosrun map_server map_server nom_du_fichier.yaml : charge la carte spécifié ( ce programme doit s'executer en continu: s'il meurt, il n'y a plus de carte disponible) 
	/!\ Une carte correspond au couple des deux fichier map.pgm (image que l'on peut visualier et éditer) et map.yaml. Le fichier .yaml doit bien contenir (dans son contenu) le bon nom du fichier .pgm et la bonne échelle /!\
- $ rostopic echo nom_du_topic : affiche le contenu du topic: utile pour vérifier que le robot reçoit bien un objectif sur le topic /move_base/goal

Pour se déplacer de manière autonome sur la carte, il faut lancer (dans le fichier .launch par exemple) :
- bringup.launch
- map_server map_server a_map.yaml
- amcl pour faire la jonction entre le repère de la carte et le repère du robot
- move_base pour lui spécifier les déplacements
- le publisher pose

et, pour l'application web:
- le websocket (remontée de la connexion sur le client distant)

## Répertoire `web`

Le dossier web contient les fichiers de programation de l'interface WEB de contrôle. 
Cette interface permet de repérer le robot sur la carte, définir une destination, visualiser la trajectoire du robot et visualiser les cameras du robot. 


# Pistes d'améliorations

- Scanner l'interieur des salles de cours et rentrer les coordonnées de ces salles dans l'interface graphique pour avoir une gestion complète. 
- Mettre en place un système d'échange, comme un micro avec des enceintes ou un chat,  pour intéragir avec les personnes d'une salle
- Tester le robot avec de meilleurs cameras: meilleure intégration des caméras avec angles de rotation et zoom, caméra 3D
 - Jonction avec la structure de l'école pour que le robot aille automatiquement dans la bonne salle à la bonne heure (absence prévenue à l’avance) avec identification LDAP
- Lancer en simultané gmapping avec le scan laser et les déplacements move_base sur la carte pour affiner la carte pendant les deplacements du robot
- Régler les petits problemes d'affichage de trajectoire sur l'interface
- Etre sûr que le robot prenne le chemin le plus court
 - Ecran tactile pour communiquer (résolution d'exercice à distance) ou lever une main virtuelle ou autre signe distinctif
 - Intégration dans le sol d'inductances pour recharger le robot sans fils et ainsi améliorer son autonomie (voire même du CPL sur inductance)



