/* ---------------------------------------------------------------------------- */
/* ----- RECUPERATION DES DONNEES DE L'API ET AFFICHAGE SUR LA PAGE INDEX ----- */
/* ---------------------------------------------------------------------------- */


if(localStorage.length == 0) { // Crée un tableau dans le localStorage si ce dernier est vide
    let createProductsArray = [];
    localStorage.setItem("storedProducts", JSON.stringify(createProductsArray));
}

const productsSection = document.getElementById("items");

function productExists(element) {
    if(element !== undefined) {
        return true;
    } else {
        return false;
    }
};

fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if(res.ok) { // Vérification de la promesse
            return res.json(); // Retourne un objet JSON
        }
    })
    .then(function(value) {

        for(let i=1; i<value.length; i++) { // Commence à 1 car la première carte existait déjà
            // REMPLACER "value.length" CI-DESSUS PAR "(value.length)+1" POUR TESTER LA FONCTION "productExists()"

            if(productExists(value[i])) { // Si le produit existe
                let productCardModel = document.querySelector("#items > a").cloneNode(true); 
                productsSection.appendChild(productCardModel); // Création d'une "carte produit" supplémentaire pour chaque produit contenu dans l'API
            } else {
                console.log("Attention, le produit à l'index " + [i] + " vaut 'undefined'. Sa carte n'a pas été crée.");
            }
        }

        for(let i=0; i<value.length; i++) {
            // REMPLACER "value.length" CI-DESSUS PAR "(value.length)+1" POUR TESTER LA FONCTION "productExists()"

            if(productExists(value[i])) {
                document.querySelectorAll(".productName")[i].textContent = value[i].name; // Attribution des titres, descriptions et images
                document.querySelectorAll(".productDescription")[i].textContent = value[i].description;
                document.querySelectorAll("#items a > article > img")[i].setAttribute("src", value[i].imageUrl); 
                document.querySelectorAll("#items a > article > img")[i].setAttribute("alt", value[i].altTxt); 
                
                document.querySelectorAll("#items a")[i].setAttribute("href", "./product.html?id=" + value[i]._id);
                // L'ID du produit est passé dans l'URL menant vers la page Produit
            } else {
                document.querySelectorAll("#items a > article > img")[i].setAttribute("src", "./front/images/logo.png");
                document.querySelectorAll("#items a > article > h3")[i].textContent = "Produit Indisponible";
                document.querySelectorAll("#items a > article > p")[i].textContent = "";
            }
        }
    })
    .catch(function(err) { 
        console.error(err); // Récupération et affichage des erreurs
    });