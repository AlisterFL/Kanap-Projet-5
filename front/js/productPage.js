// Récupérez l'URL de la page
const currentUrl = window.location.href;

// Créez un nouvel objet URL à partir de l'URL actuelle
const url = new URL(currentUrl);

// Utilisez URLSearchParams pour extraire la valeur de l'ID
const params = new URLSearchParams(url.search);
const id = params.get("id");

console.log(id);

//Récuperation des informations du produits
let article = {};

async function getProduct(id) {
  const response = await fetch(`http://localhost:3000/api/products/${id}`);
  article = await response.json();
  console.log(article);
}

getProduct(id).then(() => {
  //Ajout du nom de l'article en titre de page
  const titlePage = document.querySelector("title");
  titlePage.innerText = article.name;

  //Ajout de l'image de l'article
  const imageDiv = document.querySelector(".item__img");
  const imageElement = document.createElement("img");
  imageElement.src = article.imageUrl;
  imageElement.alt = article.description;

  imageDiv.appendChild(imageElement);

  //Ajout du titre de l'article
  document.querySelector("#title").textContent = article.name;
  //Ajout du prix de l'article
  document.querySelector("#price").textContent = article.price;
  //Ajout de la description
  document.querySelector("#description").textContent = article.description;
  //Ajout des options de couleur
  const selectColor = document.querySelector("#colors");
  const colors = article.colors;
  colors.forEach((color) => {
    const colorOption = document.createElement("option");
    colorOption.value = color;
    colorOption.textContent = color;
    selectColor.appendChild(colorOption);
  });
});

//Action lors de l'ajout au panier
const addToCart = document.querySelector("#addToCart");
let cart = [];

addToCart.addEventListener("click", () => {
  const selectColor = document.querySelector("#colors");
  const selectNumber = document.querySelector("#quantity");

  const id = article._id;
  const color = selectColor.value;
  const number = selectNumber.value;

  //Si toutes les infos ne sont pas remplis
  if (color == null || number == 0) {
    alert("Veuillez remplir tous les champs nécessaires");
    return;
  }

  const newProduct = { id, color, number };

  //Vérifier si l'article existe déjà dans le panier
  let productExists = false;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === newProduct.id && cart[i].color === newProduct.color) {
      cart[i].number = parseInt(cart[i].number);
      newProduct.number = parseInt(newProduct.number);
      cart[i].number += newProduct.number;
      productExists = true;
      break;
    }
  }

  //S'il n'existe pas encore, ajouter au panier
  if (!productExists) {
    cart.push(newProduct);
  }
  console.log(cart);

  // Convertir le tableau en chaîne JSON
  const cartJSON = JSON.stringify(cart);
  console.log(cartJSON);

  // Ajouter la chaîne JSON dans le local storage sous la clé "cart"
  localStorage.setItem("cart", cartJSON);
});
