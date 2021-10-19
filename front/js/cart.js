// -------------------------------------------------
// constantes URL
// -------------------------------------------------

const urlAPI = "http://localhost:3000/api/products/";

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

async function productsInBasket() {
  cart = "";
  cartItem.innerHTML = "";
  if (myLocalStorage === null) {
    let emptyCart = `
    <div class="cart__empty">
      <p>Votre panier est vide ! 😢</p>
    </div>
    `;
    cartItem.innerHTML = emptyCart;
  } else {
    let totalQuantityInBasket = 0;
    let totalPriceInBasket = 0;

    for (const element of myLocalStorage) {
      let productColorInBasket = element.color;
      let productQuantityInBasket = element.quantity;
      let elt =
        '<article class="cart__item" data-id="' +
        element.id +
        '">' +
        '<div class="cart__item__img">' +
        '<img src="' +
        element.imageUrl +
        '" alt="' +
        element.altTxt +
        '">' +
        "</div>" +
        '<div class="cart__item__content">' +
        '<div class="cart__item__content__titlePrice">' +
        "<h2>" +
        element.name +
        "</h2>" +
        "<p>Couleur : " +
        productColorInBasket +
        "</p>" +
        '<p class="item__price__update">' +
        element.price * productQuantityInBasket +
        ",00 €</p>" +
        "</div>" +
        '<div class="cart__item__content__settings">' +
        '<div class="cart__item__content__settings__quantity">' +
        '<p class="item__quantity__update">Qté : ' +
        productQuantityInBasket +
        " </p>" +
        '<input type="number" id="' +
        element.id +
        "-" +
        productColorInBasket +
        '" class="itemQuantity" name="itemQuantity" min="1" max="100" value="' +
        productQuantityInBasket +
        '">' +
        "</div>" +
        '<div class="cart__item__content__settings__delete">' +
        '<p id="' +
        element.id +
        "-" +
        productColorInBasket +
        '" class="deleteItem">Supprimer</p>' +
        "</div>" +
        "</div>" +
        "</div>" +
        "</article>";
      totalQuantityInBasket += productQuantityInBasket;
      totalPriceInBasket += productQuantityInBasket * element.price;

      cartItem.innerHTML += elt;
      // cartItem.innerHTML = cartItem.innerHTML + elt;

      // Cibler les éléments pour l'événement change
      let itemQuantity = document.querySelectorAll(".itemQuantity");
      // let updateItemQuantity = document.querySelectorAll(".item__quantity__update");
      // let updateItemPrice = document.querySelectorAll(".item__price__update");

      // Ajout de l'évènement change pour modifier la quantité du produit dans le panier
      itemQuantity.forEach((createdQuantity) => {
        createdQuantity.addEventListener("change", (event) => {
          event.preventDefault();
          let setQuantity = parseInt(createdQuantity.value, 10);
          itemQuantity = setQuantity;
          console.log(createdQuantity);
          // Vérifie que l'utilisateur renseigne correctement le champ
          if (isNaN(itemQuantity) || itemQuantity === 0) {
            setQuantity = 1;
            createdQuantity.value = 1;
            window.alert("Veuillez renseigner une quantité ou supprimer votre arcticle");
          }

          // Modification de la quantité dans le LocalStorage
          myLocalStorage.forEach((element) => {
            if (element.id + "-" + element.color === createdQuantity.id) {
              element.quantity = setQuantity;
              localStorage.setItem("produit", JSON.stringify(myLocalStorage));
            }
          });

          productsInBasket();
        });
      });

      // Cibler les éléments pour l'événement click
      let deleteItem = document.querySelectorAll(".deleteItem");

      // Ajout de l'évènement click pour supprimer un produit dans le panier
      deleteItem.forEach((deleteItemcreated) => {
        deleteItemcreated.addEventListener("click", (event) => {
          event.preventDefault();

          // Mettre à jour le LocalStorage si suppression d'un article
          if (window.confirm(`Voulez-vous retirer cet article du panier ? Cliquer OK pour confirmer ou ANNULER pour annuler`)) {
            myLocalStorage = myLocalStorage.filter((elt) => elt.id + "-" + elt.color !== deleteItemcreated.id);
            localStorage.setItem("produit", JSON.stringify(myLocalStorage));
            deleteItemcreated.parentElement.parentElement.parentElement.parentElement.remove();

            // Vide completement le LocalStorage si suppression de tous les articles
            if (myLocalStorage.length === 0) {
              localStorage.clear();
              let emptyCart = `
                  <div class="cart__empty">
                  <p>Votre panier est vide ! 😢</p>
                  </div>
                  `;
              cartItem.innerHTML = emptyCart;
            }
            // Ne fait rien si annulation de la suppression
          } else {
            console.log("Ok, je n'enlève rien");
          }

          productsInBasket();
        });
      });
    }
    totalQuantity.innerHTML = totalQuantityInBasket;
    totalPrice.innerHTML = totalPriceInBasket;
  }
}

fetchAPI();

async function fetchAPI() {
  if (myLocalStorage != null) {
    for await (const element of myLocalStorage) {
      let productIdInBasket = element.id;

      // Recuperer les éléments de l'API
      fetch(urlAPI + productIdInBasket)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })

        // Pour chaque valeur de l'API
        .then((elementAPI) => {
          element.name = elementAPI.name;
          element.price = elementAPI.price;
          element.altTxt = elementAPI.altTxt;
          element.imageUrl = elementAPI.imageUrl;
        });
    }
    localStorage.setItem("produit", JSON.stringify(myLocalStorage));
    productsInBasket();
  }
}
