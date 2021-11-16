// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// Afficher les détails du panier
// ----------------------------------------------------------------------

// -------------------------------------------------
// URL API
// -------------------------------------------------

const urlAPI = "http://localhost:3000/api/products/";

// -------------------------------------------------
// Variables DOM
// -------------------------------------------------

let cartItem = document.querySelector("#cart__items");
let totalQuantity = document.querySelector("#totalQuantity");
let totalPrice = document.querySelector("#totalPrice");

// -------------------------------------------------
// Cibler le local storage
// -------------------------------------------------

let myLocalStorage = JSON.parse(localStorage.getItem("produit"));

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// Recuperer les données de l'API
// ----------------------------------------------------------------------

// Faire un seul appel API pour tous les produits du panier pour eviter de faire plusieurs appels à chaque modification du panier

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
        .then((elementFromAPI) => {
          element.name = elementFromAPI.name;
          element.price = elementFromAPI.price;
          element.altTxt = elementFromAPI.altTxt;
          element.imageUrl = elementFromAPI.imageUrl;
        })
        .catch((err) => {
          console.log(err);
        });
    }
    localStorage.setItem("produit", JSON.stringify(myLocalStorage));
  }
  // Appel de la fonction :
  productsInBasket();
}

// Appel de la fonction :
fetchAPI();

// -------------------------------------------------
// Afficher les produits dans le panier
// -------------------------------------------------

function productsInBasket() {
  // initialise la valeur du panier
  cartItem.innerHTML = "";

  // Variables Totaux des produits
  let totalQuantityInBasket = 0;
  let totalPriceInBasket = 0;

  // Verifier si le localStorage est vide
  if (myLocalStorage === null || myLocalStorage.length === 0) {
    let emptyCartText = `
    <div class="cart__empty">
      <p>Votre panier est vide ! 😢</p>
    </div>`;
    cartItem.innerHTML = emptyCartText;

    // Afficher les elements sur la page
  } else {
    for (const element of myLocalStorage) {
      let productColorInBasket = element.color;
      let productQuantityInBasket = element.quantity;

      let elt = `<article class="cart__item" data-id="${element.id}">
          <div class="cart__item__img">
            <img src="${element.imageUrl}" alt="${element.altTxt}">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__titlePrice">
              <h2>${element.name}</h2>
              <p>Couleur : ${productColorInBasket}</p>
              <p class="item__price__update">${element.price * productQuantityInBasket},00 €</p>
            </div>
            <div class="cart__item__content__settings">
              <div class="cart__item__content__settings__quantity">
                <p class="item__quantity__update">Qté : ${productQuantityInBasket}</p>
                <input type="number" id="${element.id}-${productColorInBasket}" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productQuantityInBasket}">
              </div>
              <div class="cart__item__content__settings__delete">
                <p id="${element.id}-${productColorInBasket}" class="deleteItem">Supprimer</p>
              </div>
            </div>
          </div>
        </article>`;

      totalQuantityInBasket += productQuantityInBasket;
      totalPriceInBasket += productQuantityInBasket * element.price;

      cartItem.innerHTML += elt;

      // ----------------------------------------------------------------------
      // Evenements
      // ----------------------------------------------------------------------

      // -------------------------------------------------
      // Evenement pour la modification de la quantitée
      // -------------------------------------------------

      // Cibler les éléments pour l'événement change
      let itemQuantity = document.querySelectorAll(".itemQuantity");

      // Ajout de l'évènement change pour modifier la quantitée du produit dans le panier
      itemQuantity.forEach((createdQuantity) => {
        createdQuantity.addEventListener("change", (event) => {
          event.preventDefault();

          let setQuantity = parseInt(createdQuantity.value, 10);
          itemQuantity = setQuantity;

          // Vérifie que l'utilisateur renseigne correctement le champ
          if (isNaN(itemQuantity) || itemQuantity === 0 || itemQuantity > 100) {
            setQuantity = 1;
            createdQuantity.value = 1;
            window.alert("Veuillez renseigner une quantitée comprise entre 1 et 100 ou supprimer votre arcticle");
          }

          // Modification de la quantitée dans le LocalStorage
          myLocalStorage.forEach((element) => {
            if (element.id + "-" + element.color === createdQuantity.id) {
              element.quantity = setQuantity;
              localStorage.setItem("produit", JSON.stringify(myLocalStorage));
            }
          });

          // Appel de la fonction :
          productsInBasket();
        });
      });

      // -------------------------------------------------
      // Evenement pour la suppression d'un produit
      // -------------------------------------------------

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

          // Appel de la fonction :
          productsInBasket();
        });
      });
    }
  }
  // Affiche les totaux
  totalQuantity.innerHTML = totalQuantityInBasket;
  totalPrice.innerHTML = totalPriceInBasket;
}

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// Formulaire
// ----------------------------------------------------------------------

// -------------------------------------------------
// Variables DOM
// -------------------------------------------------

let contactForm = document.getElementById("form");
let fields = document.querySelectorAll("input[required]");

// ----------------------------------------------------------------------
// Ajouts des événements sur les champs du formulaire
// ----------------------------------------------------------------------

// -------------------------------------------------
// Controle les champs du formulaire
// -------------------------------------------------

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

// -------------------------------------------------
// Fonctions
// -------------------------------------------------

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

// Fonctions pour mettre en valeur le champ en cours
function onfocus(field) {
  field.classList.add("onfocus");
}

function onblur(field) {
  field.classList.remove("onfocus");
}

// -------------------------------------------------
// Ajout de l'évènement sur la soumission du formulaire
// -------------------------------------------------

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
    if (myLocalStorage === null || myLocalStorage.length === 0) {
      window.alert("Votre Panier est Vide 😅");
    } else if (valid) {
      createContact();
    }
  },
  false
);

// -------------------------------------------------
// Récupérer les valeurs du formulaire
// -------------------------------------------------

// Fonction pour la création du contact
function createContact() {
  // Creation d'un objet contact
  let contact = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    email: document.getElementById("email").value,
  };

  // Ajouter l'objet contact dans le local storage
  localStorage.setItem("contact", JSON.stringify(contact));

  // Création d'un array pour l'id des produits
  let productIds = [];
  myLocalStorage.forEach((elt) => {
    productIds.push(elt.id);
  });

  // Données à envoyé au serveur
  const toSendtoAPI = {
    contact: contact,
    products: productIds,
  };

  // Appel de la fonction :
  send(toSendtoAPI);
}

// -------------------------------------------------
// Envoyer le formulaire sur le serveur
// -------------------------------------------------

// Fonction pour envoyer les données au serveur
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
    })
    .catch((err) => {
      console.log(err);
    });
}

// -------------------------------------------------
// Rempli le formulaire automatiquement avec les données du local storage (si deja rempli une fois)
// -------------------------------------------------

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
