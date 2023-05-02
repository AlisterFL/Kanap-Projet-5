import { refreshLS } from "./tools.js";

let cart = JSON.parse(localStorage.getItem("cart"));

if (!cart) {
  document.querySelector("h1").innerText = "Votre panier est vide";
  document.querySelector(".cart__price").remove();
  document.querySelector(".cart__order").remove();
} else {
  const articles = await getAllArticlesData(cart);
  await display(articles);
  totalCount(articles);
  listenForQtyChange(articles);
  deleteArticle(articles);
  checkForm();
}

function listenForQtyChange(articles) {
  articles.forEach((a) => {
    const el = document.querySelector(
      `.cart__item[data-id="${a._id}"][data-color="${a.color}"] .itemQuantity`
    );

    let oldValue = Number(el.value); // stocke la dernière valeur valide

    el.addEventListener("change", () => {
      console.log(oldValue);
      if (
        el.value === "" ||
        Number.isNaN(el.value) ||
        el.value < 0 ||
        el.value > 100 ||
        isNaN(Number(el.value))
      ) {
        alert("Veuillez choisir une quantité acceptée");
        el.value = oldValue; // restaure la dernière valeur valide
      } else {
        oldValue = Number(el.value); // met à jour la dernière valeur valide
      }

      const index = articles.findIndex(
        (b) => b._id === a._id && b.color === a.color
      );
      articles[index].quantity = Number(el.value);
      cart[index].quantity = Number(el.value);
      totalCount(articles);
      console.log(articles);
      refreshLS("cart", cart);
    });
  });
}

function deleteArticle(articles) {
  articles.forEach((a) => {
    const del = document.querySelector(
      `.cart__item[data-id="${a._id}"][data-color="${a.color}"] .deleteItem`
    );

    del.addEventListener("click", () => {
      const choix = window.confirm("Voulez-vous continuer ?");
      if (choix) {
        // console.log("Vous avez choisi OK");
        const indexOfA = articles.indexOf(a);
        articles.splice(indexOfA, 1);

        const article = document.querySelector(
          `.cart__item[data-id="${a._id}"][data-color="${a.color}"]`
        );
        article.remove();
        totalCount(articles);
        updateItemInLS(articles, cart);
        refreshLS("cart", cart);
      } else {
        console.log("Vous avez choisi Annuler");
      }
    });
  });
}

function updateItemInLS(articles, cart) {
  cart.forEach((b, index) => {
    const articleIndex = articles.findIndex(
      (a) => a.id === b.id && a.color === b.color
    );
    if (articleIndex === -1) {
      // si objet n'existe pas
      cart.splice(index, 1);
    }
  });
}

async function display(articles) {
  articles.forEach((article) => {
    const el = render(article);
    document.querySelector("#cart__items").appendChild(el);
  });
}

function render(article) {
  // Créer un élément article
  const articleElement = document.createElement("article");
  articleElement.classList.add("cart__item");
  articleElement.setAttribute("data-id", article._id);
  articleElement.setAttribute("data-color", article.color);

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
  colorProduct.innerText = article.color;
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
  inputQuantityProduct.value = article.quantity;

  //supprimer du panier
  const divDeleteProduct = document.createElement("div");
  divDeleteProduct.classList.add("cart__item__content__settings__delete");
  const deleteProduct = document.createElement("p");
  deleteProduct.classList.add("deleteItem");
  deleteProduct.innerText = "Supprimer";

  //AppendChild
  document.querySelector("#cart__items").appendChild(articleElement);
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

  return articleElement;
}

async function getAllArticlesData(cart) {
  const list = [];
  const data = await fetch(`http://localhost:3000/api/products/`).then((a) =>
    a.json()
  );

  cart.forEach(async (item) => {
    const article = data.find((a) => item.id == a._id);
    const a = { ...article };
    a.color = item.color;
    a.quantity = Number(item.quantity);

    list.push(a);
  });
  return list;
}

function totalCount(articles) {
  let total = 0;
  let qty = 0;
  articles.forEach((a) => {
    qty += a.quantity;
    total = qty * a.price;
  });

  document.getElementById("totalQuantity").innerText = qty;
  document.getElementById("totalPrice").innerText = total;
}

function testRegex(regex, toTest, idError, name) {
  if (regex.test(toTest.value)) {
    document.querySelector(`#${idError}`).innerText = "";
    return true;
  } else {
    document.querySelector(`#${idError}`).innerText =
      "Le champ " + name + " est invalide ";
    return false;
  }
}

function checkForm() {
  const firstName = document.querySelector("#firstName");
  const lastName = document.querySelector("#lastName");
  const address = document.querySelector("#address");
  const city = document.querySelector("#city");
  const email = document.querySelector("#email");
  const submitButton = document.querySelector("#order");

  let masque1 = /^[a-z ,.'-]+$/i;
  let masque2 = /^\d+\s[A-z ,.'-]+$/;
  let masque3 = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    const regexTests = [
      testRegex(masque1, firstName, firstNameErrorMsg.id, "prenom"),
      testRegex(masque1, lastName, lastNameErrorMsg.id, "nom"),
      testRegex(masque2, address, addressErrorMsg.id, "adresse"),
      testRegex(masque1, city, cityErrorMsg.id, "ville"),
      testRegex(masque3, email, emailErrorMsg.id, "email"),
    ];
    console.log(regexTests);
    if (regexTests.every((result) => result === true)) {
      console.log("ok");

      postForm();
    }
  });
}

function postForm() {
  let cart = localStorage.cart;
  console.log(JSON.parse(cart));

  const cartArray = JSON.parse(cart);
  console.log(cartArray);

  const contact = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    email: document.getElementById("email").value,
  };
  console.log(contact);

  const dataForm = {
    contact,
    products: cartArray.map((a) => a.id),
  };

  console.log(dataForm);

  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataForm),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      localStorage.removeItem("cart");
      document.location.href = "confirmation.html?id=" + data.orderId;
    })
    .catch((error) => {
      console.error("Erreur:", error);
    });
}
