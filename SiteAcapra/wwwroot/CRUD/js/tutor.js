

const API_URL = "https://localhost:7162/api";

async function fetchJSON(url, options = {}) {
    const res = await fetch(url, options);
    if (res.status === 204) return null;
    
    let errorDetails = `Erro: ${res.status} ${res.statusText}`;
    if (!res.ok) {
        try {
            const errorJson = await res.json();
            if (errorJson.errors) {
                errorDetails += ". Detalhes: " + JSON.stringify(errorJson.errors);
            } else if (errorJson.title) {
                errorDetails += ". Detalhes: " + errorJson.title;
            }
        } catch (e) {
        }
        throw new Error(errorDetails);
    }
    
    return res.json();
}

async function loadTutores() {

    const container = document.getElementById("tutor-list-container");
    container.innerHTML = "Carregando tutores..."; 

    try {
        const tutores = await fetchJSON(`${API_URL}/Tutor`);

        if (!tutores || tutores.length === 0) {
            container.innerHTML = "<p>Nenhum tutor cadastrado.</p>";
            return;
        }


        const table = document.createElement("table");
        table.classList.add("table");


        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        ["Nome", "Email", "Telefone", "CPF", "Nascimento", "Ações"].forEach(text => {
            const th = document.createElement("th");
            th.textContent = text;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);


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


            const actionsTd = document.createElement("td");


            const editBtn = document.createElement("button");
            editBtn.textContent = "Editar";
            editBtn.classList.add("btn", "btn-warning");
            editBtn.onclick = () => openTutorModal(t.tutorId);


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
}

async function openTutorModal(tutorId = null) {
    const modalTitle = document.getElementById("tutorModalTitle");
    const form = document.getElementById("tutorForm");
    form.reset();
    document.getElementById("tutorId").value = ""; 

    if (tutorId) {
        modalTitle.textContent = "Editar Tutor";
        try {
            const tutor = await fetchJSON(`${API_URL}/Tutor/${tutorId}`);
            
            document.getElementById("tutorId").value = tutor.tutorId;
            document.getElementById("nomeTutor").value = tutor.nome || "";
            document.getElementById("emailTutor").value = tutor.email || "";
            document.getElementById("telefoneTutor").value = tutor.telefone || "";
            document.getElementById("cpfTutor").value = tutor.cpf || "";
            document.getElementById("dataNascimentoTutor").value = tutor.dataNascimento ? tutor.dataNascimento.split("T")[0] : "";
            document.getElementById("sexoTutor").value = tutor.sexo || "";
            document.getElementById("enderecoTutor").value = tutor.endereco || "";
            
        } catch (error) {
            alert("Erro ao carregar dados do tutor: " + error.message);
        }
    } else {
        modalTitle.textContent = "Adicionar Novo Tutor";
    }

    document.getElementById("tutorModal").style.display = "block";
}

function closeTutorModal() {
    document.getElementById("tutorModal").style.display = "none";
}

document.getElementById("tutorForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const tutorId = document.getElementById("tutorId").value;
    
    const rawCpf = document.getElementById("cpfTutor").value;
    const cleanedCpf = rawCpf.replace(/[^0-9]/g, ''); 

    const formData = {
        nome: document.getElementById("nomeTutor").value,
        email: document.getElementById("emailTutor").value,
        telefone: document.getElementById("telefoneTutor").value,
        endereco: document.getElementById("enderecoTutor").value,
        cpf: cleanedCpf, 
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
});

async function deleteTutor(tutorId) {
    if (!confirm("Tem certeza que deseja excluir este tutor? Esta ação é irreversível.")) return;

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
}

document.addEventListener("DOMContentLoaded", loadTutores);

window.openTutorModal = openTutorModal; 
window.closeTutorModal = closeTutorModal;
window.deleteTutor = deleteTutor;