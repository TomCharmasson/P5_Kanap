// En JS, commencez par requêter l’API pour lui demander l’ensemble des produits ; récupérer la réponse émise, et parcourir celle-ci pour insérer chaque élément (chaque produit) dans la page d’accueil (dans le DOM)

// -------------------------------------------------
// Constantes
// -------------------------------------------------
const item = document.getElementById("items");

// -------------------------------------------------
// Récupérez le résultat de la requête
// -------------------------------------------------

function getProducts(urlToFetch, indexTableau) {
  fetch(urlToFetch)
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (value) {
      item.innerHTML = value[indexTableau].name;
    })
    .catch(function (err) {
      // Une erreur est survenue
    });
}

getProducts("http://localhost:3000/api/products", 0);

// -------------------------------------------------
// Récupérer le résultat de la requete (fonction fléché)
// -------------------------------------------------

/*
function GetProducts() {
  fetch("http://localhost:3000/api/products").then((response) => {
    if (response.ok) {
      response.json().then((data) => {
        item.innerHTML = data;
      });
    } else {
      console.error("error :");
    }
  });
}

GetProducts();
*/

// -------------------------------------------------
// Faire plusieurs requetes
// -------------------------------------------------
/*

Promise.all([get(url1), get(url2)])
.then(function (results) {
  return Promise.all([results, post(url3)]);
})
  .then(function (allResults) {
    // We are done here !
  });

  */
