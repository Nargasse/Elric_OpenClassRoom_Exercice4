
//Une première vérification est nécessaire pour éviter un bug lié à l'utilisation de .exec sur une valeur null
if (/\.html\?[\w]{1,100}/.test(window.location.href)) {
    var urlArgument = /[\w]{1,100}$/.exec(window.location.href)[0];
    demandeFicheAPI(urlArgument)
    .then(function (ficheContact) {
        ecrireFicheArticle(ficheContact);
        //Le bouton de commande n'est créer que si le chargement est réussi, autrement il sera transformé en retour à l'accueil.
        //On évite ainsi qu'un argument URL faussé soit envoyé avec une commande.
        fonctionBoutonCommande();
    })
    //Si quelque chose se passe mal, le bouton commande sera remplacé par un bouton accueil.
    .catch(function(erreur) {echec()});
} else {
    echec();
}

nombreElementPanier ();
boutonPanier();

function boutonPanier() { //On attache un lien au bouton accès panier
    document.getElementById("bouton-panier").addEventListener("click", function () {
        window.location.href = "Panier.html";
    })
}

function demandeFicheAPI (urlArgument) {
    return new Promise (function(resolve, reject) {
        demandeFicheArticle = new XMLHttpRequest();
        demandeFicheArticle.open("GET", "http://localhost:3000/api/teddies/" + urlArgument, true);
        demandeFicheArticle.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                resolve(JSON.parse(this.responseText));
            } else if (this.status >= 300) {
                reject("Erreur de communication avec le serveur");
            };
        }
        demandeFicheArticle.send();
    });
};

function echec() { //Est appellé si la demande serveur se passe mal.
    let echecDisplay = document.querySelector("h1");
    echecDisplay.innerText = "Produit non trouvé !";
    let boutonRetour = document.getElementById("bouton-commande");
    boutonRetour.innerText = "Accueil";
    boutonRetour.addEventListener("click", function() {
        window.location.href = "index.html";
    });
}

function ecrireFicheArticle(article) {
    //On créer un <a> qui va englober toute la fiche d'un article.
    const nouvelArticle = document.createElement("Article");
    nouvelArticle.setAttribute("class", "box-clickable");
    document.getElementById("liste-articles").appendChild(nouvelArticle);

    //On prépare l'élément titre
    const title = document.createElement("h2");
    title.innerText = article.name;

    // On prépare l'élément image et son attribut href
    const image = document.createElement("img");
    image.setAttribute("src", article.imageUrl);

    //On prépare l'élément description
    const description = document.createElement("p");
    description.innerText = article.description;

    //On prépare l'élément prix
    const prix = document.createElement("button");
    prix.setAttribute("class", "box-clickable");
    prix.innerText = article.price/100 + "€";

    //On insère le tout sur la nouvelle section
    nouvelArticle.appendChild(title);

    let nouvelleDiv = document.createElement("div");
    nouvelleDiv.setAttribute("class", "flex-around");
    nouvelleDiv.appendChild(image);
    nouvelArticle.appendChild(nouvelleDiv);
    let previousDiv = nouvelleDiv;

    nouvelleDiv = document.createElement("div");
    previousDiv.appendChild(nouvelleDiv);
    nouvelleDiv.appendChild(description);
    nouvelleDiv.appendChild(prix);

    //On implante directement les options au fur et à mesure dans le select
    let selectAppended
    const selectDisplay = document.getElementById("variante-select");
    for (let option of article.colors) {
        selectAppended = selectDisplay.appendChild(document.createElement("option"));
        selectAppended.setAttribute("value", option);
        selectAppended.innerText = option;
    }
}

function fonctionBoutonCommande () {
    document.getElementById("bouton-commande").addEventListener("click", function() {
        let x = 0;
        while(localStorage.getItem("contenuPanier" + x)) {
            x++;
        }
        localStorage.setItem("contenuPanier" + x, urlArgument);
        nombreElementPanier ();
    });
}

function nombreElementPanier () { //Affiche le nombre d'articles actuellement dans le panier
    let x = 0;
    while(localStorage.getItem("contenuPanier" + x)) {
        x += 1;
    }
    let spans = document.getElementsByClassName("nombre-element-panier");
    for (let span of spans) {
        span.innerText = x;
    }
}