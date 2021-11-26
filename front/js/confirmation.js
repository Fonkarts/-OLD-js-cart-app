/* ---------------------------------------------------------------------- */
/* ----- RECUPERATION DE L'ORDERID DE L'URL ET AFFICHAGE SUR LA PAGE ---- */
/* ---------------------------------------------------------------------- */


const currentUrl = new URLSearchParams(window.location.search);
const urlOrderId = currentUrl.get("orderId"); // Récupération de l'orderID dans l'URL

document.getElementById("orderId").textContent = urlOrderId; // Affichage de l'orderID sur la page