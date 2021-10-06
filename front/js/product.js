// -------------------------------------------------
// constantes URL
// -------------------------------------------------

const urlAPI = "http://localhost:3000/api/products/";

// -------------------------------------------------
// Récuperer l'Id dans l'url de la page courante
// -------------------------------------------------

var urlcourante = document.location.href;

var url = new URL(urlcourante);

var search_params = new URLSearchParams(url.search);

if (search_params.has("id")) {
  var id = search_params.get("id");
}

// var urlcourante = document.location.href;
// let productIdUrl = urlcourante.substring(urlcourante.lastIndexOf("=") + 1);

// -------------------------------------------------
// Variables DOM
// -------------------------------------------------

let productImage = document.getElementsByClassName("item__img")[0];
let productName = document.getElementById("title");
let productPrice = document.getElementById("price");
let productDescription = document.getElementById("description");
let productColor = document.getElementById("colors");

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
        if (element._id == id) {
          let name = element.name;
          productName.innerHTML = productName.innerHTML + name;

          let price = element.price;
          productPrice.innerHTML = productPrice.innerHTML + price;

          let description = element.description;
          productDescription.innerHTML = productDescription.innerHTML + description;

          let image = '<img src="' + element.imageUrl + '" alt="' + element.altTxt + '"></img>';
          productImage.innerHTML = productImage.innerHTML + image;

          element.colors.forEach((elt) => {
            let option = '<option value="' + elt + '">' + elt + "</option>";
            productColor.innerHTML = productColor.innerHTML + option;
          });
        }
      });
    });
}

getProductsDetails();
