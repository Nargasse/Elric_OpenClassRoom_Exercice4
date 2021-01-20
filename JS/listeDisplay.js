var ouMontrerLesArticles = document.getElementById("liste-articles");
var demandeListeArticles = new XMLHttpRequest();

demandeListeArticles.open("GET", "http://localhost:3000/api/teddies/", true)

demandeListeArticles.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        ecrireListeArticles(JSON.parse(this.responseText));
    };
}

function ecrireListeArticles(listeArticles) {
    for (let article of listeArticles) {
        
        //On créer un <a> qui va englober toute la fiche d'un article.
        const lienContenant = document.createElement("a");
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
        const prix = document.createElement("p");
        prix.innerText = article.price/100 + "€";

        //On insère le tout sur la nouvelle section
        lienContenant.appendChild(title);
        lienContenant.appendChild(image);
        lienContenant.appendChild(description);
        lienContenant.appendChild(prix);

        //On insère le <a> dans un <article> (pour améliorer la sémantique HTML) avant de l'insérer dans le DOM
        const nouvelArticle = document.createElement("article");
        nouvelArticle.appendChild(lienContenant);
        ouMontrerLesArticles.appendChild(nouvelArticle);
    }
}

demandeListeArticles.send();