/* ---------------------------------------------------------------------------- */
/* ----- RECUPERATION DES DONNEES DE L'API ET AFFICHAGE SUR LA PAGE INDEX ----- */
/* ---------------------------------------------------------------------------- */


if(localStorage.length == 0) { // Crée un tableau dans le localStorage si ce dernier est vide
    let createProductsArray = [];
    localStorage.setItem("storedProducts", JSON.stringify(createProductsArray));
}

const productsSection = document.getElementById("items");

fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if(res.ok) { // Vérification de la promesse
            return res.json(); // Retourne un objet JSON
        }
    })
    .then(function(value) {
        for(let i=1; i<value.length; i++) { // Commence à 1 car la première carte existait déjà
            let productCardModel = document.querySelector("#items > a").cloneNode(true); 
            productsSection.appendChild(productCardModel); // Création d'une "carte produit" supplémentaire pour chaque produit contenu dans l'API
        }

        for(let i=0; i<value.length; i++) {
            document.querySelectorAll(".productName")[i].textContent = value[i].name; // Attribution des titres, descriptions et images
            document.querySelectorAll(".productDescription")[i].textContent = value[i].description;
            document.querySelectorAll("#items a > article > img")[i].setAttribute("src", value[i].imageUrl); 
            document.querySelectorAll("#items a > article > img")[i].setAttribute("alt", value[i].altTxt); 
        }
    })
    .catch(function(err) { 
        console.error(err); // Récupération et affichage des erreurs
    });

/* ---------------------------------------------------- */
/* ----- CONFIGURATION DES URLs DES PAGES PRODUITS ---- */
/* ---------------------------------------------------- */

fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if(res.ok) {
            return res.json(); 
        }
    })
    .then(function(value) {
        for(let i=0; i<value.length; i++) {
            document.querySelectorAll("#items a")[i].setAttribute("href", "./product.html?id=" + value[i]._id);
        } // Sélectionne les liens menant vers les pages Produit et passe l'ID du produit dans l'URL
    })
    .catch(function(err) {
        console.error(err); // Récupération et affichage des erreurs
    });
