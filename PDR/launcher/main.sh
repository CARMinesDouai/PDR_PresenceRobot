#!/bin/bash

##########################
##### Partie Réseau ######
##########################

# Charge la configuration réseau pour le port Ethernet (enp0s25)
sudo ifconfig enp0s25 192.168.1.32 netmask 255.255.255.0 broadcast 192.168.1.255
echo "Configuration réseau chargée"

# Reinitialise iptables
sudo iptables -F
sudo iptables -X

# Activation IPForward
sudo sh -c 'echo "1" > /proc/sys/net/ipv4/ip_forward'

# NAT
sudo iptables -t nat -A POSTROUTING -o enp0s25 -j MASQUERADE
sudo iptables -t nat -A POSTROUTING -o wlo1 -j MASQUERADE

# Redirection du port 80 sur 192.168.1.92:80
sudo iptables -A FORWARD -p tcp --dport 80 -i wlo1  -j ACCEPT
sudo iptables -t nat -A PREROUTING -i wlo1 -p tcp --dport 80 -j DNAT --to-destination 192.168.1.92:80

# Redirection du port 90 sur 192.168.1.12:80
sudo iptables -A FORWARD -p tcp --dport 90 -i wlo1  -j ACCEPT
sudo iptables -t nat -A PREROUTING -i wlo1 -p tcp --dport 90 -j DNAT --to-destination 192.168.1.12:80
echo "NAT activé"


# Tue les processus eventuellement restant
kill -9 `pidof /home/bot/PhaROS-ws/src/robulabdriver/vm/pharo`

# Lance le noyeau ROS
roslaunch /home/bot/PDR/launcher/ros.launch &
sleep 10
echo "ROS activé"

# Lance le serveur Web Node.JS
cd /home/bot/PDR/web
node /home/bot/PDR/web/app.js &
sleep 2
echo "Serveur Web activé"

# Lance RVIZ pour superviser le robot
rviz -d /home/bot/PDR/rviz/movebase.rviz
