// Récupération des pièces depuis le fichier JSON
const articles = await fetch("http://localhost:3000/api/products").then((a) =>
  a.json()
);

const sectionItems = document.querySelector("#items");

articles.forEach((article) => {
  // Créer un nouvel élément a avec l'attribut href
  const aElement = document.createElement("a");
  const urlParams = new URLSearchParams(window.location.search);
  const nameParam = encodeURIComponent(article.name);
  urlParams.set("name", nameParam);
  aElement.href = `product.html?${urlParams.toString()}`;

  // Créer un nouvel élément article
  const articleElement = document.createElement("article");

  const imageElement = document.createElement("img");
  imageElement.src = article.imageUrl;
  imageElement.alt = article.description;

  const nameElement = document.createElement("h3");
  nameElement.innerText = article.name;

  const descriptionElement = document.createElement("p");
  descriptionElement.innerText = article.description;

  // Rattachement des balises au DOM
  sectionItems.appendChild(aElement);
  aElement.appendChild(articleElement);
  articleElement.appendChild(imageElement);
  articleElement.appendChild(nameElement);
  articleElement.appendChild(descriptionElement);
});
