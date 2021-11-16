// -------------------------------------------------
// constantes URL
// -------------------------------------------------

const urlAPI = "http://localhost:3000/api/products";

// -------------------------------------------------
// Variables DOM
// -------------------------------------------------

let productItem = document.getElementById("items");

//  -------------------------------------------------
//  Récupérez le résultat de la requête
//  -------------------------------------------------

// Récupérer les éléments pour la page d'accueil dans l'API

function getProducts() {
  // Fetch est asynchrone et renvoi une promesse
  fetch(urlAPI)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((valeur) => {
      valeur.forEach((elementFromAPI) => {
        let item = `<a href="./product.html?id=${elementFromAPI._id}">
          <article>
            <img src="${elementFromAPI.imageUrl}" alt="${elementFromAPI.altTxt}" />
            <h3 class="productName">${elementFromAPI.name}</h3>
            <p class="productDescription">${elementFromAPI.description}</p>
          </article>
        </a>`;
        productItem.innerHTML += item;
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

getProducts();
