    document.addEventListener("DOMContentLoaded", function() {
    const animalData = localStorage.getItem("animalSelecionado");

    if (animalData) {
        const animal = JSON.parse(animalData);

    // Preenche a seção Sobre o Animal
    document.querySelector(".about-animal h2").textContent = animal.nome;
    document.querySelector(".about-animal img").src = animal.imagem;
    document.querySelector(".about-animal img").alt = animal.nome;

    const infoDiv = document.querySelector(".about-animal .info");
    infoDiv.innerHTML = `
    <p><strong>Raça:</strong> ${animal.raca}</p>
    <p><strong>Idade:</strong> ${animal.idade}</p>
    <p><strong>Peso:</strong> ${animal.peso} kg</p>
    `;

    document.querySelector(".history p").textContent = animal.descricao;
    }
});