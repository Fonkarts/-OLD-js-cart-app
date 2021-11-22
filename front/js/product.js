/* -------------------------------------------------------------------------- */
/* ----- RECUPERATION DE L'ID DE L'URL ET AFFICHAGE DES DETAILS PRODUITS ---- */
/* -------------------------------------------------------------------------- */

const productImage = document.querySelector(".item__img > img");
const productName = document.getElementById("title");
const productPrice = document.getElementById("price");
const productDescription = document.getElementById("description");

const currentUrl = new URLSearchParams(window.location.search);
const urlId = currentUrl.get("id"); // Recherche de l'identifiant produit dans l'URL

fetch("http://localhost:3000/api/products/" + urlId) // Cible le produit correspondant à l'ID 
    .then(function(res) {                              // récupéré dans l'URL.
        if(res.ok){
            return res.json(); // Vérification du résultat
        }
    })
    .then(function(value) {
        productImage.setAttribute("src", value.imageUrl);
        productImage.setAttribute("alt", value.altTxt); // Attribution des infos produit
        productName.textContent = value.name;
        productPrice.textContent = value.price;
        productDescription.textContent = value.description;

        let initialOptions = document.querySelectorAll("option");
        initialOptions.forEach(function(tag) { // Supression des tag <option> initiaux
            tag.remove();
        })

        value.colors.forEach(function() { // Création du nombre nécessaire de <option>
            let newOption = document.createElement("option");
            document.querySelector("select").append(newOption);
        });

        for(let i=0; i< value.colors.length; i++) { // Intégration des couleurs dans les <option>
            document.querySelectorAll("option")[i].textContent = value.colors[i];
        }
    })
    .catch(function(err) {
        console.error(err); // Récupération des erreurs
    });

/* ------------------------------------------------------------------------------------------- */
/* ----- ECOUTE CHOIX COULEUR, QUANTITE, CLICK DU BOUTON PANIER ET STOCKAGE LOCAL STORAGE ---- */
/* ------------------------------------------------------------------------------------------- */

const select = document.getElementById("colors");

const itemQty = document.getElementById("quantity");

const addToCartButton = document.getElementById("addToCart");

class product {
    constructor (id, qty, color) {
        this.id = id;
        this.qty = qty;
        this.color = color;
    }
}

addToCartButton.addEventListener("click", function(e) {
    if(itemQty.value>0 && itemQty.value<101) {

        let storedProducts = JSON.parse(localStorage.getItem("storedProducts"));

        let storedProduct = new product (urlId, itemQty.value, select.options[select.selectedIndex].text);

        storedProducts.push(storedProduct);
        localStorage.setItem("storedProducts", JSON.stringify(storedProducts));

        addToCartButton.textContent = "Produit(s) ajouté(s) !";
        
        for(let i=0; i<(storedProducts.length-1); i++) {

            let sameId = storedProducts[i].id == urlId;
            let sameColor = storedProducts[i].color == select.options[select.selectedIndex].text;
        
            if(sameId && sameColor) { // Si ID et COLOR existent déjà dans storedProducts
 
                let initialQty = parseInt(storedProducts[i].qty);
                let updatedQty = initialQty + parseInt(itemQty.value);
                let updatedProduct = new product (storedProducts[i].id, JSON.stringify(updatedQty), storedProducts[i].color);

                storedProducts[i] = updatedProduct;                
                storedProducts.pop();
                localStorage.setItem("storedProducts", JSON.stringify(storedProducts));
            }
        }
    } else {
        addToCartButton.textContent = "Quantité incorrecte !";
    }
});