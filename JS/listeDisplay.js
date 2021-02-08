nombreElementPanier ();
//On fait appel à la fonction demande liste qui ouvre la demande serveur sous forme de promesse
demandeListe()
.then(function(listeTeddies) {
    //Si la réponse du serveur est bonne, on appel une fonction d'écriture de la page
    //Via une fonction anonyme renvoyant la réponse du serveur
    ecrireListeArticles(listeTeddies)
})
.catch(function(error) {
    //Si quelque chose c'est mal passé, on place un message d'erreur.
    let errorMessage = document.createElement("h2");
    errorMessage.innerText = "Oups, la communication avec le serveur n'a pas pu être établie !";
    document.getElementById("liste-articles").appendChild(errorMessage);
})

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

function demandeListe () {
    //Renvoie une promesse qui sera résolu plus tard avec la réponse du serveur ou une erreur.
    return new Promise (function(resolve, reject) {
        let demandeListeArticles = new XMLHttpRequest();
        demandeListeArticles.open("GET", "http://localhost:3000/api/teddies/", true);
        demandeListeArticles.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                resolve(JSON.parse(this.responseText));
            } else if (this.status != 200) {
                reject("Erreur de communication avec le serveur");
            };
        }
        demandeListeArticles.send();
    })
};

function ecrireListeArticles(listeArticles) {
    let ouMontrerLesArticles = document.getElementById("liste-articles");
    for (let article of listeArticles) {
        //On créer un <a> qui va englober toute la fiche d'un article.
        let lienContenant = document.createElement("a");
        lienContenant.setAttribute("href", "Produit.html?" + article._id);

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

        //On insère le <a> dans un <article> (pour améliorer la sémantique HTML) avant de l'insérer dans le DOM
        const nouvelArticle = document.createElement("article");
        nouvelArticle.appendChild(lienContenant);
        nouvelArticle.setAttribute("class", "box-clickable");
        ouMontrerLesArticles.appendChild(nouvelArticle);
        
        //On insère le tout sur la nouvelle section
        lienContenant.appendChild(title);

        //On créer deux divs supplémentaires pour le styling CSS.
        let nouvelleDiv = document.createElement("div");
        nouvelleDiv.setAttribute("class", "flex-around");
        lienContenant.appendChild(nouvelleDiv);
        lienContenant = nouvelleDiv;
        lienContenant.appendChild(image);

        nouvelleDiv = document.createElement("div");
        lienContenant.appendChild(nouvelleDiv);
        lienContenant = nouvelleDiv;
        lienContenant.appendChild(description);
        lienContenant.appendChild(prix);
    }
}