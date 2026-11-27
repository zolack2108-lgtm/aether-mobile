# aether-mobile
Appli compagnon du jeu VR Aether, en cinq onglets :

- **Aujourd'hui** : ce qui t'attend (demandes d'ami, messages non lus, rendez-vous du royaume, fête, ta vie à Aether) ;
- **Avatar** : ton visage dans le jeu, lu sur une photo ;
- **Amis** : demandes, messages privés, appels ;
- **Général** : la discussion de tous les aventuriers ; touche un nom pour ouvrir sa **fiche** (bannière tirée d'une photo du jeu,
  bio, titre, guilde, thème et fond) et l'ajouter en ami ou lui **envoyer des Lumes** (amis seulement, fonction `envoyer_lumes`,
  plafonds 50 000 par envoi et 100 000 par 24 h ; l'ami reçoit un colis dans son jeu) ;
- **Marché** : thèmes de l'appli, fonds pour la photo de profil (vus par les amis) et packs d'émojis du jeu, payés avec les Lumes (table `achats_appli`,
  fonction `acheter_appli` côté Supabase ; le jeu retire les Lumes à la partie suivante).
