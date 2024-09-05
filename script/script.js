let formElement = document.querySelector(".js-form");
let resultElement = document.querySelector(".js-result");
let loadingElement = document.querySelector(".js-loader");
let resultTitleElement = document.querySelector(".js-result__title");
let resultDescriptionElement = document.querySelector(".js-result__description");

function wordNotFoundError() {
  resultTitleElement.textContent =
    "Palavra não encontrada, verifique a grafia e tente novamente!";
  resultDescriptionElement.textContent = "";
}

function toggleResultVisibility(show = false) {
  if (show) {
    resultElement.classList.remove("display-none");
    loadingElement.classList.remove("display-none");
  } else {
    loadingElement.classList.add("display-none");
  }
}

function parseXML(data) {
  let response = {
    title: "",
    description: "",
  };
  let parserFunction = new DOMParser();

  response.title = parserFunction
    .parseFromString(data, "text/xml")
    .getElementsByTagName("form")[0]
    .getElementsByTagName("orth")[0].textContent;

  response.description = parserFunction
    .parseFromString(data, "text/xml")
    .getElementsByTagName("sense")[0]
    .getElementsByTagName("def")[0].textContent;

  return response;
}

function insertResponses(responseObject) {
  resultTitleElement.textContent = responseObject.title;
  resultDescriptionElement.textContent = responseObject.description;
}

function handleFormRequest(wordToSearch) {
  let url = `https://api.dicionario-aberto.net/word/${wordToSearch}`;

  fetch(url)
    .then((response) => response.json())
    .then((response) => {
      if (!response[0]) {
        wordNotFoundError();
        return;
      }

      let parsedContent = parseXML(response[0].xml);
      insertResponses(parsedContent);
    })
    .finally(() => {
      toggleResultVisibility();
    });
}

function manageForm() {
  formElement.addEventListener("submit", (event) => {
    event.preventDefault();

    toggleResultVisibility(true);
    let word = event.target[0].value;
    handleFormRequest(word);
  });
}

manageForm();
