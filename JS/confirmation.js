document.getElementById("prix-total").innerText = localStorage.getItem("prix_total")/100 + "€";
document.getElementById("identifiant-commande").innerText = localStorage.getItem("order_id");
localStorage.clear();