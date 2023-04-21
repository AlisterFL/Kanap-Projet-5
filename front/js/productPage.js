import { getDataFromUrl, refreshLS } from "./tools.js";

const id = getDataFromUrl("id");
let article = await getProduct(id);

display(article);
listenForCartAddition(article);

function display(article) {
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
}

function listenForCartAddition(article) {
  //Action lors de l'ajout au panier
  const addToCart = document.querySelector("#addToCart");
  let cart = [];

  addToCart.addEventListener("click", () => {
    const color = document.querySelector("#colors").value;
    const quantity = document.querySelector("#quantity").value;
    console.log(quantity);
    const id = article._id;

    //Si toutes les infos ne sont pas remplies
    if (color.length === 0) {
      alert("Veuillez choisir une couleur.");
      return;
    }
    if (quantity < 0 || quantity > 100) {
      alert("Veuillez choisir une quantité acceptée");
      return;
    }

    const newProduct = { id, color, quantity };

    // Récupérer le contenu actuel du panier dans le localStorage
    const cartJSON = localStorage.getItem("cart");
    let cart = [];

    if (cartJSON != null) {
      cart = JSON.parse(cartJSON);
    }

    // Vérifier si l'article existe déjà dans le panier
    let productExists = false;

    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id === newProduct.id && cart[i].color === newProduct.color) {
        cart[i].quantity = parseInt(cart[i].quantity);
        newProduct.quantity = parseInt(newProduct.quantity);
        cart[i].quantity += newProduct.quantity;
        if (Number(cart[i].quantity) > 100) {
          console.log(cart[i].quantity);
          console.log(newProduct.quantity);
          alert(
            "Vous ne pouvez pas avoir plus de 100 même article dans votre panier."
          );
          return;
        }
        productExists = true;
        break;
      }
    }

    // S'il n'existe pas encore, ajouter au panier
    if (!productExists) {
      cart.push(newProduct);
    }
    console.log(cart);

    refreshLS("cart", cart);
    alert(
      "Votre produit a bien été ajouté ! \n Vous allez être redirigé vers l'accueil"
    );
    window.location.href = "index.html";
  });
}

async function getProduct(id) {
  const response = await fetch(`http://localhost:3000/api/products/${id}`);
  return await response.json();
}
