// Funções CRUD para Animais

function loadAnimals() {
    Utils.showLoading(true);
    const animals = dataManager.getAllAnimalsWithRelations();
    const columns = [
        { label: 'Nome', field: 'nome' },
        { label: 'Espécie', field: 'especie' },
        { label: 'Raça', field: 'raca' },
        { label: 'Porte', field: 'porte' },
        { label: 'Idade', field: 'dataNascimento', format: (value) => `${Utils.calculateAge(value)} anos` },
        { label: 'Tutor', field: 'tutor' },
        { label: 'Castrado', field: 'castrado', format: (value) => value ? 'Sim' : 'Não' },
        { label: 'Adotado', field: 'adotado', format: (value) => value ? 'Sim' : 'Não' }
    ];
    const actions = [
        { label: 'Editar', type: 'warning', onclick: 'editAnimal' },
        { label: 'Excluir', type: 'danger', onclick: 'deleteAnimal' }
    ];
    TableManager.renderTable('animal-list-container', animals, columns, actions);
    Utils.showLoading(false);
}

function openAnimalModal(animalId = null) {
    const modalTitle = document.getElementById('animalModalTitle');
    const animalForm = document.getElementById('animalForm');
    FormManager.clearForm(animalForm);

    if (animalId) {
        modalTitle.textContent = 'Editar Animal';
        const animal = dataManager.getById('animais', animalId);
        if (animal) {
            FormManager.populateForm(animalForm, animal);
            // Carregar raças para a espécie selecionada
            loadRacasForAnimalForm(animal.especieId);
        }
    } else {
        modalTitle.textContent = 'Adicionar Novo Animal';
        // Limpar e carregar opções para um novo animal
        loadRacasForAnimalForm();
    }
    ModalManager.show('animalModal');
}

function closeAnimalModal() {
    ModalManager.hide('animalModal');
}

document.getElementById('animalForm').addEventListener('submit', function(event) {
    event.preventDefault();
    Utils.showLoading(true);
    const formData = FormManager.getFormData(this);

    // Converter tipos para o formato esperado
    formData.dataNascimento = formData.dataNascimento; // Já é string no formato YYYY-MM-DD
    formData.peso = formData.peso ? parseFloat(formData.peso) : null;
    formData.castrado = !!formData.castrado; // Converte para booleano
    formData.racaId = parseInt(formData.racaId);
    formData.especieId = parseInt(formData.especieId);

    if (formData.id) {
        // Editar animal existente
        dataManager.update('animais', formData.id, formData);
        Utils.showAlert('Animal atualizado com sucesso!', 'success');
    } else {
        // Adicionar novo animal
        dataManager.create('animais', formData);
        Utils.showAlert('Animal adicionado com sucesso!', 'success');
    }
    closeAnimalModal();
    loadAnimals();
    Utils.showLoading(false);
});

function editAnimal(id) {
    openAnimalModal(id);
}

function deleteAnimal(id) {
    if (confirm('Tem certeza que deseja excluir este animal?')) {
        Utils.showLoading(true);
        dataManager.delete('animais', id);
        Utils.showAlert('Animal excluído com sucesso!', 'success');
        loadAnimals();
        Utils.showLoading(false);
    }
}

// Funções para carregar selects
function loadEspeciesForAnimalForm() {
    const especies = dataManager.getAll('especies');
    const especieSelect = document.getElementById('especieAnimal');
    especieSelect.innerHTML = '<option value="">Selecione a Espécie</option>';
    especies.forEach(especie => {
        const option = document.createElement('option');
        option.value = especie.id;
        option.textContent = especie.nome;
        especieSelect.appendChild(option);
    });
}

function loadRacasForAnimalForm(especieId = null) {
    const racaSelect = document.getElementById('racaAnimal');
    racaSelect.innerHTML = '<option value="">Selecione a Raça</option>';
    racaSelect.disabled = true; // Desabilita até que uma espécie seja selecionada

    if (especieId) {
        const racas = dataManager.getRacasByEspecie(especieId);
        racas.forEach(raca => {
            const option = document.createElement('option');
            option.value = raca.id;
            option.textContent = raca.nome;
            racaSelect.appendChild(option);
        });
        racaSelect.disabled = false;
    }
}

function loadTutoresForAnimalForm() {
    const tutores = dataManager.getAll('tutores');
    const tutorSelect = document.getElementById('tutorAnimal');
    tutorSelect.innerHTML = '<option value="">Selecione o Tutor</option>';
    tutores.forEach(tutor => {
        const option = document.createElement('option');
        option.value = tutor.id;
        option.textContent = tutor.nome;
        tutorSelect.appendChild(option);
    });
}


