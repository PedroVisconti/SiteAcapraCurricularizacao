// Funções CRUD para Tutores

function loadTutores() {
    Utils.showLoading(true);
    const tutores = dataManager.getAll("tutores");
    const columns = [
        { label: 'Nome', field: 'nome' },
        { label: 'Email', field: 'email' },
        { label: 'Telefone', field: 'telefone', format: Utils.formatPhone },
        { label: 'CPF', field: 'cpf', format: Utils.formatCPF },
        { label: 'Data Nasc.', field: 'dataNascimento', format: Utils.formatDate }
    ];
    const actions = [
        { label: 'Editar', type: 'warning', onclick: 'editTutor' },
        { label: 'Excluir', type: 'danger', onclick: 'deleteTutor' }
    ];
    TableManager.renderTable('tutor-list-container', tutores, columns, actions);
    Utils.showLoading(false);
}

function openTutorModal(tutorId = null) {
    const modalTitle = document.getElementById('tutorModalTitle');
    const tutorForm = document.getElementById('tutorForm');
    FormManager.clearForm(tutorForm);

    if (tutorId) {
        modalTitle.textContent = 'Editar Tutor';
        const tutor = dataManager.getById('tutores', tutorId);
        if (tutor) {
            FormManager.populateForm(tutorForm, tutor);
        }
    } else {
        modalTitle.textContent = 'Adicionar Novo Tutor';
    }
    ModalManager.show('tutorModal');
}

function closeTutorModal() {
    ModalManager.hide('tutorModal');
}

document.getElementById('tutorForm').addEventListener('submit', function(event) {
    event.preventDefault();
    Utils.showLoading(true);
    const formData = FormManager.getFormData(this);

    // Validações básicas
    if (!Utils.validateEmail(formData.email)) {
        Utils.showAlert('Email inválido!', 'error');
        Utils.showLoading(false);
        return;
    }
    if (!Utils.validateCPF(formData.cpf)) {
        Utils.showAlert('CPF inválido!', 'error');
        Utils.showLoading(false);
        return;
    }
    if (!Utils.validatePhone(formData.telefone)) {
        Utils.showAlert('Telefone inválido!', 'error');
        Utils.showLoading(false);
        return;
    }

    if (formData.id) {
        // Editar tutor existente
        dataManager.update('tutores', formData.id, formData);
        Utils.showAlert('Tutor atualizado com sucesso!', 'success');
    } else {
        // Adicionar novo tutor
        // Gerar um ID único para o tutor (simulando GUID)
        formData.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        dataManager.create('tutores', formData);
        Utils.showAlert('Tutor adicionado com sucesso!', 'success');
    }
    closeTutorModal();
    loadTutores();
    Utils.showLoading(false);
});

function editTutor(id) {
    openTutorModal(id);
}

function deleteTutor(id) {
    if (confirm('Tem certeza que deseja excluir este tutor?')) {
        Utils.showLoading(true);
        dataManager.delete('tutores', id);
        Utils.showAlert('Tutor excluído com sucesso!', 'success');
        loadTutores();
        Utils.showLoading(false);
    }
}


