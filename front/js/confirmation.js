import { getDataFromUrl } from "./tools.js";
const id = getDataFromUrl("id");

console.log(id);

document.querySelector("#orderId").textContent = id;
