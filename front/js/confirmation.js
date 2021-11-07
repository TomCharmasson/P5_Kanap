// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// Afficher le numéro de la commande
// ----------------------------------------------------------------------

// -------------------------------------------------
// Récuperer l'Id de la commande dans l'URL
// -------------------------------------------------

var urlcourante = document.location.href;

var url = new URL(urlcourante);

var search_params = new URLSearchParams(url.search);

var orderId = "";
if (search_params.has("id")) {
  orderId = search_params.get("id");
}

let targetOrderId = document.getElementById("orderId");
targetOrderId.innerText = orderId;

localStorage.removeItem("produit");
