/* ------------------------------------------------------------------- */
/* ----- RECUPERATION INFOS LOCAL STORAGE/API ET AFFICHAGE PANIER ---- */
/* ------------------------------------------------------------------- */


class product {
    constructor (id, qty, color) {
        this.id = id;
        this.qty = qty;
        this.color = color;
    }
}

let storedProducts = JSON.parse(localStorage.getItem("storedProducts"));

if(storedProducts.length == 0) {
    document.querySelector("#cart__items > article").textContent = "Votre panier est vide !";
} else {
    let n=1; // Création d'articles supplémentaires selon le nombre de produits sélectionnés
    while(n < storedProducts.length) {
        const cartItem = document.querySelector("#cart__items > article").cloneNode(true);
        document.getElementById("cart__items").appendChild(cartItem);
        n++;
    }
}



const cartTotalQty = document.getElementById("totalQuantity");
let totalQtySum = 0;
let totalPriceSum = 0;

for(let i=0; i<storedProducts.length; i++) {
    totalQtySum += parseInt(storedProducts[i].qty); 
}
cartTotalQty.textContent = totalQtySum;

for(let i=0; i<storedProducts.length; i++) { 
    
    // Envoi de requêtes GET uniquement pour les produits de l'API stockés dans le localStorage (via ID)
    fetch("http://localhost:3000/api/products/" + storedProducts[i].id)
        .then(function(res) {
            if(res.ok) {
                return res.json(); // Vérification du résultat
            }
        })
        .then(function(value) {
            const cartImage = document.querySelectorAll(".cart__item__img > img")[i];
            const cartName = document.querySelectorAll(".cart__item__content__titlePrice > h2")[i];
            const cartPrice = document.querySelectorAll(".cart__item__content__titlePrice > p")[i];
            const cartQty = document.querySelectorAll(".itemQuantity")[i];

            cartImage.setAttribute("src", value.imageUrl); // Attribution des informations Produits
            cartImage.setAttribute("alt", value.altTxt); // depuis l'API et le localStorage
            cartName.textContent = value.name + ", " + storedProducts[i].color;
            cartPrice.textContent = value.price + "€";
            cartQty.setAttribute("value", storedProducts[i].qty);
            totalPriceSum += parseFloat(storedProducts[i].qty*value.price);
            document.getElementById("totalPrice").textContent = totalPriceSum + ",00";

            // Ecoute changement de quantités de chaque produit, recalcule quantités et prix totaux
            cartQty.addEventListener("change", function() { 
                totalQtySum -= parseInt(storedProducts[i].qty);
                totalPriceSum -= value.price*storedProducts[i].qty;

                storedProducts[i].qty = cartQty.value;
                let updatedProduct = new product (storedProducts[i].id, storedProducts[i].qty, storedProducts[i].color);
                storedProducts[i] = updatedProduct;
                localStorage.setItem("storedProducts", JSON.stringify(storedProducts));

                totalQtySum += parseInt(storedProducts[i].qty);
                cartTotalQty.textContent = totalQtySum;
                
                totalPriceSum += value.price*storedProducts[i].qty;
                document.getElementById("totalPrice").textContent = totalPriceSum + ",00";
            })
        })
        .catch(function(err) {
            console.error(err); // Récupération des erreurs
        });
}

for(let i=0; i<storedProducts.length; i++) {

    let thisDelButton = document.querySelectorAll(".deleteItem")[i];
    let thisProduct = document.querySelectorAll(".cart__item")[i];

    thisDelButton.addEventListener("click", () => {
     console.log(i);
        if(storedProducts[i].id == thisProduct.dataset.id) {

            storedProducts.splice(i, 1)
            localStorage.setItem("storedProducts", JSON.stringify(storedProducts));
    
            const thisArticle = thisDelButton.closest("article");
            thisProduct.remove();
            location.reload();
        }
    });
}


/* --------------------------------------------------------------------------------- */
/* ----- VERIFICATION DONNEES SAISIES DANS FORMULAIRE ET CREATION OBJET CONTACT ---- */
/* --------------------------------------------------------------------------------- */

const contact = {
    firstName : "",
    lastName : "",
    address : "",
    city : "",
    email : ""
}

let firstNameOk = false;
let lastNameOk = false;
let addressOk = false;
let cityOk = false;
let mailOk = false;

const form = document.querySelector(".cart__order__form");


// VALIDATION PRENOM
form.firstName.addEventListener("change", function() {
    validFirstName(this);
});

const validFirstName = function(inputFirstName) {

    let firstNameRegex = new RegExp("^((([A-za-zàáâãäåçèéêëìíîïðòóôõöùúûüýÿ']+[\s | -]{1}[A-za-zàáâãäåçèéêëìíîïðòóôõöùúûüýÿ']+)+)|([A-Za-zàáâãäåçèéêëìíîïðòóôõöùúûüýÿ']+))$", "g", "i");
    let feedBackTxt = inputFirstName.nextElementSibling;

    if(firstNameRegex.test(inputFirstName.value)) {

        feedBackTxt.innerText = "Prénom Valide";
        contact.firstName = form.firstName.value;
        firstNameOk = true;
        console.log(contact.firstName);

    } else {
        feedBackTxt.innerText = "Prénom Invalide";
    }
}

// VALIDATION NOM
form.lastName.addEventListener("change", function() {
    validLastName(this);
});

const validLastName = function(inputLastName) {
    
    let lastNameRegex = new RegExp("^((([A-za-zàáâãäåçèéêëìíîïðòóôõöùúûüýÿ']+[\s | -]{1}[A-za-zàáâãäåçèéêëìíîïðòóôõöùúûüýÿ']+)+)|([A-Za-zàáâãäåçèéêëìíîïðòóôõöùúûüýÿ']+))$", "g", "i");
    let feedBackTxt = inputLastName.nextElementSibling;

    if(lastNameRegex.test(inputLastName.value)) {

        feedBackTxt.innerText = "Nom Valide";
        contact.lastName = form.lastName.value;
        lastNameOk = true;
        console.log(contact.lastName);

    } else {
        feedBackTxt.innerText = "Nom Invalide";
    }
}

// VALIDATION ADRESSE
form.address.addEventListener("change", function() {
    validAddress(this);
});

const validAddress = function(inputAddress) {

    let addressRegex = new RegExp("^([0-9]+[\s | ,]{1,2})*(([a-zA-Z0-9àáâãäåçèéêëìíîïðòóôõöùúûüýÿ']{1,30}[\s | -]{1}[a-zA-Z0-9àáâãäåçèéêëìíîïðòóôõöùúûüýÿ']{1,30})+)$", "g", "i");

    let feedBackTxt = inputAddress.nextElementSibling;

    if(addressRegex.test(inputAddress.value)) {

        feedBackTxt.innerText = "Adresse Valide";
        contact.address = form.address.value;
        addressOk = true;
        console.log(contact.address);

    } else {
        feedBackTxt.innerText = "Adresse Invalide";
    }
}

// VALIDATION VILLE
form.city.addEventListener("change", function() {
    validCity(this);
});

const validCity = function(inputCity) {

    let cityRegex = new RegExp("^((([A-za-zàáâãäåçèéêëìíîïðòóôõöùúûüýÿ']+[\s | -]{1}[A-za-zàáâãäåçèéêëìíîïðòóôõöùúûüýÿ']+)+)|([A-Za-zàáâãäåçèéêëìíîïðòóôõöùúûüýÿ']+))$", "g", "i");
    let feedBackTxt = inputCity.nextElementSibling;

    if(cityRegex.test(inputCity.value)) {

        feedBackTxt.innerText = "Ville Valide";
        contact.city = form.city.value;
        cityOk = true;
        console.log(contact.city);

    } else {
        feedBackTxt.innerText = "Ville Invalide";
    }
}

// VALIDATION EMAIL
form.email.addEventListener("change", function() {
    validEmail(this);
});

const validEmail = function(inputEmail) {

    let mailRegex = new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$", "g");
    let feedBackTxt = inputEmail.nextElementSibling;

    if(mailRegex.test(inputEmail.value)) {

        feedBackTxt.innerText = "Email Valide";
        contact.email = form.email.value;
        mailOk = true;
        console.log(contact.email);

    } else {
        feedBackTxt.innerText = "Email Invalide";
    }
}

/* -------------------------------------------------------------------------------- */
/* ----- ECOUTE CLIC BOUTON COMMANDE, VERIFICATION ET ENVOI DONNEES ---- */
/* -------------------------------------------------------------------------------- */

const orderButton = document.getElementById("order");

let formTest = document.querySelector(".cart__order__form");
// formTest.setAttribute("method", "post"); ?????????????

let products = new Array;

for(i=0; i< storedProducts.length; i++) {

    const cartArticle = document.querySelectorAll(".cart__item")[i];
    cartArticle.dataset.id = storedProducts[i].id;
    let cartArticleId = cartArticle.getAttribute("data-id");
    products.push(cartArticleId);
}

orderButton.addEventListener("click", function(e){

    if(firstNameOk && lastNameOk && addressOk && cityOk && mailOk) {

        e.preventDefault();

        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({contact, products})
        })

        .then(function(res) {
            if(res.ok) {
                return res.json();
            }
        })

        .then(function(data) {
            
            let orderId = data.orderId;
            window.location.replace("./confirmation.html?orderId="+orderId);

        })

        .catch(function(err) {
            console.log(err);
        });
        
    } else {
        e.preventDefault();
        alert("Merci de renseigner correctement tous les champs du formulaire.");
    }
});

