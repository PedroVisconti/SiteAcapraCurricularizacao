document.addEventListener("DOMContentLoaded", () => {
    const animais = [
        {
            nome: "Rex",
            especie: "Cachorro",
            peso: 18.5,
            raca: "Labrador",
            idade: "1 ano",
            descricao: "Rex é brincalhão e carinhoso, adora crianças e outros animais.",
            imagem: "https://www.petz.com.br/blog/wp-content/uploads/2021/09/dia-mundial-dos-animais-topo.jpg"
        },
        {
            nome: "Mimi",
            especie: "Gato",
            peso: 4.2,
            raca: "Siamês",
            idade: "2 anos",
            descricao: "Mimi é curiosa e adora brincar com bolinhas de lã.",
            imagem: "https://www.petz.com.br/blog/wp-content/uploads/2021/09/dia-mundial-dos-animais-topo.jpg"
        },
        {
            nome: "Toby",
            especie: "Cachorro",
            peso: 22.0,
            raca: "Golden Retriever",
            idade: "3 anos",
            descricao: "Toby é amigável e adora correr no parque.",
            imagem: "https://www.petz.com.br/blog/wp-content/uploads/2021/09/dia-mundial-dos-animais-topo.jpg"
        }
    ];

    const animalList = document.querySelector('.animal-list');

    animais.forEach(animal => {
        const card = document.createElement('div');
        card.classList.add('animal-card');

        card.innerHTML = `
            <img src="${animal.imagem}" alt="${animal.nome}" class="animal-image">
            <div class="animal-card-content">
                <div class="animal-info">
                    <h2 class="animal-name">${animal.nome}</h2>
                    <p class="animal-especie">${animal.especie}</p>
                </div>
                <div class="animal-details">
                    <p>Peso: ${animal.peso} kg</p>
                    <p>Raça: ${animal.raca}</p>
                    <p>Idade: ${animal.idade}</p>
                </div>
                <p class="animal-description">${animal.descricao}</p>
            </div>
            <button class="adopt-button">Adotar</button>
        `;

        card.querySelector(".adopt-button").addEventListener("click", () => {
            localStorage.setItem("animalSelecionado", JSON.stringify(animal));
            window.location.href = "formularioDog.html";
        });

        animalList.appendChild(card);
    });
});
