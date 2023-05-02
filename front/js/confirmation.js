import { getDataFromUrl } from "./tools.js";
const id = getDataFromUrl("id");
localStorage.removeItem("cart");

console.log(id);

document.querySelector("#orderId").textContent = id;
