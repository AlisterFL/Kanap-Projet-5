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

export { getDataFromUrl, refreshLS };
