// Funções CRUD para Vacinas

function loadVacinas() {
    Utils.showLoading(true);
    const vacinas = dataManager.getAll("vacinas");
    const columns = [
        { label: 'Nome', field: 'nome' },
        { label: 'Descrição', field: 'descricao' }
    ];
    const actions = [
        { label: 'Editar', type: 'warning', onclick: 'editVacina' },
        { label: 'Excluir', type: 'danger', onclick: 'deleteVacina' }
    ];
    TableManager.renderTable('vacina-list-container', vacinas, columns, actions);
    Utils.showLoading(false);
}

function openVacinaModal(vacinaId = null) {
    const modalTitle = document.getElementById('vacinaModalTitle');
    const vacinaForm = document.getElementById('vacinaForm');
    FormManager.clearForm(vacinaForm);

    if (vacinaId) {
        modalTitle.textContent = 'Editar Vacina';
        const vacina = dataManager.getById('vacinas', vacinaId);
        if (vacina) {
            FormManager.populateForm(vacinaForm, vacina);
        }
    } else {
        modalTitle.textContent = 'Adicionar Nova Vacina';
    }
    ModalManager.show('vacinaModal');
}

function closeVacinaModal() {
    ModalManager.hide('vacinaModal');
}

document.getElementById('vacinaForm').addEventListener('submit', function(event) {
    event.preventDefault();
    Utils.showLoading(true);
    const formData = FormManager.getFormData(this);

    if (formData.id) {
        // Editar vacina existente
        dataManager.update('vacinas', formData.id, formData);
        Utils.showAlert('Vacina atualizada com sucesso!', 'success');
    } else {
        // Adicionar nova vacina
        dataManager.create('vacinas', formData);
        Utils.showAlert('Vacina adicionada com sucesso!', 'success');
    }
    closeVacinaModal();
    loadVacinas();
    Utils.showLoading(false);
});

function editVacina(id) {
    openVacinaModal(id);
}

function deleteVacina(id) {
    if (confirm('Tem certeza que deseja excluir esta vacina?')) {
        Utils.showLoading(true);
        dataManager.delete('vacinas', id);
        Utils.showAlert('Vacina excluída com sucesso!', 'success');
        loadVacinas();
        Utils.showLoading(false);
    }
}


