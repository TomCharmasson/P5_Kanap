// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// Afficher le numéro de la commande
// ----------------------------------------------------------------------

// -------------------------------------------------
// Récuperer l'Id de la commande dans l'URL
// -------------------------------------------------

let urlcourante = document.location.href;

let url = new URL(urlcourante);

let search_params = new URLSearchParams(url.search);

let orderId = "";
if (search_params.has("id")) {
  orderId = search_params.get("id");
}

let targetOrderId = document.getElementById("orderId");
targetOrderId.innerText = orderId;

localStorage.removeItem("produit");
