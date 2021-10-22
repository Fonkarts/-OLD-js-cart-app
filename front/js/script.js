/* ---------------------------------------------------------------------------- */
/* ----- RECUPERATION DES DONNEES DE L'API ET AFFICHAGE SUR LA PAGE INDEX ----- */
/* ---------------------------------------------------------------------------- */

/*class product {
    constructor(altTxt, colors, description, imageUrl, name, price, _id) { 
        this.altTxt = altTxt;
        this.colors = colors;
        this.description = description; // Création d'une classe product destinée à contenir les informations d'un produit.
        this.imageUrl = imageUrl;
        this.name = name;
        this.price = price;
        this._id = _id;
    }
}*/

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
        console.log(value); // Visualisation des informations.
    
        // Création de nouveaux objets de classe "product" et attribution de leurs valeurs respectives depuis l'API

        /*let product1 = new product(value[0].altTxt, value[0].colors, value[0].description, value[0].imageUrl, value[0].name, value[0].price, value[0]._id);*/
        /*let product2 = new product(value[1].altTxt, value[1].colors, value[1].description, value[1].imageUrl, value[1].name, value[1].price, value[1]._id);
        let product3 = new product(value[2].altTxt, value[2].colors, value[2].description, value[2].imageUrl, value[2].name, value[2].price, value[2]._id);
        let product4 = new product(value[3].altTxt, value[3].colors, value[3].description, value[3].imageUrl, value[3].name, value[3].price, value[3]._id);
        let product5 = new product(value[4].altTxt, value[4].colors, value[4].description, value[4].imageUrl, value[4].name, value[4].price, value[4]._id);
        let product6 = new product(value[5].altTxt, value[5].colors, value[5].description, value[5].imageUrl, value[5].name, value[5].price, value[5]._id);
        let product7 = new product(value[6].altTxt, value[6].colors, value[6].description, value[6].imageUrl, value[6].name, value[6].price, value[6]._id);
        let product8 = new product(value[7].altTxt, value[7].colors, value[7].description, value[7].imageUrl, value[7].name, value[7].price, value[7]._id);*/

        for(let i=1; i<value.length; i++) { // Commence à 1 car la première carte existait déjà
            let productCardModel = document.querySelector("#items > a").cloneNode(true); 
            productsSection.appendChild(productCardModel); // Création d'une "carte produit" supplémentaire pour chaque produit contenu dans l'API.
        }

        for(let i in value) {
            document.querySelectorAll(".productName")[i].textContent = value[i].name; // Attribution des titres, descriptions et images
            document.querySelectorAll(".productDescription")[i].textContent = value[i].description;
            document.querySelectorAll("#items a > article > img")[i].setAttribute("src", value[i].imageUrl); 
            document.querySelectorAll("#items a > article > img")[i].setAttribute("alt", value[i].altTxt); 

            /*console.log(value[i]._id);*/
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
