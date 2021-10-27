/* -------------------------------------------------------------------------- */
/* ----- RECUPERATION DE L'ID DE L'URL ET AFFICHAGE DES DETAILS PRODUITS ---- */
/* -------------------------------------------------------------------------- */

const productImage = document.querySelector(".item__img > img");
const productName = document.getElementById("title");
const productPrice = document.getElementById("price");
const productDescription = document.getElementById("description");

const currentUrl = new URLSearchParams(window.location.search);
const urlId = currentUrl.get("id"); // Recherche de l'identifiant produit dans l'URL
console.log(urlId);

fetch("http://localhost:3000/api/products/" + urlId) // Cible le produit correspondant à l'ID 
    .then(function(res) {                              // récupéré dans l'URL.
        if(res.ok){
            return res.json(); // Vérification du résultat
        }
    })
    .then(function(value) {
        console.log(value.price); // test
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
            console.log(value.colors[i]); // test
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

/*select.addEventListener("change", function() {
    const selectedColor = select.options[select.selectedIndex].text;
    console.log(selectedColor);
    return selectedColor;
})

itemQty.addEventListener("focusout", function() {
    const itemQtyValue = itemQty.value;
    console.log(itemQtyValue);
    return itemQty.value; // RETURN AVEC FONCTION CONST OU LET
})*/

const addToCartButton = document.getElementById("addToCart");


addToCartButton.addEventListener("click", function() {
    if(itemQty.value>0 && itemQty.value<101) {
        localStorage.setItem("storedId", urlId);
        localStorage.setItem("storedQty", itemQty.value);
        localStorage.setItem("storedColor", select.options[select.selectedIndex].text);
    
        addToCartButton.textContent = "Produit(s) ajouté(s) !";
    } else {
        addToCartButton.textContent = "Quantité incorrecte !";
    }
});
