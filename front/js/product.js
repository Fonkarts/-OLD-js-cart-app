/* ---------------------------------------------------------------------- */
/* ----- RECUPERATION DE L'ID DE L'URL ET AFFICHAGE DETAILS PRODUITS ---- */
/* ---------------------------------------------------------------------- */

const productImage = document.querySelector(".item__img > img");
const productName = document.getElementById("title");
const productPrice = document.getElementById("price");
const productDescription = document.getElementById("description");
const productColor1 = document.querySelector("#colors > option:nth-child(2)");
const productColor2 = document.querySelector("#colors > option:nth-child(3)");
const productColor3 = document.querySelector("#colors > option:nth-child(4)");
const productColor4 = document.querySelector("#colors > option:nth-child(5)");


/*document.querySelector("#colors > option").setAttribute("class", "colorOptions");*/

const currentUrl = new URLSearchParams(window.location.search);
const urlId = currentUrl.get("id");
console.log(urlId);

fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if(res.ok){
            return res.json();
        }
    })
    .then(function(value) {

        for(let i in value) {
            if(urlId === value[i]._id) {
                productImage.setAttribute("src", value[i].imageUrl);
                productImage.setAttribute("alt", value[i].altTxt);
                productName.textContent = value[i].name;
                productPrice.textContent = value[i].price;
                productDescription.textContent = value[i].description;
                productColor1.textContent = value[i].colors[0];
                productColor1.setAttribute("value", value[i].colors[0]);
                productColor2.textContent = value[i].colors[1];
                productColor2.setAttribute("value", value[i].colors[1]);
            } 
        }

        for(let i in value) {

            let colorsLength = value[i].colors.length;
            
            if(urlId === value[i]._id && colorsLength==3) {
                console.log(colorsLength);

                let colorOption = document.createElement("option");
                document.getElementById("colors").appendChild(colorOption);

                document.getElementsByTagName("option")[3].textContent = value[i].colors[2];
                document.getElementsByTagName("option")[3].setAttribute("value", value[i].colors[2]);
            } 
            else if (urlId === value[i]._id && colorsLength==4){
                console.log(colorsLength);

                let colorOption = document.createElement("option");
                document.getElementById("colors").appendChild(colorOption);
                let colorOption2 = document.createElement("option");
                document.getElementById("colors").appendChild(colorOption2); // FAIRE MARCHER POUR 4 !!!!!!!
                
                document.getElementsByTagName("option")[3].textContent = value[i].colors[2];
                document.getElementsByTagName("option")[3].setAttribute("value", value[i].colors[2]);
                document.getElementsByTagName("option")[4].textContent = value[i].colors[3];
                document.getElementsByTagName("option")[4].setAttribute("value", value[i].colors[3]);
            }
        }
    })
    .catch(function(err) {
        console.error(err);
    });