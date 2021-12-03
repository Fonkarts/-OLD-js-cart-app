/* ------------------------------------------------------------------- */
/* ----- RECUPERATION INFOS LOCAL STORAGE/API ET AFFICHAGE PANIER ---- */
/* ------------------------------------------------------------------- */


class product {
    constructor (id, qty, color, imageUrl, altTxt, name, price) {
        this.id = id;
        this.qty = qty;
        this.color = color;
        this.imageUrl = imageUrl;
        this.altTxt = altTxt; 
        this.name = name; 
        this.price = price;
    }
}

let storedProducts = JSON.parse(localStorage.getItem("storedProducts"));

if(storedProducts.length == 0) {
    document.querySelector("#cart__items > article").textContent = "Votre panier est vide !";
} else {
    let n=1; 
    while(n < storedProducts.length) {
        const cartItem = document.querySelector("#cart__items > article").cloneNode(true);
        document.getElementById("cart__items").appendChild(cartItem);
        n++;
        // Création d'articles supplémentaires selon le nombre de produits sélectionnés (article pré-existant dans HTML conservé, d'où n=1)
    }
}

const cartTotalQty = document.getElementById("totalQuantity");
let totalQtySum = 0;
let totalPriceSum = 0;

for(let i=0; i<storedProducts.length; i++) {
    totalQtySum += parseInt(storedProducts[i].qty); // Calcul de la qté totale de produits
}
cartTotalQty.textContent = totalQtySum;

for(let i=0; i<storedProducts.length; i++) { // REQUETE GET SUPPRIMEE

    const cartImage = document.querySelectorAll(".cart__item__img > img")[i];
    const cartName = document.querySelectorAll(".cart__item__content__titlePrice > h2")[i];
    const cartPrice = document.querySelectorAll(".cart__item__content__titlePrice > p")[i];
    const cartQty = document.querySelectorAll(".itemQuantity")[i];

    cartImage.setAttribute("src", storedProducts[i].imageUrl); // Attribution des informations Produits
    cartImage.setAttribute("alt", storedProducts[i].altTxt); // depuis l'API et le localStorage
    cartName.textContent = storedProducts[i].name + ", " + storedProducts[i].color;
    cartPrice.textContent = storedProducts[i].price + "€";
    cartQty.setAttribute("value", storedProducts[i].qty);
    totalPriceSum += parseFloat(storedProducts[i].qty*storedProducts[i].price); // Calcul du prix total
    document.getElementById("totalPrice").textContent = totalPriceSum + ",00";

    // Ecoute changement de quantités de chaque produit, recalcule quantités et prix totaux
    cartQty.addEventListener("change", function() { 
        totalQtySum -= parseInt(storedProducts[i].qty); // Retrait de la qté du produit
        totalPriceSum -= storedProducts[i].price*storedProducts[i].qty; // Retrait du prix du produit, selon qté

        storedProducts[i].qty = cartQty.value; // Définition nouvelle qté
        let updatedProduct = new product (
            storedProducts[i].id,
            storedProducts[i].qty,
            storedProducts[i].color,
            storedProducts[i].imageUrl,
            storedProducts[i].altTxt,
            storedProducts[i].name,
            storedProducts[i].price
            );

        storedProducts[i] = updatedProduct;
        localStorage.setItem("storedProducts", JSON.stringify(storedProducts)); // MàJ localStorage

        totalQtySum += parseInt(storedProducts[i].qty); // MàJ qté totale
        cartTotalQty.textContent = totalQtySum;
        
        totalPriceSum += storedProducts[i].price*storedProducts[i].qty; // MàJ prix total
        document.getElementById("totalPrice").textContent = totalPriceSum + ",00";
    });
}

for(let i=0; i<storedProducts.length; i++) {
    // Sélectionne tous les boutons "Supprimer" et écoute les clics

    let thisDelButton = document.querySelectorAll(".deleteItem")[i];
    let thisProduct = document.querySelectorAll(".cart__item")[i];

    thisDelButton.addEventListener("click", () => {
        if(storedProducts[i].id == thisProduct.dataset.id) { // Si le data-id correspond à un ID dans le localStorage

            storedProducts.splice(i, 1); // Supprime 1 objet du tableau "storedProducts" à partir de l'indice "i"
            localStorage.setItem("storedProducts", JSON.stringify(storedProducts));
    
            location.reload(); // Raffraîchit la page afin de mettre à jour les informations
        }
    });
}

/* --------------------------------------------------------------------------------- */
/* ----- VERIFICATION DONNEES SAISIES DANS FORMULAIRE ET CREATION OBJET CONTACT ---- */
/* --------------------------------------------------------------------------------- */

const contact = { // Objet destiné à recevoir les informations du formulaire à envoyer à l'API
    firstName : "",
    lastName : "",
    address : "",
    city : "",
    email : ""
};

let firstNameOk = false; // Booléens de vérification de formulaire
let lastNameOk = false;
let addressOk = false;
let cityOk = false;
let mailOk = false;

const form = document.querySelector(".cart__order__form");


// VALIDATION PRENOM
form.firstName.addEventListener("change", function() { // Ecoute du changement de valeur du champ
    validFirstName(this); // Application de la fonction de validation
});

const validFirstName = function(inputFirstName) {

    let firstNameRegex = new RegExp("^((([A-za-zàáâãäåçèéêëìíîïðòóôõöùúûüýÿ']+[\s | -]{1}[A-za-zàáâãäåçèéêëìíîïðòóôõöùúûüýÿ']+)+)|([A-Za-zàáâãäåçèéêëìíîïðòóôõöùúûüýÿ']+))$", "g", "i");
    // L'expression régulière à laquelle doit se conformer la valeur du champ
    let feedBackTxt = inputFirstName.nextElementSibling;

    if(firstNameRegex.test(inputFirstName.value) && stringCheck(inputFirstName.value)) { // Si la valeur est conforme à l'expression régulière ci-dessus...

        feedBackTxt.innerText = "Prénom Valide"; // ... un message de validation apparaît,
        contact.firstName = form.firstName.value; // la valeur est stockée dans l'objet "contact",
        firstNameOk = true; // et le booléen passe de FALSE à TRUE.

    } else {
        feedBackTxt.innerText = "Votre Prénom n'est pas valide"; // Sinon, message d'erreur
    }
    // Idem pour les autres champs du formulaire
};

// VALIDATION NOM
form.lastName.addEventListener("change", function() {
    validLastName(this);
});

const validLastName = function(inputLastName) {
    
    let lastNameRegex = new RegExp("^((([A-za-zàáâãäåçèéêëìíîïðòóôõöùúûüýÿ']+[\s | -]{1}[A-za-zàáâãäåçèéêëìíîïðòóôõöùúûüýÿ']+)+)|([A-Za-zàáâãäåçèéêëìíîïðòóôõöùúûüýÿ']+))$", "g", "i");
    let feedBackTxt = inputLastName.nextElementSibling;

    if(lastNameRegex.test(inputLastName.value) && stringCheck(inputLastName.value)) {

        feedBackTxt.innerText = "Nom Valide";
        contact.lastName = form.lastName.value;
        lastNameOk = true;

    } else {
        feedBackTxt.innerText = "Votre Nom n'est pas valide";
    }
};

// VALIDATION ADRESSE
form.address.addEventListener("change", function() {
    validAddress(this);
});

const validAddress = function(inputAddress) {

    let addressRegex = new RegExp("^([0-9]+[\s | ,]{1,2})*(([a-zA-Z0-9àáâãäåçèéêëìíîïðòóôõöùúûüýÿ']{1,30}[\s | -]{1}[a-zA-Z0-9àáâãäåçèéêëìíîïðòóôõöùúûüýÿ']{1,30})+)$", "g", "i");

    let feedBackTxt = inputAddress.nextElementSibling;

    if(addressRegex.test(inputAddress.value) && stringCheck(inputAddress.value)) {

        feedBackTxt.innerText = "Adresse Valide";
        contact.address = form.address.value;
        addressOk = true;

    } else {
        feedBackTxt.innerText = "Votre Adresse n'est pas valide";
    }
};

// VALIDATION VILLE
form.city.addEventListener("change", function() {
    validCity(this);
});

const validCity = function(inputCity) {

    let cityRegex = new RegExp("^((([A-za-zàáâãäåçèéêëìíîïðòóôõöùúûüýÿ']+[\s | -]{1}[A-za-zàáâãäåçèéêëìíîïðòóôõöùúûüýÿ']+)+)|([A-Za-zàáâãäåçèéêëìíîïðòóôõöùúûüýÿ']+))$", "g", "i");
    let feedBackTxt = inputCity.nextElementSibling;

    if(cityRegex.test(inputCity.value) && stringCheck(inputCity.value)) {

        feedBackTxt.innerText = "Ville Valide";
        contact.city = form.city.value;
        cityOk = true;

    } else {
        feedBackTxt.innerText = "Votre Ville n'est pas valide";
    }
};

// VALIDATION EMAIL
form.email.addEventListener("change", function() {
    validEmail(this);
});

const validEmail = function(inputEmail) {

    let mailRegex = new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$", "g");
    let feedBackTxt = inputEmail.nextElementSibling;

    if(mailRegex.test(inputEmail.value) && stringCheck(inputEmail.value)) {

        feedBackTxt.innerText = "Email Valide";
        contact.email = form.email.value;
        mailOk = true;

    } else {
        feedBackTxt.innerText = "Votre Email n'est pas valide";
    }
};

/* -------------------------------------------------------------------------------- */
/* ----- ECOUTE CLIC BOUTON COMMANDE, VERIFICATION ET ENVOI DONNEES ---- */
/* -------------------------------------------------------------------------------- */

const orderButton = document.getElementById("order");

let formTest = document.querySelector(".cart__order__form");
formTest.setAttribute("method", "post");

const stringCheck = (elt) => { // FONCTION vérifiant que l'élément est bien une chaîne de caractères
    if(typeof elt === "string") {
        return true;
    } else {
        return false;
    }
};

let products = []; // Création d'un tableau destiné à stocker les ID des produits mis au Panier
let arrayIdCheck = false;

for(i=0; i< storedProducts.length; i++) {

    const cartArticle = document.querySelectorAll(".cart__item")[i];
    cartArticle.dataset.id = storedProducts[i].id;
    let cartArticleId = cartArticle.getAttribute("data-id"); // Récupération des PRODUCT-ID dans l'HTML
    products.push(cartArticleId); // Stockage dans le tableau
}

products.forEach(function(key) {  // VERIFICATION du type (string) des ID du tableau
    if(stringCheck(key)) {
        arrayIdCheck = true;
    } else {
        console.log("Au moins une des entrées du tableau d'ID 'products' n'est pas une string");
    }
})

orderButton.addEventListener("click", function(e){ // Ecoute au clic du bouton "Commander"

    if(firstNameOk && lastNameOk && addressOk && cityOk && mailOk && arrayIdCheck) { // Si tous les booléens des champs du formulaire valent TRUE

        e.preventDefault(); // Empêche le comportement par défaut d'actualisation de page

        fetch("http://localhost:3000/api/products/order", { // Requête de type "POST"
            method: "POST",
            headers: {
                "Accept": "application/json", // Demande à l'API de nous renvoyer un objet JSON
                "Content-Type": "application/json" // Renseigne à l'API qu'elle va recevoir un objet JSON
            },
            body: JSON.stringify({contact, products}) // Contenu à envoyer à l'API
        })

        .then(function(res) {
            if(res.ok) { // Vérification de la réponse
                return res.json();
            }
        })

        .then(function(data) {
            
            let orderId = data.orderId; // Ciblage de l'orderID dans la réponse de l'API et stockage dans une variable
            window.location.replace("./confirmation.html?orderId="+orderId); 
            // Redirection de l'utilisateur vers la page Confirmation en passant l'orderID dans l'URL
        })

        .catch(function(err) {
            console.log(err);
        });
        
    } else {
        e.preventDefault();
        alert("Merci de renseigner correctement tous les champs du formulaire."); 
        // Si un seul booléen du formulaire vaut FALSE, alerte l'utilisateur qu'un champ n'est pas rempli correctement
    }
});

