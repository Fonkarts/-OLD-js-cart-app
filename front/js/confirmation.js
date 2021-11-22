/* ---------------------------------------------------------------------- */
/* ----- RECUPERATION DE L'ORDERID DE L'URL ET AFFICHAGE SUR LA PAGE ---- */
/* ---------------------------------------------------------------------- */


const currentUrl = new URLSearchParams(window.location.search);
const urlOrderId = currentUrl.get("orderId");

document.getElementById("orderId").textContent = urlOrderId;