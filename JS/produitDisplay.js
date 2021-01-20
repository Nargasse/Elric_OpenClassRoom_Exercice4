
var ouMontrerLesArticles = document.getElementById("liste-articles");
urlArgumentRegex = /[\w]{1,100}$/;
var urlArgument = urlArgumentRegex.exec(window.location.href)[0];
if (typeof(urlArgument) == "string" && urlArgument != "html") {
    demandeFicheArticle = new XMLHttpRequest();
    demandeFicheArticle.open("GET", "http://localhost:3000/api/teddies/" + urlArgument, true);
    demandeFicheArticle.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            ecrireFicheArticle(JSON.parse(this.responseText));
        } else {
            echec();
        };
    }
    demandeFicheArticle.send();
} else {
    echec();
}
function echec() {
    let echecDisplay = document.querySelector("h1");
    echecDisplay.innerText = "Produit non trouvé !";
}

function ecrireFicheArticle (article) {
            //On créer un <a> qui va englober toute la fiche d'un article.
            const nouvelArticle = document.createElement("Article");
    
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
            prix.innerText = article.price;
    
            //On insère le tout sur la nouvelle section
            nouvelArticle.appendChild(title);
            nouvelArticle.appendChild(image);
            nouvelArticle.appendChild(description);
            nouvelArticle.appendChild(prix);
    
            //On insère le <a> dans un <article> (pour améliorer la sémantique HTML) avant de l'insérer dans le DOM
            ouMontrerLesArticles.appendChild(nouvelArticle);

            //On implante directement les options au fur et à mesure dans le select
            let selectAppended
            const selectDisplay = document.getElementById("variante-select");
            for (let option of  article.colors) {
                selectAppended = selectDisplay.appendChild(document.createElement("option"));
                selectAppended.setAttribute("value", option);
                selectAppended.innerText = option;
            }
}