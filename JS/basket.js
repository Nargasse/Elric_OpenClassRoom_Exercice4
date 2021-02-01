var objetContact = Object();
objetContact.contact = Object();

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

//Nouvelle version de récupération prenant en compte les objets multiples
(function() { //IIFE pour une fonction ne servant qu'à l'initialisation
    let x = 0;
    var listeProduitPanier = [];
    let quantity = 0;
    objetContact.products = [];
    //Je place les objets du localStorage dans un array, plus facile à manipuler
    while(localStorage.getItem("contenuPanier" + x)) {
        listeProduitPanier.push(localStorage.getItem("contenuPanier" + x));
        x += 1;
    }
    //J'attache à mon objet contact la liste non formatté des ID produits.
    while(listeProduitPanier.length > 0) {
        let produitAAfficher = listeProduitPanier[0];
        let notYetShownProducts = []
        quantity = 0;
        //Pour chaque élément distinct de mon array, je compte son nombre d'occurence,
        //Puis j'affiche une ligne correspondant à ce produit, avec son nom et son prix
        for (let article of listeProduitPanier) {
            if (article == produitAAfficher) {
                quantity += 1;
            } else {
                notYetShownProducts.push(article);
            }
        }
        listeProduitPanier = notYetShownProducts;
        ficheProduit(produitAAfficher, quantity)
        .then(function(a){creerNouvelleLigne(a)})
        .catch(afficherErreur);
    }
} ());

var nodeSelector = document.querySelector("tbody");
var nodeNouveau;
var prixTotal = 0;

function ficheProduit(elementPanier, quantity) { 
    return new Promise (function(resolve, reject) {
    demandeFicheArticle = new XMLHttpRequest();
    demandeFicheArticle.open("GET", "http://localhost:3000/api/teddies/" + elementPanier, true)
    demandeFicheArticle.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let fiche = JSON.parse(this.responseText);
            fiche.quantity = quantity;
            do {
                objetContact.products.push(elementPanier);
                quantity -= 1;
            } while (quantity > 0)
            resolve(fiche);
        } else if (this.status >= 300) {
            reject("erreur de communication avec l'API");
        };
    }
    demandeFicheArticle.send();
})
}

function creerNouvelleLigne (article, quantity) { 
    let nodeSelector = document.querySelector("tbody");
    let nodeNouveau;
    nodeNouveau = nodeSelector.appendChild(document.createElement("tr"));
    nodeSelector = nodeNouveau;
    nodeNouveau = nodeSelector.appendChild(document.createElement("td"));
    nodeNouveau.innerText = article.name;
    nodeNouveau = nodeSelector.appendChild(document.createElement("td"));
    nodeNouveau.innerText = article.quantity;
    nodeNouveau = nodeSelector.appendChild(document.createElement("td"));
    nodeNouveau.innerText = article.price/100 + "€";
    prixTotal += article.price;
}

function afficherErreur() {
    nodeNouveau = nodeSelector.appendChild(document.createElement("tr"));
    nodeSelector = nodeNouveau;
    nodeNouveau = nodeSelector.appendChild(document.createElement("td"));
    nodeNouveau.setAttribute("colspan", "3");
    nodeNouveau.innerText = "Un produit n'a pas pu être affiché.";
}

(function () { //Fonction vide-panier
    document.getElementById("vide-panier").addEventListener("click", function () {
        localStorage.clear();
        window.location.reload();
    });
} ());

class formElement {
    constructor(id, regex) {
        this.node = document.getElementById(id);
        this.regex = regex;
        this.node.addEventListener("blur", () => {
            if (this.isValid) {
                this.bonRemplissage();
            } else {
                this.mauvaisRemplissage();
            }
        });
    }

    bonRemplissage () {
        this.node.style.boxShadow = "0px 0px 10px 5px #32902d";
    }

    mauvaisRemplissage () {
        this.node.style.boxShadow = "0px 0px 10px 5px #be1720";
    }

    get isValid() {
        return this.regex.test(this.node.value);
    }
}

let formElementsList = [];
formElementsList[0] = new formElement("firstName", /^[a-zA-ZÀ-Ÿ0-9 -]+$/);
formElementsList[1] = new formElement("lastName", /^[a-zA-ZÀ-Ÿ0-9 -]+$/);
formElementsList[2] = new formElement("address", /^[a-zA-ZÀ-Ÿ0-9 -.,]+$/);
formElementsList[3] = new formElement("codePostal", /^\d{5}-?\d{0,4}$/);
formElementsList[4] = new formElement("city", /^[a-zA-ZÀ-Ÿ0-9 ,.'-]+$/);
formElementsList[5] = new formElement("email", /^[\w.-]+@[\w.-]+\.\w{2,4}$/);

let verifValide = true;

let boutonValidation = document.getElementById("bouton-achat");
document.getElementById("bouton-achat").addEventListener("click", function (evenement) {
    evenement.preventDefault();
    verifValide = true;
    for (let element of formElementsList) {
        if (element.isValid) {
            objetContact.contact[element.node.id] = element.node.value;
            element.bonRemplissage();
        } else {
            element.mauvaisRemplissage();
            verifValide = false;
        }
    }
    if (verifValide) {
        sendObjetContact()
        .then(function(objetReponse){
            localStorage.clear();
            localStorage.setItem("order_id", objetReponse.orderId);
            localStorage.setItem("prix_total", prixTotal);
            window.location.href = "Confirmation.html";
        })
        .catch(function(error) {
            alert("Oups ! Quelque chose c'est mal passé... Veuillez réessayez");
        });
    }

    function sendObjetContact (objet) {
        return new Promise (function (resolve, reject) {
            let requeteEnvoi = new XMLHttpRequest();
            requeteEnvoi.open("POST", "http://localhost:3000/api/teddies/order", true);
            requeteEnvoi.setRequestHeader("Content-Type", "application/json");
            requeteEnvoi.onreadystatechange = function () {
                if (requeteEnvoi.readyState == 4 && requeteEnvoi.status >= 200 || requeteEnvoi.status <= 300) {
                    JSON.parse(this.responseText);
                    resolve(JSON.parse(this.responseText));
                } else if (this.status >= 300) {
                    reject("erreur de communication avec l'API");
                };
            }
            requeteEnvoi.send(JSON.stringify(objetContact));
        })
    }
});

