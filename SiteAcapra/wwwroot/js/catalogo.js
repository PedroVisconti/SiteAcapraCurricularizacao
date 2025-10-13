const animais = [
  {
    nome: "Thor",
    especie: "Cachorro",
    peso: "18 kg",
    raca: "Vira-lata",
    idade: "2 anos",
    descricao: "Brincalhão, carinhoso e adora correr no parque.",
    imagem: "https://www.petz.com.br/blog/wp-content/uploads/2021/09/dia-mundial-dos-animais-topo.jpg"
  },
  {
    nome: "Mia",
    especie: "Gato",
    peso: "4 kg",
    raca: "Siamês",
    idade: "1 ano e meio",
    descricao: "Muito carinhosa, gosta de colo e é bem tranquila.",
    imagem: "https://www.petz.com.br/blog/wp-content/uploads/2021/09/dia-mundial-dos-animais-topo.jpg"
  },
  {
    nome: "Luna",
    especie: "Cachorra",
    peso: "12 kg",
    raca: "Labrador",
    idade: "3 anos",
    descricao: "Extremamente dócil e ótima companheira para famílias.",
    imagem: "https://www.petz.com.br/blog/wp-content/uploads/2021/09/dia-mundial-dos-animais-topo.jpg"
  },
  {
    nome: "Nino",
    especie: "Gato",
    peso: "5 kg",
    raca: "Persa",
    idade: "2 anos",
    descricao: "Gosta de dormir em lugares altos e é muito curioso.",
    imagem: "https://www.petz.com.br/blog/wp-content/uploads/2021/09/dia-mundial-dos-animais-topo.jpg"
  }
];

function renderCatalogo() {
  const lista = document.getElementById("animalList");

  animais.forEach(animal => {
    const card = document.createElement("div");
    card.classList.add("animal-card");

    card.innerHTML = `
    <img src="${animal.imagem}" alt="${animal.nome}" class="animal-image">
    <div class="animal-card-content">
        <div class="animal-info">
        <h2 class="animal-name">${animal.nome}</h2>
        <p class="animal-especie">${animal.especie}</p>
        </div>
        <div class="animal-details">
        <b><p>Peso: ${animal.peso}</p></b>
        <b><p>Raça: ${animal.raca}</p></b>
        <b><p>Idade: ${animal.idade}</p></b>
        </div>
        <p class="animal-description">${animal.descricao}</p>
    </div>
    <button class="adopt-button">Adotar</button>
    `;

    lista.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", renderCatalogo);
