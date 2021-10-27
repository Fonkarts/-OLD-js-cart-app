/* --------------------------------------------------------------- */
/* ----- RECUPERATION INFOS LOCAL STORAGE ET AFFICHAGE PANIER ---- */
/* --------------------------------------------------------------- */

const cartImage = document.querySelector(".cart__item__img > img");
const cartName = document.querySelector(".cart__item__content__titlePrice > h2");
const cartPrice = document.querySelector(".cart__item__content__titlePrice > p");
const cartQty = document.querySelector(".itemQuantity");
const cartTotalQty = document.getElementById("totalQuantity");
const deleteButton = document.querySelector(".deleteItem");


fetch("http://localhost:3000/api/products/" + localStorage.getItem("storedId"))
    .then(function(res) {
        if(res.ok) {
            return res.json();
        }
    })
    .then(function(value) {

        cartImage.setAttribute("src", value.imageUrl);
        cartImage.setAttribute("alt", value.altTxt);
        cartName.textContent = value.name + ", " + localStorage.getItem("storedColor");
        cartPrice.textContent = value.price + "€";
        cartQty.setAttribute("value", localStorage.getItem("storedQty"));
        cartTotalQty.textContent = localStorage.getItem("storedQty");
        const cartTotalPrice = parseInt(localStorage.getItem("storedQty")) * value.price;
        document.getElementById("totalPrice").textContent = cartTotalPrice + ",00";

        cartQty.addEventListener("change", function() {
            localStorage.setItem("storedQty", cartQty.value);
            cartTotalQty.textContent = localStorage.getItem("storedQty");
            const cartTotalPrice = parseInt(localStorage.getItem("storedQty")) * value.price;
            document.getElementById("totalPrice").textContent = cartTotalPrice + ",00";
        })
    })
    .catch(function(err) {
        console.error(err);
    });


/*deleteButton.addEventListener("click", () => {
    
    document.querySelector(".cart__item").textContent = "Votre panier est vide !";
    
    localStorage.clear();
    cartImage.setAttribute("src", ("../../back/images/kanap01.jpeg"));
    cartName.textContent = "Nom du Produit";
    cartPrice.textContent = "0,00 €"; // (Qté:42, Price:42€, etc.)
    cartQty.setAttribute("value", "0");
    cartTotalQty.textContent = "0";
    document.getElementById("totalPrice").textContent = "0,00 €";
});*/


