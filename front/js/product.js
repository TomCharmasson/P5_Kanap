// -------------------------------------------------
// constantes URL
// -------------------------------------------------

const urlAPI = "http://localhost:3000/api/products";

// -------------------------------------------------
// Variables DOM
// -------------------------------------------------

let productImage = document.getElementsByClassName("item__img")[0];
let productName = document.getElementById("title");
let productPrice = document.getElementById("price");
let productDescription = document.getElementById("description");
let productColor = document.querySelector("#colors option");

//  -------------------------------------------------
//  Récupérez le résultat de la requête
//  -------------------------------------------------

// Récupérer les éléments pour la page produit dans l'API

function getProductsDetails() {
  fetch(urlAPI)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((valeur) => {
      valeur.forEach((element) => {
        if (element._id == "107fb5b75607497b96722bda5b504926") {
          let name = element.name;
          productName.innerHTML = productName.innerHTML + name;

          let price = element.price;
          productPrice.innerHTML = productPrice.innerHTML + price;

          let description = element.description;
          productDescription.innerHTML = productDescription.innerHTML + description;

          let image = '<img src="' + element.imageUrl + '" alt="' + element.altTxt + '"></img>';
          productImage.innerHTML = productImage.innerHTML + image;
        }
      });
    });
}

getProductsDetails();
