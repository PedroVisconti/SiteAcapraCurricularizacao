const urlBase = "https://localhost:7162/api";

async function fetchAnimais() {
  try {
    const response = await fetch(`${urlBase}/Animal/paginaInicial`);
    if (!response.ok) {
      console.error("Erro ao buscar dados da API:", response.status);
      return []; 
    }
    
    const data = await response.json();
    return data; 
    
  } catch (error) {
    console.error("Erro ao buscar os animais para adoção:", error);
    return []; 
  }
}

/**
 * Calcula a idade (em anos e meses) a partir de uma data de nascimento.
 * @param {string} dataNascimentoString - A data de nascimento em formato ISO (ex: "2025-10-17").
 * @returns {string} - A idade formatada (ex: "2 anos", "5 meses").
 */
function calcularIdade(dataNascimentoString) {
  if (!dataNascimentoString) {
    return "Não informada";
  }

  try {
    const hoje = new Date();
    const nasc = new Date(dataNascimentoString);
    
    let idadeAnos = hoje.getFullYear() - nasc.getFullYear();
    let idadeMeses = hoje.getMonth() - nasc.getMonth();
    
    // Ajusta meses e anos se o dia atual for anterior ao dia de nascimento
    if (hoje.getDate() < nasc.getDate()) {
      idadeMeses--;
    }

    // Ajusta anos se o mês atual for anterior ao mês de nascimento
    if (idadeMeses < 0) {
      idadeAnos--;
      idadeMeses += 12; // Adiciona 12 meses para corrigir
    }

    // Formata a string de saída
    if (idadeAnos > 0) {
      return `${idadeAnos} ano${idadeAnos > 1 ? 's' : ''}`;
    } else if (idadeMeses > 0) {
      return `${idadeMeses} mes${idadeMeses !== 1 ? 'es' : ''}`;
    } else {
      // Para animais com menos de 1 mês
      return "Menos de 1 mês";
    }

  } catch (error) {
    console.error("Erro ao calcular idade:", error);
    return "Inválida";
  }
}


/**
 * Renderiza a lista de animais na página.
 * @param {Array} animais - O array de objetos de animais vindo da API.
 */
function renderCatalogo(animais) {
  const lista = document.getElementById("animal-list");
  lista.innerHTML = ""; 

  if (!animais || animais.length === 0) {
    lista.innerHTML = "<p>Nenhum animal disponível para adoção no momento.</p>";
    return;
  }

  animais.forEach(animal => {
    const card = document.createElement("div");
    card.classList.add("animal-card");


    const imagemUrl = (animal.fotos && animal.fotos.length > 0)
                      ? animal.fotos[0].fotoHash 
                      : 'https://via.placeholder.com/300x200.png?text=Sem+Foto'; // URL de fallback

    const idadeTexto = calcularIdade(animal.dataNascimento);

    card.innerHTML = `
    <img src="${imagemUrl}" alt="${animal.nome}" class="animal-image">
    <div class="animal-card-content">
        <div class="animal-info">
        <h2 class="animal-name">${animal.nome}</h2>
        <p class="animal-especie">${animal.especie.nome}</p>
        </div>
        <div class="animal-details">
        <b><p>Peso: ${animal.peso} kg</p></b>
        <b><p>Raça: ${animal.raca.nome}</p></b>
        <b><p>Idade: ${idadeTexto}</p></b>
        </div>
        <p class="animal-description">${animal.descricao}</p>
    </div>
    <button class="adopt-button">Adotar</button>
    `;

    const adoptButton = card.querySelector(".adopt-button");

    // 2. Adiciona o ouvinte de clique
    adoptButton.addEventListener("click", () => {
      // 3. Salva o objeto 'animal' específico deste card no localStorage
      // Usamos JSON.stringify para converter o objeto em texto
      localStorage.setItem("animalParaAdocao", JSON.stringify(animal));
      
      // 4. Redireciona o usuário para a página do formulário
      // !! SUBSTITUA "formulario.html" PELO CAMINHO CORRETO DA SUA PÁGINA !!
      window.location.href = "formulario.html"; 
    });

    lista.appendChild(card);
  });
}

// Event listener 'DOMContentLoaded' permanece o mesmo
document.addEventListener("DOMContentLoaded", async () => {
  const animaisDaApi = await fetchAnimais();
  renderCatalogo(animaisDaApi);
});