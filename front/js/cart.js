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

  let totalQuantityInBasket = 0;
  let totalPriceInBasket = 0;

  if (myLocalStorage === null || myLocalStorage.length === 0) {
    let emptyCart = `
    <div class="cart__empty">
    <p>Votre panier est vide ! 😢</p>
    </div>
    `;
    cartItem.innerHTML = emptyCart;
  } else {
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

      // -------------------------------------------------
      // Evenements
      // -------------------------------------------------

      // Cibler les éléments pour l'événement change
      let itemQuantity = document.querySelectorAll(".itemQuantity");

      // Ajout de l'évènement change pour modifier la quantité du produit dans le panier
      itemQuantity.forEach((createdQuantity) => {
        createdQuantity.addEventListener("change", (event) => {
          event.preventDefault();
          let setQuantity = parseInt(createdQuantity.value, 10);
          itemQuantity = setQuantity;

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
          } else {
            console.log("Ok, je n'enlève rien");
          }

          productsInBasket();
        });
      });
    }
  }
  totalQuantity.innerHTML = totalQuantityInBasket;
  totalPrice.innerHTML = totalPriceInBasket;
}

fetchAPI();

async function fetchAPI() {
  if (myLocalStorage != null) {
    for await (const element of myLocalStorage) {
      let productIdInBasket = element.id;

      // Recuperer les éléments de l'API
      await fetch(urlAPI + productIdInBasket)
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
  }
  await productsInBasket();
}

// -------------------------------------------------
// Formulaire
// -------------------------------------------------

let contactForm = document.getElementById("form");
let fields = document.querySelectorAll("input[required]");

// Ajouts des événements sur les champs
fields.forEach((field) => {
  field.addEventListener(
    "focus",
    () => {
      onfocus(field);
      resetField(field);
    },
    false
  );
  field.addEventListener(
    "blur",
    () => {
      onblur(field);
      validadeField(field);
    },
    false
  );
});

// Ajout de l'évènement sur l'input du formulaire
contactForm.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();
    fields.forEach((field) => {
      resetField(field);
    });
    let valid = true;

    fields.forEach((field) => {
      if (!validadeField(field)) {
        valid = false;
      }
    });
    if (valid) {
      createContact();
    }
  },
  false
);

// Fonction pour valider un champ
function validadeField(field) {
  if (field.checkValidity()) {
    field.classList.add("valid");
    field.nextElementSibling.classList.add("valid__text");
    field.nextElementSibling.innerHTML = "Champ Valide.";
    return true;
  } else {
    field.classList.add("invalid");
    field.nextElementSibling.innerHTML = field.validationMessage;
    return false;
  }
}

// Fonction pour réinitialiser un champ
function resetField(field) {
  let fieldLabel = field.nextElementSibling;
  field.classList.remove("invalid");
  field.classList.remove("valid");
  field.nextElementSibling.classList.remove("valid__text");

  while (fieldLabel.innerHTML != "") {
    fieldLabel.innerHTML = "";
  }
  field.valid = true;
}

// Fonction pour mettre en valeur le champ en cours
function onfocus(field) {
  field.classList.add("onfocus");
}

function onblur(field) {
  field.classList.remove("onfocus");
}

// Récupérer les valeurs du formulaire
// Création du contact
function createContact() {
  let contact = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    email: document.getElementById("email").value,
  };

  // Fonction Ajouter dans le local storage
  localStorage.setItem("contact", JSON.stringify(contact));

  var productIds = [];
  myLocalStorage.forEach((elt) => {
    productIds.push(elt.id);
  });

  console.log(productIds);

  // Données à envoyé au serveur
  const toSendtoAPI = {
    contact: contact,
    products: productIds,
  };
  send(toSendtoAPI);
}

// Récupérer les valeur du formulaire avec le local Storage (si deja rempli une fois
const getContactValues = localStorage.getItem("contact");

if (getContactValues != null) {
  const getContactValuesObject = JSON.parse(getContactValues);

  // Mettre les valeurs récuperer dans le formulaire
  document.getElementById("firstName").value = getContactValuesObject.firstName;
  document.getElementById("lastName").value = getContactValuesObject.lastName;
  document.getElementById("address").value = getContactValuesObject.address;
  document.getElementById("city").value = getContactValuesObject.city;
  document.getElementById("email").value = getContactValuesObject.email;
}

// Envoyer le formulaire sur le serveur

function send(toSendtoAPI) {
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(toSendtoAPI),
  })
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (value) {
      if (value.orderId != undefined) {
        window.location.href = "confirmation.html" + "?id=" + value.orderId;
      }
    });
}
