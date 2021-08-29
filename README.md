# FrontEnd d'un site E-commerce

Cet exercice de mon parcours Open Class Room consistait à créer le MVP d'un site de e-commerce, et notamment de sa partie peluche, en allant récupéré la liste des produites sur un serveur backEnd déjà prêt.

Le site est construit en 4 pages. La page d’accueil récupère la liste de toutes les peluches via des promesses javascript et en affiche l'ensemble, en créant de nouvelles divisions de type article pour chaque. Les articles sont enfermé dans une grande balise lien de manière à rendre l'ensemble entièrement cliquable, conformément aux prescriptions du client.

Un compteur de nombre de produits dans le panier s'affiche dans le header, commun à toutes les pages, ce qui permet de constater que le site marche correctement en l'absence d'animations un peu plus sympa pour ce premier prototype.

Lorsqu'on clique sur l'une des fiches produits de la page d'accueil, on est amené sur une fiche unique correspondant au produit. La page fonctionne de manière très similaire, avec une légère différence au niveau de la fonction utilisé pour prendre en compte le fait qu'on s'apprête à recevoir un produit unique. Une liste d'options est aussi affiché dans un menu déroulant, dont le contenu est reçu du serveur en même temps que la fiche produit. Un clic sur la bannière du site permet de revenir à l'accueil.

La troisième page, celle du panier, affiche un formulaire sensé permettre l'achat. Son contenu est validé sur le frontEnd avant d'être envoyé au serveur. Lors de l'arrivé sur la page, on compte la quantité de chaque peluches présentes dans le panier de manière à afficher le tout dans un tableau.
Lors de la validation du formulaire, on arrive sur une page de validation, avec un numéro unique de commande renvoyé par le serveur et l'affichage du prix total.

Le site est robuste et on s'assure qu'il continue à fonctionner même en cas de problème avec le serveur ou de réception de données non conforme de la part du client.
