//Atribuindo ao HTML
const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");
const apiKey = "900c62aeb763380fe049cecc32a40f9f";

//Parar de enviar o formulário, para evitar recarregar a página e recuperar o valor contido no campo de pesquisa.
form.addEventListener("submit", e => {
  e.preventDefault();
  let inputVal = input.value;

  //verificar se tem uma cidade no campo de pesquisa
  const listItems = list.querySelectorAll(".ajax-section .city");
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter(el => {
      let content = "";
      //Exemplo: tokyo,jp
      if (inputVal.includes(",")) {
       //tokyo,jpppppp->código de país inválido, então mantemos apenas a primeira parte de inputVal
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el
            .querySelector(".city-name span")
            .textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        //tokyo
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      msg.textContent = `Você já sabe o tempo de ${
        filteredArray[0].querySelector(".city-name span").textContent
      }... caso contrário, seja mais específico fornecendo o código do país também`;
      form.reset();
      input.focus();
      return;
    }
  }

  //chamada da api
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

  //Usei API Fetch para fazer o pedido AJAX
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const { main, name, sys, weather } = data;
      const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
        weather[0]["icon"]
      }.svg`;

      const li = document.createElement("li");
      li.classList.add("city");
      const markup = `
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${
        weather[0]["description"]
      }">
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
      `;
      li.innerHTML = markup;
      list.appendChild(li);
    })
    //Se acontecer algum erro no pedido AJAX
    .catch(() => {
      msg.textContent = "Procure uma cidade válida";
    });

    //Limpar a informação
    msg.textContent = "";
    form.reset();
    input.focus();
    });