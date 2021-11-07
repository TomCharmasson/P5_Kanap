// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// Afficher les détails d'un produit
// ----------------------------------------------------------------------

// -------------------------------------------------
// URL API
// -------------------------------------------------

const urlAPI = "http://localhost:3000/api/products/";

// -------------------------------------------------
// Récuperer l'Id dans l'url de la page courante
// -------------------------------------------------

var urlcourante = document.location.href;

var url = new URL(urlcourante);

var search_params = new URLSearchParams(url.search);

var productId = "";
if (search_params.has("id")) {
  productId = search_params.get("id");
}

// -------------------------------------------------
// Variables DOM
// -------------------------------------------------

// Variable procductId juste la haut ↑↑↑
let productImage = document.getElementsByClassName("item__img")[0];
let productName = document.getElementById("title");
let productPrice = document.getElementById("price");
let productDescription = document.getElementById("description");
let productColor = document.getElementById("colors");

//  -------------------------------------------------
//  Requete de l'API
//  Récupérez le résultat de la requête
//  Aficher les éléments pour la page produits
//  -------------------------------------------------

function getProductsDetails() {
  fetch(urlAPI + productId)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((valeur) => {
      productName.innerHTML = valeur.name;

      productPrice.innerHTML = valeur.price;

      productDescription.innerHTML = valeur.description;

      let image = '<img src="' + valeur.imageUrl + '" alt="' + valeur.altTxt + '"></img>';
      productImage.innerHTML = image;

      valeur.colors.forEach((elt) => {
        let colorSelected = '<option value="' + elt + '">' + elt + "</option>";
        productColor.innerHTML += colorSelected;
      });
    });
}

// Appel de la fonction :
getProductsDetails();

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
//  Ajout dans le panier
// ----------------------------------------------------------------------

// Ecouter l'évenement click sur le bouton ajouter au panier
let ajouterAuPanier = document.getElementById("addToCart");

ajouterAuPanier.addEventListener("click", (event) => {
  event.preventDefault();

  // Création de variables pour le panier
  // Obtenir la couleur selectionnée
  let getTheColor = document.getElementById("colors");
  let colorSelected = getTheColor.options[getTheColor.selectedIndex].value;
  // Obtenir la quantité seléctionnée
  let productQuantity = document.querySelector('.item__content__settings__quantity input[value="1"]').valueAsNumber;
  let resetProductQuantity = document.querySelector("#quantity");

  // Vérifier que tous les champs ont été renseignés (couleur et quantité)
  if (colorSelected === "") {
    window.alert("Veuillez renseigner une couleur");
    return;
  }

  if (isNaN(productQuantity) || productQuantity === 0 || productQuantity > 100) {
    resetProductQuantity.valueAsNumber = 1;
    window.alert("Veuillez renseigner un nombre compris entre 1 et 100");
    return;
  }

  // Création objet contenant 3 valeurs d'un produit destiné au LocalStorage
  let productOption = {
    id: productId,
    quantity: productQuantity,
    color: colorSelected,
  };

  // Créer un tableau dans le localStorage
  let myLocalStorage = JSON.parse(localStorage.getItem("produit"));

  // Vérifie que MyLocalStorage existe
  if (myLocalStorage === null) {
    myLocalStorage = [];
  }

  // Fonction Ajouter dans le local storage
  const addProductToLocalStorage = () => {
    myLocalStorage.push(productOption);
    localStorage.setItem("produit", JSON.stringify(myLocalStorage));
  };

  // Fonction qui vérifie si le même produit existe (même Id et même couleur)
  const raiseTheQuantityIfSameProduct = () => {
    let foundTheSameProduct = false;
    myLocalStorage.forEach((element) => {
      if (element.id === productId && element.color === colorSelected) {
        element.quantity += productQuantity;
        foundTheSameProduct = true;
      }
    });
    if (!foundTheSameProduct) {
      // Appel de la fonction suivante :
      addProductToLocalStorage();
    }
  };

  // Appel la Fonction suivante :
  raiseTheQuantityIfSameProduct();

  localStorage.setItem("produit", JSON.stringify(myLocalStorage));

  // Fonction Confirmation ajout au panier
  const confirmation = () => {
    if (window.confirm(`Ajouté au panier ✅😁 ! Cliquer OK pour voir votre panier ou ANNULER pour continuer le shopping 💸 !`)) {
      window.location.href = "cart.html";
    } else {
      window.location.href = "index.html";
    }
  };

  // Appel la Fonction suivante :
  confirmation();
});
