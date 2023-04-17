import { reuploadLS } from "./tools.js";

let cart = JSON.parse(localStorage.getItem("cart"));

const sectionCartItems = document.querySelector("#cart__items");
const totalQantity = document.getElementById("totalQuantity");
const totalPrice = document.getElementById("totalPrice");
let qtyItem = 0;
let priceAllItems = 0;
let articlePrice = 0;

cart.forEach((item) => {
  let id = item.id; //récupère l'id de chaque item dans le panier
  console.log(id);

  //Récuperation des informations du produit
  async function getProduct(id) {
    const article = await fetch(
      `http://localhost:3000/api/products/${id}`
    ).then((a) => a.json());
    console.log("LISTE: " + article.price);

    console.log(item);
    articlePrice = article.price;

    // Créer un élément article
    const articleElement = document.createElement("article");
    articleElement.classList.add("cart__item");
    articleElement.setAttribute("data-id", item.id);
    articleElement.setAttribute("data-color", item.color);

    //création de la div pour l'image
    const divImage = document.createElement("div");
    divImage.classList.add("cart__item__img");
    const imageElement = document.createElement("img");
    imageElement.src = article.imageUrl;
    imageElement.alt = article.description;

    //Création de la div pour toutes les informations produit
    const divInformationsProduct = document.createElement("div");
    divInformationsProduct.classList.add("cart__item__content");
    //description article panier
    const divProductDescription = document.createElement("div");
    divProductDescription.classList.add("cart__item__content__description");
    const nameProduct = document.createElement("h2");
    nameProduct.innerText = article.name;
    const colorProduct = document.createElement("p");
    colorProduct.innerText = item.color;
    const priceProduct = document.createElement("p");
    priceProduct.innerText = article.price + " €";
    //option article panier
    //quantité
    const divSettingsProduct = document.createElement("div");
    divSettingsProduct.classList.add("cart__item__content__settings");
    const divProductQuantity = document.createElement("div");
    divProductQuantity.classList.add("cart__item__content__settings__quantity");
    const textQuantityProduct = document.createElement("p");
    textQuantityProduct.innerText = "Qté";
    const inputQuantityProduct = document.createElement("input");
    inputQuantityProduct.type = "number";
    inputQuantityProduct.classList.add("itemQuantity");
    inputQuantityProduct.name = "itemQuantity";
    inputQuantityProduct.min = 1;
    inputQuantityProduct.max = 100;
    inputQuantityProduct.value = item.quantity;

    //supprimer du panier
    const divDeleteProduct = document.createElement("div");
    divDeleteProduct.classList.add("cart__item__content__settings__delete");
    const deleteProduct = document.createElement("p");
    deleteProduct.classList.add("deleteItem");
    deleteProduct.innerText = "Supprimer";

    //AppendChild
    sectionCartItems.appendChild(articleElement);
    articleElement.appendChild(divImage);
    divImage.appendChild(imageElement);
    articleElement.appendChild(divInformationsProduct);
    divInformationsProduct.appendChild(divProductDescription);
    divProductDescription.appendChild(nameProduct);
    divProductDescription.appendChild(colorProduct);
    divProductDescription.appendChild(priceProduct);
    //option
    //quantité
    divInformationsProduct.appendChild(divSettingsProduct);
    divSettingsProduct.appendChild(divProductQuantity);
    divProductQuantity.appendChild(textQuantityProduct);
    divProductQuantity.appendChild(inputQuantityProduct);
    //supr
    divSettingsProduct.appendChild(divDeleteProduct);
    divDeleteProduct.appendChild(deleteProduct);

    modificationQuantityOfProduct(inputQuantityProduct, item, cart);
    deleteTheProduct(deleteProduct, item, cart, articleElement);

    qtyItem += parseInt(item.quantity);
    priceAllItems = qtyItem * articlePrice;

    totalQantity.innerText = qtyItem;
    totalPrice.innerText = priceAllItems;
  }

  getProduct(id);
});

//Prix & nombre TOTAL articles

function modificationQuantityOfProduct(inputQuantityProduct, item, cart) {
  inputQuantityProduct.addEventListener("input", (event) => {
    qtyItem = 0;
    priceAllItems = 0;
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id === item.id && cart[i].color === item.color) {
        cart[i].quantity = event.target.value;
      }
      qtyItem += parseInt(cart[i].quantity);
      priceAllItems = qtyItem * articlePrice;
      console.log("qty item : " + qtyItem);
      console.log("total prix : " + priceAllItems);
      console.log("PRIX : " + articlePrice);
      //affichage des totaux
      totalQantity.innerText = qtyItem;
      totalPrice.innerText = priceAllItems;
    }
    reuploadLS("cart", cart);
  });
}

function deleteTheProduct(deleteProduct, item, cart, articleElement) {
  deleteProduct.addEventListener("click", () => {
    //Récupération de l'objet à supprimer puis réupload du LS
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id === item.id && cart[i].color === item.color) {
        qtyItem -= parseInt(cart[i].quantity);
        console.log(qtyItem);
        cart.splice(i, 1);
      }
      priceAllItems = qtyItem * articlePrice;
      //affichage des totaux
      totalQantity.innerText = qtyItem;
      totalPrice.innerText = priceAllItems;
    }
    reuploadLS("cart", cart);
    articleElement.remove();
  });
}
