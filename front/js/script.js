/* ---------------------------------------------------------------------------- */
/* ----- RECUPERATION DES DONNEES DE L'API ET AFFICHAGE SUR LA PAGE INDEX ----- */
/* ---------------------------------------------------------------------------- */


if(localStorage.length == 0) {
    let createProductsArray = new Array;
    localStorage.setItem("storedProducts", JSON.stringify(createProductsArray));
}

const productsSection = document.getElementById("items");

const productName = document.querySelector("#items a > article > h3");
const productDescription = document.querySelector("#items a > article > p"); // Définition de variables visant les tags infos des produits
const productImage = document.querySelector("#items a > article > img");

fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if(res.ok) {
            return res.json(); // Vérification de la promesse.
        }
    })
    .then(function(value) {
        for(let i=1; i<value.length; i++) { // Commence à 1 car la première carte existait déjà
            let productCardModel = document.querySelector("#items > a").cloneNode(true); 
            productsSection.appendChild(productCardModel); // Création d'une "carte produit" supplémentaire pour chaque produit contenu dans l'API.
        }

        for(let i in value) {
            document.querySelectorAll(".productName")[i].textContent = value[i].name; // Attribution des titres, descriptions et images
            document.querySelectorAll(".productDescription")[i].textContent = value[i].description;
            document.querySelectorAll("#items a > article > img")[i].setAttribute("src", value[i].imageUrl); 
            document.querySelectorAll("#items a > article > img")[i].setAttribute("alt", value[i].altTxt); 
        }
    })
    .catch(function(err) {
        console.error(err);
    });

/* ---------------------------------------------------- */
/* ----- CONFIGURATION DES URLs DES PAGES PRODUITS ---- */
/* ---------------------------------------------------- */

fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if(res.ok) {
            return res.json(); // Vérification de la promesse.
        }
    })
    .then(function(value) {
        for(let i in value) {
            document.querySelectorAll("#items a")[i].setAttribute("href", "./product.html?id=" + value[i]._id);
        } // Ajout des id produits dans les href
    })
    .catch(function(err) {
        console.error(err);
    });
