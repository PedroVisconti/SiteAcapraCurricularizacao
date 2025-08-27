// Funções CRUD para Raças

function loadRacas() {
    Utils.showLoading(true);
    const racas = dataManager.getAll("racas");
    const especies = dataManager.getAll("especies");
    const racasWithEspecie = racas.map(raca => ({
        ...raca,
        especieNome: especies.find(e => e.id === raca.especieId)?.nome || 'N/A'
    }));

    const columns = [
        { label: 'Nome', field: 'nome' },
        { label: 'Espécie', field: 'especieNome' }
    ];
    const actions = [
        { label: 'Editar', type: 'warning', onclick: 'editRaca' },
        { label: 'Excluir', type: 'danger', onclick: 'deleteRaca' }
    ];
    TableManager.renderTable('raca-list-container', racasWithEspecie, columns, actions);
    Utils.showLoading(false);
}

function openRacaModal(racaId = null) {
    const modalTitle = document.getElementById('racaModalTitle');
    const racaForm = document.getElementById('racaForm');
    FormManager.clearForm(racaForm);

    if (racaId) {
        modalTitle.textContent = 'Editar Raça';
        const raca = dataManager.getById('racas', racaId);
        if (raca) {
            FormManager.populateForm(racaForm, raca);
        }
    } else {
        modalTitle.textContent = 'Adicionar Nova Raça';
    }
    ModalManager.show('racaModal');
}

function closeRacaModal() {
    ModalManager.hide('racaModal');
}

document.getElementById('racaForm').addEventListener('submit', function(event) {
    event.preventDefault();
    Utils.showLoading(true);
    const formData = FormManager.getFormData(this);

    formData.especieId = parseInt(formData.especieId);

    if (formData.id) {
        // Editar raça existente
        dataManager.update('racas', formData.id, formData);
        Utils.showAlert('Raça atualizada com sucesso!', 'success');
    } else {
        // Adicionar nova raça
        dataManager.create('racas', formData);
        Utils.showAlert('Raça adicionada com sucesso!', 'success');
    }
    closeRacaModal();
    loadRacas();
    Utils.showLoading(false);
});

function editRaca(id) {
    openRacaModal(id);
}

function deleteRaca(id) {
    if (confirm('Tem certeza que deseja excluir esta raça?')) {
        Utils.showLoading(true);
        dataManager.delete('racas', id);
        Utils.showAlert('Raça excluída com sucesso!', 'success');
        loadRacas();
        Utils.showLoading(false);
    }
}

// Função para carregar select de espécies no formulário de raça
function loadEspeciesForRacaForm() {
    const especies = dataManager.getAll('especies');
    const especieSelect = document.getElementById('especieRaca');
    especieSelect.innerHTML = '<option value="">Selecione a Espécie</option>';
    especies.forEach(especie => {
        const option = document.createElement('option');
        option.value = especie.id;
        option.textContent = especie.nome;
        especieSelect.appendChild(option);
    });
}


