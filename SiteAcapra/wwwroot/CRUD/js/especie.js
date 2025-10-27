const API_URL = "https://localhost:7162/api";

// ========== FUNÇÃO UTILITÁRIA ==========
async function fetchJSON(url, options = {}) {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`Erro: ${res.status} ${res.statusText}`);
    return res.json();
}

// ========== LISTAR ESPÉCIES ==========
async function loadEspecies() {
    try {
        Utils.showLoading(true);

        const especies = await fetchJSON(`${API_URL}/Species`);

        const especiesSimplificadas = especies.map(e => ({
            id: e.especieId || e.id,
            nome: e.nome
        }));

        const columns = [
            { label: 'Nome', field: 'nome' }
        ];

        const actions = [
            { label: 'Editar', type: 'warning', onclick: 'editEspecie' },
            { label: 'Excluir', type: 'danger', onclick: 'deleteEspecie' }
        ];

        TableManager.renderTable('especie-list-container', especiesSimplificadas, columns, actions);

    } catch (error) {
        Utils.showAlert("Erro ao carregar espécies: " + error.message, "error");
    } finally {
        Utils.showLoading(false);
    }
}

// ========== ABRIR MODAL ==========
async function openEspecieModal(especieId = null) {
    const modalTitle = document.getElementById('especieModalTitle');
    const especieForm = document.getElementById('especieForm');
    especieForm.reset();

    if (especieId) {
        modalTitle.textContent = 'Editar Espécie';
        try {
            const especie = await fetchJSON(`${API_URL}/Species/${especieId}`);
            document.getElementById('especieId').value = especie.especieId;
            document.getElementById('nomeEspecie').value = especie.nome || "";
        } catch (error) {
            Utils.showAlert("Erro ao carregar espécie: " + error.message, "error");
        }
    } else {
        modalTitle.textContent = 'Adicionar Nova Espécie';
    }

    ModalManager.show('especieModal');
}

// ========== FECHAR MODAL ==========
function closeEspecieModal() {
    ModalManager.hide('especieModal');
}

// ========== SALVAR ESPÉCIE ==========
document.getElementById('especieForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    Utils.showLoading(true);

    const id = document.getElementById('especieId').value;
    const formData = {
        nome: document.getElementById('nomeEspecie').value
    };

    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/Species/${id}` : `${API_URL}/Species/Register`;

    try {
        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        Utils.showAlert(id ? 'Espécie atualizada com sucesso!' : 'Espécie adicionada com sucesso!', 'success');
        closeEspecieModal();
        loadEspecies();

    } catch (error) {
        Utils.showAlert("Erro ao salvar espécie: " + error.message, "error");
    } finally {
        Utils.showLoading(false);
    }
});

// ========== EXCLUIR ==========
async function deleteEspecie(id) {
    if (!confirm('Tem certeza que deseja excluir esta espécie?')) return;

    try {
        await fetch(`${API_URL}/Species/${id}`, { method: "DELETE" });
        Utils.showAlert('Espécie excluída com sucesso!', 'success');
        loadEspecies();
    } catch (error) {
        Utils.showAlert('Erro ao excluir espécie: ' + error.message, 'error');
    }
}

// ========== EDITAR ==========
function editEspecie(id) {
    openEspecieModal(id);
}
