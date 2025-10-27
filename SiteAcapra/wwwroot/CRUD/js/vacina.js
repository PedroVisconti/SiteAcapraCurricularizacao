const API_URL = "https://localhost:7162/api";

async function fetchJSON(url, options = {}) {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`Erro: ${res.status} ${res.statusText}`);
    return res.json();
}

async function loadVacinas() {
    try {
        const vacinas = await fetchJSON(`${API_URL}/Vacina`);

        const mapped = vacinas.map(v => ({
            id: v.vacinaId || v.id,
            nome: v.nome
        }));

        const columns = [
            { label: 'Nome', field: 'nome' }
        ];

        const actions = [
            { label: 'Editar', type: 'warning', onclick: 'editVacina' },
            { label: 'Excluir', type: 'danger', onclick: 'deleteVacina' }
        ];

        TableManager.renderTable('vacina-list-container', mapped, columns, actions);
    } catch (error) {
        Utils.showAlert("Erro ao carregar vacinas: " + error.message, "error");
    }
}

async function openVacinaModal(id = null) {
    const modalTitle = document.getElementById('vacinaModalTitle');
    const form = document.getElementById('vacinaForm');
    form.reset();
    document.getElementById('vacinaId').value = "";

    if (id) {
        modalTitle.textContent = "Editar Vacina";
        try {
            const vacina = await fetchJSON(`${API_URL}/Vacina/${id}`);
            document.getElementById('vacinaId').value = vacina.vacinaId || id;
            document.getElementById('nomeVacina').value = vacina.nome || "";
        } catch (error) {
            Utils.showAlert("Erro ao carregar vacina: " + error.message, "error");
        }
    } else {
        modalTitle.textContent = "Adicionar Nova Vacina";
    }

    ModalManager.show('vacinaModal');
}

function closeVacinaModal() {
    ModalManager.hide('vacinaModal');
}

document.getElementById('vacinaForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const id = document.getElementById('vacinaId').value;
    const formData = {
        nome: document.getElementById('nomeVacina').value
    };

    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/Vacina/${id}` : `${API_URL}/Vacina`;

    try {
        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        Utils.showAlert(id ? "Vacina atualizada com sucesso!" : "Vacina adicionada com sucesso!", "success");
        closeVacinaModal();
        loadVacinas();
    } catch (error) {
        Utils.showAlert("Erro ao salvar vacina: " + error.message, "error");
    }
});

function editVacina(id) {
    openVacinaModal(id);
}

async function deleteVacina(id) {
    if (!confirm("Tem certeza que deseja excluir esta vacina?")) return;

    try {
        await fetch(`${API_URL}/Vacina/${id}`, { method: "DELETE" });
        Utils.showAlert("Vacina excluída com sucesso!", "success");
        loadVacinas();
    } catch (error) {
        Utils.showAlert("Erro ao excluir vacina: " + error.message, "error");
    }
}
