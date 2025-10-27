const API_URL = "https://localhost:7162/api";

// ===== FUNÇÃO UTILITÁRIA =====
async function fetchJSON(url, options = {}) {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`Erro: ${res.status} ${res.statusText}`);
    return res.json();
}

// ===== LISTAR FORMULÁRIOS =====
async function loadFormularios() {
    try {
        Utils.showLoading(true);
        const formularios = await fetchJSON(`${API_URL}/Forms`);

        const listaSimplificada = formularios.map(f => ({
            id: f.id,
            nomeCompleto: f.nomeCompleto,
            email: f.email,
            telefone: f.telefone,
            dataPreenchimento: new Date(f.dataPreenchimento).toLocaleDateString("pt-BR"),
            statusTexto: getStatusTexto(f.status),
            resposta: f.resposta || "(sem resposta)"
        }));

        const columns = [
            { label: 'Nome', field: 'nomeCompleto' },
            { label: 'E-mail', field: 'email' },
            { label: 'Telefone', field: 'telefone' },
            { label: 'Data', field: 'dataPreenchimento' },
            { label: 'Status', field: 'statusTexto' },
            { label: 'Resposta', field: 'resposta' }
        ];

        const actions = [
            { label: 'Ver/Responder', type: 'primary', onclick: 'editForm' }
        ];

        TableManager.renderTable('form-list-container', listaSimplificada, columns, actions);
    } catch (error) {
        Utils.showAlert("Erro ao carregar formulários: " + error.message, "error");
    } finally {
        Utils.showLoading(false);
    }
}

// ===== ABRIR MODAL =====
async function openFormModal(formId) {
    const form = document.getElementById('formularioForm');
    const fotosContainer = document.getElementById('formFotosContainer');
    form.reset();
    fotosContainer.innerHTML = "";

    try {
        const f = await fetchJSON(`${API_URL}/Forms/${formId}`);

        const set = (id, val) => document.getElementById(id).value = val ?? "";

        // Dados principais
        set('formId', f.id);
        set('nomeCompleto', f.nomeCompleto);
        set('email', f.email);
        set('telefone', f.telefone);
        set('dataNascimento', f.dataNascimento);
        set('endereco', f.endereco);

        // Residência
        set('residenciaTipo', f.residenciaTipo);
        set('residenciaPropriedade', f.residenciaPropriedade);
        set('residenciaTemTelas', f.residenciaTemTelas ? "Sim" : "Não");
        set('acessoARua', f.acessoARua ? "Sim" : "Não");
        set('concordanciaResidencia', f.concordanciaResidencia ? "Sim" : "Não");

        // Animais
        set('temOutrosAnimais', f.temOutrosAnimais ? "Sim" : "Não");
        set('quaisOutrosAnimais', f.quaisOutrosAnimais);
        set('outrosAnimaisCastradosVacinados', f.outrosAnimaisCastradosVacinados ? "Sim" : "Não");

        // Financeiro
        set('renda', f.renda);
        set('condicoesManterAnimal', f.condicoesManterAnimal ? "Sim" : "Não");
        set('concordaTaxaColaborativa', f.concordaTaxaColaborativa ? "Sim" : "Não");
        set('concordaCastracaoVacinacao', f.concordaCastracaoVacinacao ? "Sim" : "Não");

        // Resposta e status
        set('formResposta', f.resposta);
        document.getElementById('formStatus').value = f.status || 1;

        // Fotos
        if (Array.isArray(f.fotos) && f.fotos.length > 0) {
            f.fotos.forEach(base64 => {
                const img = document.createElement("img");
                img.src = `data:image/jpeg;base64,${base64}`;
                img.alt = "Foto do formulário";
                fotosContainer.appendChild(img);
            });
        } else {
            fotosContainer.innerHTML = "<p>Nenhuma foto enviada.</p>";
        }

        ModalManager.show('formModal');
    } catch (error) {
        Utils.showAlert("Erro ao carregar formulário: " + error.message, "error");
    }
}

// ===== FECHAR MODAL =====
function closeFormModal() {
    ModalManager.hide('formModal');
}

// ===== SALVAR RESPOSTA =====
document.getElementById('formularioForm').addEventListener('submit', async e => {
    e.preventDefault();
    Utils.showLoading(true);

    const id = document.getElementById('formId').value;
    const data = {
        resposta: document.getElementById('formResposta').value,
        status: parseInt(document.getElementById('formStatus').value)
    };

    try {
        await fetch(`${API_URL}/Forms/responderFormulario/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        Utils.showAlert("Formulário respondido com sucesso!", "success");
        closeFormModal();
        loadFormularios();
    } catch (error) {
        Utils.showAlert("Erro ao responder formulário: " + error.message, "error");
    } finally {
        Utils.showLoading(false);
    }
});

// ===== STATUS =====
function getStatusTexto(status) {
    switch (status) {
        case 1: return "Pendente";
        case 2: return "Aprovado";
        case 3: return "Rejeitado";
        default: return "Desconhecido";
    }
}

// ===== EDITAR =====
function editForm(id) {
    openFormModal(id);
}
