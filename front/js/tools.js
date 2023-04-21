function getDataFromUrl(key) {
  // Récupérez l'URL de la page
  const currentUrl = window.location.href;

  // Créez un nouvel objet URL à partir de l'URL actuelle
  const url = new URL(currentUrl);

  // Utilisez URLSearchParams pour extraire la valeur de l'ID
  const params = new URLSearchParams(url.search);

  return params.get(key);
}

function refreshLS(key, value) {
  //upload le local storage, directement en JSON
  localStorage.setItem(key, JSON.stringify(value));
}

function updateQtyInLS(articles, cart) {
  for (let i = 0; i < articles.length; i++) {
    if (
      cart[i].id === articles[i]._id &&
      cart[i].quantity !== articles[i].quantity
    ) {
      cart[i].quantity = articles[i].quantity;
      console.log("cart :", cart);
      console.log("articles :", articles);
    }
  }
}

function updateItemInLS(articles, cart) {
  cart.forEach((b, index) => {
    const articleIndex = articles.findIndex(
      (a) => a.id === b.id && a.color === b.color
    );
    if (articleIndex === -1) {
      // si objet n'existe pas
      cart.splice(index, 1);
      console.log("cart :", cart);
      console.log("articles :", articles);
    }
  });
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

export { getDataFromUrl, refreshLS, updateQtyInLS, updateItemInLS, testRegex };
