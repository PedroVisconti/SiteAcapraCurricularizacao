const API_URL = "https://localhost:7162/api";

// ========== FUNÇÃO UTILITÁRIA ==========
async function fetchJSON(url, options = {}) {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`Erro: ${res.status} ${res.statusText}`);
    return res.json();
}

// ========== LISTAR RAÇAS ==========
async function loadRacas() {
    try {
        Utils.showLoading(true);

        const racas = await fetchJSON(`${API_URL}/Breed`);

        const racasSimplificadas = racas.map(raca => ({
            id: raca.racaId || raca.id,
            nome: raca.nome
        }));

        const columns = [
            { label: 'Nome', field: 'nome' }
        ];

        const actions = [
            { label: 'Editar', type: 'warning', onclick: 'editRaca' },
            { label: 'Excluir', type: 'danger', onclick: 'deleteRaca' }
        ];

        TableManager.renderTable('raca-list-container', racasSimplificadas, columns, actions);

    } catch (error) {
        Utils.showAlert("Erro ao carregar raças: " + error.message, "error");
    } finally {
        Utils.showLoading(false);
    }
}

// ========== ABRIR MODAL ==========
async function openRacaModal(racaId = null) {
    const modalTitle = document.getElementById('racaModalTitle');
    const racaForm = document.getElementById('racaForm');
    racaForm.reset();

    if (racaId) {
        modalTitle.textContent = 'Editar Raça';
        try {
            const raca = await fetchJSON(`${API_URL}/Breed/${racaId}`);
            document.getElementById('racaId').value = raca.racaId;
            document.getElementById('nomeRaca').value = raca.nome || "";
        } catch (error) {
            Utils.showAlert("Erro ao carregar raça: " + error.message, "error");
        }
    } else {
        modalTitle.textContent = 'Adicionar Nova Raça';
    }

    ModalManager.show('racaModal');
}

// ========== FECHAR MODAL ==========
function closeRacaModal() {
    ModalManager.hide('racaModal');
}

// ========== SALVAR RAÇA ==========
document.getElementById('racaForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    Utils.showLoading(true);

    const id = document.getElementById('racaId').value;
    const formData = {
        nome: document.getElementById('nomeRaca').value
    };

    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/Breed/${id}` : `${API_URL}/Breed/Register`;

    try {
        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        Utils.showAlert(id ? 'Raça atualizada com sucesso!' : 'Raça adicionada com sucesso!', 'success');
        closeRacaModal();
        loadRacas();

    } catch (error) {
        Utils.showAlert("Erro ao salvar raça: " + error.message, "error");
    } finally {
        Utils.showLoading(false);
    }
});

// ========== EXCLUIR ==========
async function deleteRaca(id) {
    if (!confirm('Tem certeza que deseja excluir esta raça?')) return;

    try {
        await fetch(`${API_URL}/Breed/${id}`, { method: "DELETE" });
        Utils.showAlert('Raça excluída com sucesso!', 'success');
        loadRacas();
    } catch (error) {
        Utils.showAlert('Erro ao excluir raça: ' + error.message, 'error');
    }
}

// ========== EDITAR ==========
function editRaca(id) {
    openRacaModal(id);
}
