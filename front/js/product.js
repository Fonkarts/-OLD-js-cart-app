/* -------------------------------------------------------------------------- */
/* ----- RECUPERATION DE L'ID DE L'URL ET AFFICHAGE DES DETAILS PRODUITS ---- */
/* -------------------------------------------------------------------------- */


const productImage = document.querySelector(".item__img > img");
const productName = document.getElementById("title");
const productPrice = document.getElementById("price");
const productDescription = document.getElementById("description");

const params = new URLSearchParams(window.location.search);
const urlId = params.get("id"); // Recherche de l'ID produit dans l'URL

fetch("http://localhost:3000/api/products/" + urlId) // Cible le produit correspondant à l'ID 
    .then(function(res) {                              // récupéré dans l'URL.
        if(res.ok){
            return res.json();
        }
    })
    .then(function(value) {
        if(value === undefined) { // Si le produit n'existe pas dans l'API
            document.querySelector(".item").textContent = "Le produit sélectionné n'est pas ou plus disponible. Merci de consulter les articles disponibles en Page d'Accueil.";

        } else { // Sinon, s'il existe bien...
            productImage.setAttribute("src", value.imageUrl);
            productImage.setAttribute("alt", value.altTxt); // Attribution des infos produit
            productName.textContent = value.name;
            productName.dataset.name = value.name;
            productPrice.textContent = value.price;
            productPrice.dataset.price = value.price;
            productDescription.textContent = value.description;
    
            let initialOptions = document.querySelectorAll("option");
            initialOptions.forEach(function(tag) { // Supression des tag <option> initiaux
                tag.remove();
            });
    
            value.colors.forEach(function() { // Création du nombre nécessaire de <option>
                let newOption = document.createElement("option");
                document.querySelector("select").append(newOption);
            });
            for(let i=0; i< value.colors.length; i++) { // Intégration des couleurs dans les <option>
                document.querySelectorAll("option")[i].textContent = value.colors[i];
            }
        }

    })
    .catch(function(err) {
        console.error(err); // Récupération et affichage des erreurs
    });

/* ------------------------------------------------------------------------------------------- */
/* ----- ECOUTE CHOIX COULEUR, QUANTITE, CLICK DU BOUTON PANIER ET STOCKAGE LOCAL STORAGE ---- */
/* ------------------------------------------------------------------------------------------- */

const select = document.getElementById("colors");

const itemQty = document.getElementById("quantity");

const addToCartButton = document.getElementById("addToCart");

const productDataPrice = productPrice.getAttribute("data-price");

class product { // Création d'une classe d'objets destiné à stocker les infos du produit dans le localStorage
    constructor (id, qty, color, imageUrl, altTxt, name, price) {
        this.id = id;
        this.qty = qty;
        this.color = color;
        
        // RAJOUT DE "imageUrl", "altTxt", "name" et "price" POUR EVITER UNE NOUVELLE REQUETE GET DANS cart.js

        this.imageUrl = imageUrl;
        this.altTxt = altTxt; 
        this.name = name; 
        this.price = price;

        // MAIS SI CET OBJET NE DOIT CONTENIR STRICTEMENT QUE L'ID, LA QTé ET LA COULEUR :
        // UNE AUTRE SOLUTION SERAIT D'EFFECTUER UNE REQUETE GET DANS cart.js POUR OBTENIR CES INFORMATIONS SEULEMENT
    }
}


addToCartButton.addEventListener("click", function() { // Ecoute au clic du bouton d'ajout au Panier
    if(itemQty.value>0 && itemQty.value<101) {

        let storedProducts = JSON.parse(localStorage.getItem("storedProducts"));

        let storedProduct = new product (
            urlId, 
            itemQty.value, 
            select.options[select.selectedIndex].text,
            productImage.getAttribute("src"),
            productImage.getAttribute("alt"),
            productName.getAttribute("data-name"),
            productPrice.getAttribute("data-price")
            ); // Création d'une nouvelle instance de classe contenant les informations du produit

        storedProducts.push(storedProduct); // Stockage du nouvel objet dans le tableau "storedProducts"
        localStorage.setItem("storedProducts", JSON.stringify(storedProducts)); // Stockage du tableau dans le localStorage

        addToCartButton.textContent = "Produit(s) ajouté(s) !";
        
        for(let i=0; i<(storedProducts.length-1); i++) { // Parcourt tous les produits du localStorage, sauf celui venant d'être ajouté (car ultérieurement supprimé)

            let sameId = storedProducts[i].id == urlId;
            let sameColor = storedProducts[i].color == select.options[select.selectedIndex].text;
        
            if(sameId && sameColor) { // Si ID et COLOR existent déjà dans storedProducts
 
                let initialQty = parseInt(storedProducts[i].qty);
                let updatedQty = initialQty + parseInt(itemQty.value); // Mise à jour de la qté du produit pré-existant
                let updatedProduct = new product (
                    storedProducts[i].id, 
                    JSON.stringify(updatedQty), 
                    storedProducts[i].color,
                    productImage.getAttribute("src"),
                    productImage.getAttribute("alt"),
                    productName.getAttribute("data-name"),
                    productPrice.getAttribute("data-price")
                    );
                
                storedProducts[i] = updatedProduct; // Mise à jour des valeur de l'objet contenant les informations du produit pré-existant            
                storedProducts.pop(); // Suppression de la dernière entrée (dont la qté était à rajouter au produit pré-existant)
                localStorage.setItem("storedProducts", JSON.stringify(storedProducts)); // Màj du localStorage
            }
        }
    } else {
        addToCartButton.textContent = "Quantité incorrecte !";
    }
});