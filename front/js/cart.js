// -------------------------------------------------
// constantes URL
// -------------------------------------------------

const urlAPI = "http://localhost:3000/api/products";

// -------------------------------------------------
// Variables DOM
// -------------------------------------------------

let cartItem = document.querySelector("#cart__items");
let totalQuantity = document.querySelector("#totalQuantity");
let totalPrice = document.querySelector("#totalPrice");

// Cibler le local storage
let myLocalStorage = JSON.parse(localStorage.getItem("produit"));

// -------------------------------------------------
// Afficher les produits dans le panier
// -------------------------------------------------

// Si il n'y a pas de panier =>
// Affiche : Pas d'article dans le panier
// Sinon =>
// Récupere les éléments du panier et garde les en mémoire

// Pour chaque éléménts du panier
// Fetch URL de l'API + l'id récupéré dans le panier
// => Ajoute l'élément sur la page
//
//

function productsInBasket() {
  // Recuperer les éléments de l'API
  fetch(urlAPI)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    // Pour chaque valeur de l'API
    .then((valeur) => {
      valeur.forEach((elementAPI) => {
        if (myLocalStorage === null) {
          window.alert("Votre panier est vide");
        } else {
          myLocalStorage.forEach((element) => {
            let productIdInBasket = element.id;
            let productColorInBasket = element.color;
            let productQuantityInBasket = element.quantity;
            if (elementAPI._id === productIdInBasket) {
              let elt =
                '<article class="cart__item" data-id="' +
                elementAPI._id +
                '">' +
                '<div class="cart__item__img">' +
                '<img src="' +
                elementAPI.imageUrl +
                '" alt="' +
                elementAPI.altTxt +
                '">' +
                "</div>" +
                '<div class="cart__item__content">' +
                '<div class="cart__item__content__titlePrice">' +
                "<h2>" +
                elementAPI.name +
                "</h2>" +
                "<p>Couleur : " +
                productColorInBasket +
                "</p>" +
                "<p>" +
                elementAPI.price * productQuantityInBasket +
                ",00 €</p>" +
                "</div>" +
                '<div class="cart__item__content__settings">' +
                '<div class="cart__item__content__settings__quantity">' +
                "<p>Qté : " +
                productQuantityInBasket +
                " </p>" +
                '<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="' +
                productQuantityInBasket +
                '">' +
                "</div>" +
                '<div class="cart__item__content__settings__delete">' +
                '<p class="deleteItem">Supprimer</p>' +
                "</div>" +
                "</div>" +
                "</div>" +
                "</article>";
              cartItem.innerHTML = cartItem.innerHTML + elt;

              // totalQuantity.innerHTML = totalQuantity.innerHTML + productQuantityInBasket;
              // totalPrice.innerHTML = totalPrice.innerHTML + elementAPI.price * productQuantityInBasket;
            }
          });
        }
      });
    });
}

productsInBasket();
