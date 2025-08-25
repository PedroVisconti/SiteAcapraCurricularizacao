document.addEventListener("DOMContentLoaded", function() {
    const animais = [
        {
            "nome": "Rex",
            "especie": "Cachorro",
            "peso": 18.5,
            "raca": "Labrador",
            "idade": "1 ano",
            "descricao": "Bolinha é um cachorro muito brincalhão e carinhoso. Adora crianças e outros animais.",
            "imagem": "https://www.petz.com.br/blog/wp-content/uploads/2021/09/dia-mundial-dos-animais-topo.jpg"
        },
        {
            "nome": "Mimi",
            "especie": "Gato",
            "peso": 4.2,
            "raca": "Siamês",
            "idade": "2 anos",
            "descricao": "Mimi é muito curiosa e gosta de brincar com bolinhas de lã.",
            "imagem": "https://www.petz.com.br/blog/wp-content/uploads/2021/09/dia-mundial-dos-animais-topo.jpg"
        },
        {
            "nome": "Toby",
            "especie": "Cachorro",
            "peso": 22.0,
            "raca": "Golden Retriever",
            "idade": "3 anos",
            "descricao": "Toby adora correr no parque e é muito amigável com todos.",
            "imagem": "https://www.petz.com.br/blog/wp-content/uploads/2021/09/dia-mundial-dos-animais-topo.jpg"
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
                    <p class="animal-peso">Peso: ${animal.peso} kg</p>
                    <p class="animal-raca">Raça: ${animal.raca}</p>
                    <p class="animal-idade">Idade: ${animal.idade}</p>
                </div>
                <div>
                    <p class="animal-description">${animal.descricao}</p>
                </div>
            </div>
            <button class="adopt-button">Adotar</button>
        `;

        animalList.appendChild(card);
    });
});

