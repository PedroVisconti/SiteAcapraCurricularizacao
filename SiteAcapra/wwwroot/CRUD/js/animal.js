const API_URL = "https://localhost:7162/api"; // base correta da API

// Função utilitária para tratar erros
async function fetchJSON(url, options = {}) {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`Erro: ${res.status} ${res.statusText}`);
    return res.json();
}

// ========== LISTAR ANIMAIS ==========
async function loadAnimals() {
    Utils.showLoading(true);
    try {
        // Corrigido o endpoint para /api/Animal
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
    } finally {
        Utils.showLoading(false);
    }
}

// ========== ABRIR MODAL ==========
async function openAnimalModal(animalId = null) {
    const modalTitle = document.getElementById('animalModalTitle');
    const animalForm = document.getElementById('animalForm');
    FormManager.clearForm(animalForm);

    await loadEspeciesForAnimalForm();
    await loadTutoresForAnimalForm();

    if (animalId) {
        modalTitle.textContent = 'Editar Animal';
        try {
            const animal = await fetchJSON(`${API_URL}/Animal/${animalId}`);
            FormManager.populateForm(animalForm, animal);
            await loadRacasForAnimalForm(animal.especie?.id || animal.especieId);
        } catch (error) {
            Utils.showAlert("Erro ao carregar animal: " + error.message, "error");
        }
    } else {
        modalTitle.textContent = 'Adicionar Novo Animal';
        await loadRacasForAnimalForm();
    }

    ModalManager.show('animalModal');
}

// ========== FECHAR MODAL ==========
function closeAnimalModal() {
    ModalManager.hide('animalModal');
}

// ========== SALVAR (POST/PUT) ==========
document.getElementById('animalForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    Utils.showLoading(true);

    const formData = FormManager.getFormData(this);
    formData.peso = formData.peso ? parseFloat(formData.peso) : 0;
    formData.castrado = !!formData.castrado;
    formData.racaId = parseInt(formData.racaId);
    formData.especieId = parseInt(formData.especieId);
    // tutorId é UUID (string), então não converte

    try {
        const method = formData.id ? "PUT" : "POST";
        const url = formData.id
            ? `${API_URL}/Animal/${formData.id}`
            : `${API_URL}/Animal`;

        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        Utils.showAlert(
            formData.id ? "Animal atualizado com sucesso!" : "Animal adicionado com sucesso!",
            "success"
        );

        closeAnimalModal();
        loadAnimals();
    } catch (error) {
        Utils.showAlert("Erro ao salvar animal: " + error.message, "error");
    } finally {
        Utils.showLoading(false);
    }
});

// ========== EDITAR ==========
function editAnimal(id) {
    openAnimalModal(id);
}

// ========== EXCLUIR ==========
async function deleteAnimal(id) {
    if (!confirm('Tem certeza que deseja excluir este animal?')) return;

    Utils.showLoading(true);
    try {
        await fetch(`${API_URL}/Animal/${id}`, { method: "DELETE" });
        Utils.showAlert("Animal excluído com sucesso!", "success");
        loadAnimals();
    } catch (error) {
        Utils.showAlert("Erro ao excluir animal: " + error.message, "error");
    } finally {
        Utils.showLoading(false);
    }
}

// ========== SELECTS (ESPECIE / RAÇA / TUTOR) ==========
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
    select.disabled = false; // deixa ativo desde o início

    try {
        const racas = await fetchJSON(`${API_URL}/Breed`);
        racas.forEach(r => {
            const opt = document.createElement('option');
            opt.value = r.racaId || r.id; // depende do nome da propriedade na API
            opt.textContent = r.nome;
            select.appendChild(opt);
        });
    } catch (error) {
        Utils.showAlert("Erro ao carregar raças: " + error.message, "error");
    }
}

async function loadTutoresForAnimalForm() {
    const select = document.getElementById('tutorAnimal');
    select.innerHTML = '<option value="">Selecione o Tutor</option>';
    try {
        const tutores = await fetchJSON(`${API_URL}/Tutor`);
        console.log("LOG DE TUTORES: " + tutores);
        tutores.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.tutorId; // é UUID (string)
            opt.textContent = t.nome;
            select.appendChild(opt);
        });
    } catch {
        Utils.showAlert("Erro ao carregar tutores.", "error");
    }
}
