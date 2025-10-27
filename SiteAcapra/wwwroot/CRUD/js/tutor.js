// Arquivo: tutor.js

const API_URL = "https://localhost:7162/api"; // URL da sua API

// ========== FUNÇÃO GENÉRICA (UTILITÁRIA) ==========
async function fetchJSON(url, options = {}) {
    const res = await fetch(url, options);
    if (res.status === 204) return null;
    
    let errorDetails = `Erro: ${res.status} ${res.statusText}`;
    if (!res.ok) {
        try {
            // Tenta obter uma mensagem de erro mais detalhada do corpo (se for JSON)
            const errorJson = await res.json();
            if (errorJson.errors) {
                errorDetails += ". Detalhes: " + JSON.stringify(errorJson.errors);
            } else if (errorJson.title) {
                errorDetails += ". Detalhes: " + errorJson.title;
            }
        } catch (e) {
            // Se não for JSON, usa o texto puro ou detalhes do status
        }
        throw new Error(errorDetails);
    }
    
    return res.json();
}

// ========== LISTAR TUTORES E RENDERIZAR TABELA ==========
async function loadTutores() {
    // Você pode adicionar 'Utils.showLoading(true)' aqui se tiver a função
    const container = document.getElementById("tutor-list-container");
    container.innerHTML = "Carregando tutores..."; // Mensagem de carregamento

    try {
        const tutores = await fetchJSON(`${API_URL}/Tutor`);

        if (!tutores || tutores.length === 0) {
            container.innerHTML = "<p>Nenhum tutor cadastrado.</p>";
            return;
        }

        // Criar e renderizar a tabela
        const table = document.createElement("table");
        table.classList.add("table");

        // Cabeçalho
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        ["Nome", "Email", "Telefone", "CPF", "Nascimento", "Ações"].forEach(text => {
            const th = document.createElement("th");
            th.textContent = text;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Corpo da tabela
        const tbody = document.createElement("tbody");
        tutores.forEach(t => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${t.nome || "-"}</td>
                <td>${t.email || "-"}</td>
                <td>${t.telefone || "-"}</td>
                <td>${t.cpf || "-"}</td>
                <td>${t.dataNascimento ? new Date(t.dataNascimento).toLocaleDateString('pt-BR') : "-"}</td>
            `;

            // Célula de Ações
            const actionsTd = document.createElement("td");

            // Botão Editar
            const editBtn = document.createElement("button");
            editBtn.textContent = "Editar";
            editBtn.classList.add("btn", "btn-warning");
            editBtn.onclick = () => openTutorModal(t.tutorId);

            // Botão Excluir
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Excluir";
            deleteBtn.classList.add("btn", "btn-danger");
            deleteBtn.onclick = () => deleteTutor(t.tutorId);

            actionsTd.appendChild(editBtn);
            actionsTd.appendChild(deleteBtn);
            tr.appendChild(actionsTd);

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        container.innerHTML = "";
        container.appendChild(table);

    } catch (error) {
        container.innerHTML = `<p style="color: red;">Erro ao carregar tutores: ${error.message}</p>`;
        console.error("Erro ao carregar tutores:", error);
    }
    // Você pode adicionar 'Utils.showLoading(false)' aqui se tiver a função
}

// ========== ABRIR MODAL (Adicionar/Editar) ==========
async function openTutorModal(tutorId = null) {
    const modalTitle = document.getElementById("tutorModalTitle");
    const form = document.getElementById("tutorForm");
    form.reset();
    document.getElementById("tutorId").value = ""; 

    if (tutorId) {
        modalTitle.textContent = "Editar Tutor";
        try {
            // Você pode adicionar 'Utils.showLoading(true)' aqui
            const tutor = await fetchJSON(`${API_URL}/Tutor/${tutorId}`);
            
            document.getElementById("tutorId").value = tutor.tutorId;
            document.getElementById("nomeTutor").value = tutor.nome || "";
            document.getElementById("emailTutor").value = tutor.email || "";
            document.getElementById("telefoneTutor").value = tutor.telefone || "";
            document.getElementById("cpfTutor").value = tutor.cpf || "";
            // Formato 'YYYY-MM-DD' é necessário para input type="date"
            document.getElementById("dataNascimentoTutor").value = tutor.dataNascimento ? tutor.dataNascimento.split("T")[0] : "";
            document.getElementById("sexoTutor").value = tutor.sexo || "";
            document.getElementById("enderecoTutor").value = tutor.endereco || "";
            
        } catch (error) {
            alert("Erro ao carregar dados do tutor: " + error.message);
        }
        // Você pode adicionar 'Utils.showLoading(false)' aqui
    } else {
        modalTitle.textContent = "Adicionar Novo Tutor";
    }

    // Função simples para exibir o modal (substitui ModalManager.show)
    document.getElementById("tutorModal").style.display = "block";
}

// ========== FECHAR MODAL ==========
function closeTutorModal() {
    // Função simples para ocultar o modal (substitui ModalManager.hide)
    document.getElementById("tutorModal").style.display = "none";
}

// ========== SALVAR TUTOR (POST/PUT) ==========
document.getElementById("tutorForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    // Você pode adicionar 'Utils.showLoading(true)' aqui

    const tutorId = document.getElementById("tutorId").value;
    
    // Obtém o valor do CPF e remove todos os caracteres que não são dígitos
    const rawCpf = document.getElementById("cpfTutor").value;
    const cleanedCpf = rawCpf.replace(/[^0-9]/g, ''); 

    const formData = {
        nome: document.getElementById("nomeTutor").value,
        email: document.getElementById("emailTutor").value,
        telefone: document.getElementById("telefoneTutor").value,
        endereco: document.getElementById("enderecoTutor").value,
        cpf: cleanedCpf, // CPF LIMPO
        // Garante que a data está no formato correto 'YYYY-MM-DD'
        dataNascimento: document.getElementById("dataNascimentoTutor").value, 
        sexo: document.getElementById("sexoTutor").value
    };

    const url = tutorId ? `${API_URL}/Tutor/${tutorId}` : `${API_URL}/Tutor`;
    const method = tutorId ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Falha na API: ${response.status} ${response.statusText}. Detalhes: ${errorText.substring(0, 100)}...`);
        }
        
        alert(tutorId ? "Tutor atualizado com sucesso!" : "Tutor adicionado com sucesso!");
        closeTutorModal();
        loadTutores();

    } catch (error) {
        alert("Erro ao salvar tutor: " + error.message);
    }
    // Você pode adicionar 'Utils.showLoading(false)' aqui
});

// ========== EXCLUIR TUTOR ==========
async function deleteTutor(tutorId) {
    if (!confirm("Tem certeza que deseja excluir este tutor? Esta ação é irreversível.")) return;

    // Você pode adicionar 'Utils.showLoading(true)' aqui
    try {
        const response = await fetch(`${API_URL}/Tutor/${tutorId}`, { method: "DELETE" });
        
        if (!response.ok) {
            throw new Error(`Falha na exclusão: ${response.status} ${response.statusText}`);
        }

        alert("Tutor excluído com sucesso!");
        loadTutores();
    } catch (error) {
        alert("Erro ao excluir tutor: " + error.message);
    }
    // Você pode adicionar 'Utils.showLoading(false)' aqui
}

// ========== INICIALIZAÇÃO E EXPOSIÇÃO GLOBAL ==========
document.addEventListener("DOMContentLoaded", loadTutores);

// Torna as funções acessíveis globalmente para os atributos 'onclick' no HTML
window.openTutorModal = openTutorModal; 
window.closeTutorModal = closeTutorModal;
window.deleteTutor = deleteTutor;