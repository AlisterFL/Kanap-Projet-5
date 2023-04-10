let cart = JSON.parse(localStorage.getItem("cart"));
console.log(cart);

const sectionCartItems = document.querySelector("#cart__items");
let totalPriceItems = 0;
let totalQantityItems = 0;

cart.forEach((items) => {
  let id = items.id; //récupère l'id de chaque item dans le panier
  console.log(id);

  //Récuperation des informations du produit
  async function getProduct(id) {
    const response = await fetch(`http://localhost:3000/api/products/${id}`);
    article = await response.json();
    console.log(article);

    // Créer un élément article
    const articleElement = document.createElement("article");
    articleElement.classList.add("cart__item");
    articleElement.setAttribute("data-id", article._id);
    articleElement.setAttribute("data-color", items.color);

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
    colorProduct.innerText = items.color;
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
    inputQuantityProduct.value = items.number;
    console.log(items.number);

    //modification du nombre d'article dans le LS
    inputQuantityProduct.addEventListener("input", (event) => {
      console.log(cart);
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === items.id && cart[i].color === items.color) {
          cart[i].number = event.target.value;
        }
      }
      let cartJSON = JSON.stringify(cart);
      localStorage.setItem("cart", cartJSON);
    });

    //supprimer du panier
    const divDeleteProduct = document.createElement("div");
    divDeleteProduct.classList.add("cart__item__content__settings__delete");
    const deleteProduct = document.createElement("p");
    deleteProduct.classList.add("deleteItem");
    deleteProduct.innerText = "Supprimer";

    //Supression de l'article Event
    divDeleteProduct.addEventListener("click", () => {
      //Récupération de l'objet à supprimer puis réupload du LS
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === items.id && cart[i].color === items.color) {
          cart.splice(i, 1);
        }
      }
      let cartJSON = JSON.stringify(cart);
      localStorage.setItem("cart", cartJSON);
      articleElement.remove();
    });

    //tatal articles
    totalQantityItems += parseInt(items.number);
    totalPriceItems += article.price * items.number;
    console.log("test");

    console.log(totalPriceItems);
    const totalQuantityProduct = document.querySelector("#totalQuantity");
    const totalPriceProduct = document.querySelector("#totalPrice");
    totalQuantityProduct.innerText = totalQantityItems;
    totalPriceProduct.innerText = totalPriceItems;

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
  }

  getProduct(id);
});
