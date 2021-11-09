// -------------------------------------------------
// constantes URL
// -------------------------------------------------

const urlAPI = "http://localhost:3000/api/products";

// -------------------------------------------------
// Variables DOM
// -------------------------------------------------

let productItem = document.getElementsByClassName("items")[0];

//  -------------------------------------------------
//  Récupérez le résultat de la requête
//  -------------------------------------------------

// Récupérer les éléments pour la page d'accueil dans l'API

function getProducts() {
  // Promesse
  fetch(urlAPI)
    // Callback
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    // Callback
    .then((valeur) => {
      valeur.forEach((element) => {
        let elt =
          '<a href="./product.html?id=' +
          element._id +
          '">' +
          "<article>" +
          '<img src="' +
          element.imageUrl +
          '" alt="' +
          element.altTxt +
          '" />' +
          '<h3 class="productName">' +
          element.name +
          "</h3>" +
          '<p class="productDescription">' +
          element.description +
          "</p>" +
          "</article>" +
          "</a>";
        productItem.innerHTML = productItem.innerHTML + elt;
      });
    });
}

getProducts();
