document.addEventListener("DOMContentLoaded", function () {
    // Tenta pegar os dados do animal do localStorage
    const animalDataString = localStorage.getItem('animalParaAdocao'); // Use a chave correta que você usou para salvar

    if (!animalDataString) {
        console.error("Dados do animal não encontrados no localStorage.");
        return; // Sai da função se não houver dados
    }

    let animalData;
    try {
        animalData = JSON.parse(animalDataString);
    } catch (e) {
        console.error("Erro ao fazer parse dos dados do animal:", e);
        alert("Ocorreu um erro ao carregar os dados do animal.");
        return; // Sai se o JSON for inválido
    }

    // Seleciona os elementos no HTML usando os IDs adicionados
    const imgElement = document.getElementById('animal-img');
    const nameElement = document.getElementById('animal-name');
    const infoElement = document.getElementById('animal-info');
    const storyElement = document.getElementById('animal-story');
    const animalIdInput = document.getElementById('animalId');
    const usuarioIdInput = document.getElementById('usuarioId');

    // Preenche os elementos com os dados do animal
    if (imgElement && animalData.fotos && animalData.fotos.length > 0) {
        imgElement.src = animalData.fotos[0].fotoHash; // Usa o base64 diretamente
        imgElement.alt = `Foto de ${animalData.nome}`; // Melhora a acessibilidade
    } else if (imgElement) {
        imgElement.alt = "Foto não disponível"; // Caso não haja foto
    }

    if (nameElement) {
        nameElement.textContent = animalData.nome || "Nome não disponível";
    }

    if (storyElement) {
        storyElement.textContent = animalData.descricao || "Descrição não disponível.";
    }

    if (animalIdInput) {
        animalIdInput.value = animalData.animalId || ""; // Define o valor do campo oculto
    }

    if (usuarioIdInput && animalData.tutor) {
        usuarioIdInput.value = animalData.tutor.tutorId || ""; // Define o valor do campo oculto
    } else if (usuarioIdInput) {
         usuarioIdInput.value = ""; // Limpa se não houver tutor
    }

    if (infoElement) {
        let infoHtml = '';
        if (animalData.porte) {
            infoHtml += `<p><strong>Porte:</strong> ${animalData.porte}</p>`;
        }
        if (animalData.peso) {
            infoHtml += `<p><strong>Peso:</strong> ${animalData.peso} kg</p>`;
        }
        if (animalData.dataNascimento) {
            try {
                const dataNasc = new Date(animalData.dataNascimento);
                 dataNasc.setUTCDate(dataNasc.getUTCDate() + 1);
                const dataFormatada = dataNasc.toLocaleDateString('pt-BR');
                infoHtml += `<p><strong>Nascimento:</strong> ${dataFormatada}</p>`;
            } catch (e) {
                 console.warn("Data de nascimento inválida:", animalData.dataNascimento);
                 infoHtml += `<p><strong>Nascimento:</strong> ${animalData.dataNascimento}</p>`; // Mostra como está se falhar
            }
        }
        if (animalData.castrado !== undefined) {
             infoHtml += `<p><strong>Castrado:</strong> ${animalData.castrado ? 'Sim' : 'Não'}</p>`;
        }

        if (animalData.animalVacinas && animalData.animalVacinas.length > 0) {
            const nomesVacinas = animalData.animalVacinas.map(vacina => vacina.nome).join(', ');
            infoHtml += `<p><strong>Vacinas:</strong> ${nomesVacinas}</p>`;
        } else {
            infoHtml += `<p><strong>Vacinas:</strong> Nenhuma informação</p>`;
        }

        infoElement.innerHTML = infoHtml;
    }
});