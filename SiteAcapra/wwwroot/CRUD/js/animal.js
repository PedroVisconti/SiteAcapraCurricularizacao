const API_URL = "https://localhost:7162/api"; // base correta da API

// ========== FUNÇÃO UTILITÁRIA ==========
async function fetchJSON(url, options = {}) {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`Erro: ${res.status} ${res.statusText}`);
    return res.json();
}

// ========== LISTAR ANIMAIS ==========
async function loadAnimals() {
    try {
        const animals = await fetchJSON(`${API_URL}/Animal`);
        const mapped = animals.map(a => ({
            id: a.animalId,
            nome: a.nome,
            especie: a.especie?.nome || "-",
            raca: a.raca?.nome || "-",
            porte: a.porte || "-",
            dataNascimento: a.dataNascimento,
            tutor: a.tutor?.nome || "-",
            castrado: a.castrado,
            adotado: a.adotado || false
        }));

        const columns = [
            { label: 'Nome', field: 'nome' },
            { label: 'Espécie', field: 'especie' },
            { label: 'Raça', field: 'raca' },
            { label: 'Porte', field: 'porte' },
            { label: 'Idade', field: 'dataNascimento', format: v => `${Utils.calculateAge(v)} anos` },
            { label: 'Tutor', field: 'tutor' },
            { label: 'Castrado', field: 'castrado', format: v => v ? 'Sim' : 'Não' },
            { label: 'Adotado', field: 'adotado', format: v => v ? 'Sim' : 'Não' }
        ];

        const actions = [
            { label: 'Editar', type: 'warning', onclick: 'editAnimal' },
            { label: 'Excluir', type: 'danger', onclick: 'deleteAnimal' }
        ];

        TableManager.renderTable('animal-list-container', mapped, columns, actions);
    } catch (error) {
        Utils.showAlert("Erro ao carregar animais: " + error.message, "error");
    }
}

// ========== ABRIR MODAL (ADICIONAR / EDITAR) ==========
async function openAnimalModal(animalId = null) {
    const modalTitle = document.getElementById('animalModalTitle');
    const animalForm = document.getElementById('animalForm');
    animalForm.reset();
    document.getElementById('animalId').value = "";

    // Carrega selects em paralelo (mais rápido)
    await Promise.all([
        loadEspeciesForAnimalForm(),
        loadRacasForAnimalForm(),
        loadTutoresForAnimalForm()
    ]);

    if (animalId) {
        modalTitle.textContent = 'Editar Animal';
        try {
            const animal = await fetchJSON(`${API_URL}/Animal/${animalId}`);

            // Preenche campos básicos
            document.getElementById('animalId').value = animal.animalId;
            document.getElementById('nomeAnimal').value = animal.nome || "";
            document.getElementById('dataNascimentoAnimal').value = animal.dataNascimento?.split('T')[0] || "";
            document.getElementById('porteAnimal').value = animal.porte || "";
            document.getElementById('pesoAnimal').value = animal.peso || 0;
            document.getElementById('descricaoSaudeAnimal').value = animal.descricaoSaude || "";
            document.getElementById('necessidadesEspeciaisAnimal').value = animal.necessidadesEspeciais || "";
            document.getElementById('descricaoAnimal').value = animal.descricao || "";

            // Define valores dos selects (após opções existirem)
            const especieSelect = document.getElementById('especieAnimal');
            const racaSelect = document.getElementById('racaAnimal');
            const tutorSelect = document.getElementById('tutorAnimal');

            especieSelect.value = animal.especieId || "";
            racaSelect.value = animal.racaId || "";
            tutorSelect.value = animal.tutorId || "";

            // Caso o valor não exista (por ID diferente), tenta forçar seleção pelo nome
            if (!especieSelect.value && animal.especie?.nome) {
                const opt = [...especieSelect.options].find(o => o.textContent === animal.especie.nome);
                if (opt) especieSelect.value = opt.value;
            }
            if (!racaSelect.value && animal.raca?.nome) {
                const opt = [...racaSelect.options].find(o => o.textContent === animal.raca.nome);
                if (opt) racaSelect.value = opt.value;
            }
            if (!tutorSelect.value && animal.tutor?.nome) {
                const opt = [...tutorSelect.options].find(o => o.textContent === animal.tutor.nome);
                if (opt) tutorSelect.value = opt.value;
            }

        } catch (error) {
            Utils.showAlert("Erro ao carregar dados do animal: " + error.message, "error");
        }
    } else {
        modalTitle.textContent = 'Adicionar Novo Animal';
    }

    ModalManager.show('animalModal');
}

// ========== FECHAR MODAL ==========
function closeAnimalModal() {
    ModalManager.hide('animalModal');
}

// ========== SALVAR (POST / PUT) ==========
document.getElementById('animalForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = {
        id: document.getElementById('animalId').value,
        nome: document.getElementById('nomeAnimal').value,
        dataNascimento: document.getElementById('dataNascimentoAnimal').value,
        porte: document.getElementById('porteAnimal').value,
        peso: parseFloat(document.getElementById('pesoAnimal').value) || 0,
        descricaoSaude: document.getElementById('descricaoSaudeAnimal').value,
        necessidadesEspeciais: document.getElementById('necessidadesEspeciaisAnimal').value,
        descricao: document.getElementById('descricaoAnimal').value,
        especieId: parseInt(document.getElementById('especieAnimal').value),
        racaId: parseInt(document.getElementById('racaAnimal').value),
        tutorId: document.getElementById('tutorAnimal').value
    };

    const method = formData.id ? "PUT" : "POST";
    const url = formData.id
        ? `${API_URL}/Animal/${formData.id}`
        : `${API_URL}/Animal`;

    try {
        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        Utils.showAlert(formData.id ? "Animal atualizado com sucesso!" : "Animal adicionado com sucesso!", "success");
        closeAnimalModal();
        loadAnimals();
    } catch (error) {
        Utils.showAlert("Erro ao salvar animal: " + error.message, "error");
    }
});

// ========== EDITAR ==========
function editAnimal(id) {
    openAnimalModal(id);
}

// ========== EXCLUIR ==========
async function deleteAnimal(id) {
    if (!confirm("Tem certeza que deseja excluir este animal?")) return;

    try {
        await fetch(`${API_URL}/Animal/${id}`, { method: "DELETE" });
        Utils.showAlert("Animal excluído com sucesso!", "success");
        loadAnimals();
    } catch (error) {
        Utils.showAlert("Erro ao excluir animal: " + error.message, "error");
    }
}

// ========== SELECTS ==========
async function loadEspeciesForAnimalForm() {
    const select = document.getElementById('especieAnimal');
    select.innerHTML = '<option value="">Selecione a Espécie</option>';
    try {
        const especies = await fetchJSON(`${API_URL}/Species`);
        especies.forEach(e => {
            const opt = document.createElement('option');
            opt.value = e.id || e.especieId;
            opt.textContent = e.nome;
            select.appendChild(opt);
        });
    } catch {
        Utils.showAlert("Erro ao carregar espécies.", "error");
    }
}

async function loadRacasForAnimalForm() {
    const select = document.getElementById('racaAnimal');
    select.innerHTML = '<option value="">Selecione a Raça</option>';
    try {
        const racas = await fetchJSON(`${API_URL}/Breed`);
        racas.forEach(r => {
            const opt = document.createElement('option');
            opt.value = r.id || r.racaId;
            opt.textContent = r.nome;
            select.appendChild(opt);
        });
    } catch {
        Utils.showAlert("Erro ao carregar raças.", "error");
    }
}

async function loadTutoresForAnimalForm() {
    const select = document.getElementById('tutorAnimal');
    select.innerHTML = '<option value="">Selecione o Tutor</option>';
    try {
        const tutores = await fetchJSON(`${API_URL}/Tutor`);
        tutores.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.tutorId;
            opt.textContent = t.nome;
            select.appendChild(opt);
        });
    } catch {
        Utils.showAlert("Erro ao carregar tutores.", "error");
    }
}
