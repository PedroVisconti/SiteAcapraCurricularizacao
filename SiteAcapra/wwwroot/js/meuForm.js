const API_URL = "https://localhost:7162/api";

function getStatusTexto(status) {
    switch (status) {
        case 1: return "Pendente";
        case 2: return "Aprovado";
        case 3: return "Rejeitado";
        default: return "Desconhecido";
    }
}

async function loadFormularios() {
    const tabela = document.getElementById("listaFormularios");
    const usuarioString = localStorage.getItem("usuario");
    const usuario = usuarioString ? JSON.parse(usuarioString) : null;

    if (!usuario || !usuario.usuarioId) {
        tabela.innerHTML = `<tr><td colspan="7" class="text-center text-warning">Usuário não encontrado. Faça login novamente.</td></tr>`;
        return;
    }

    try {
        const response = await fetch(`${API_URL}/Forms/usuario/${usuario.usuarioId}`);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const formularios = await response.json();

        if (!formularios || formularios.length === 0) {
            tabela.innerHTML = `<tr><td colspan="7" class="text-center text-muted">Nenhum formulário encontrado.</td></tr>`;
            return;
        }

        tabela.innerHTML = "";
        formularios.forEach(f => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${f.nomeCompleto ?? "-"}</td>
                <td>${f.email ?? "-"}</td>
                <td>${f.telefone ?? "-"}</td>
                <td>${f.dataPreenchimento ? new Date(f.dataPreenchimento).toLocaleDateString() : "-"}</td>
                <td>${getStatusTexto(f.status)}</td>
                <td>${f.resposta && f.resposta.trim() !== "" ? f.resposta : "(sem resposta)"}</td>
                <td><button class="btn btn-ver" data-id="${f.id}">Visualizar</button></td>
            `;
            tabela.appendChild(tr);
        });

        document.querySelectorAll(".btn-ver").forEach(btn => {
            btn.addEventListener("click", () => openFormModal(btn.getAttribute("data-id")));
        });

    } catch (err) {
        console.error(err);
        tabela.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Erro ao carregar formulários.</td></tr>`;
    }
}

async function openFormModal(formId) {
    const modal = document.getElementById("formModal");
    const fotosContainer = document.getElementById("formFotosContainer");

    try {
        const response = await fetch(`${API_URL}/Forms/${formId}`);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const f = await response.json();

        document.getElementById("formId").value = f.id;
        document.getElementById("nomeCompleto").value = f.nomeCompleto ?? "";
        document.getElementById("email").value = f.email ?? "";
        document.getElementById("telefone").value = f.telefone ?? "";
        document.getElementById("dataNascimento").value = f.dataNascimento ?? "";
        document.getElementById("endereco").value = f.endereco ?? "";
        document.getElementById("residenciaTipo").value = f.residenciaTipo == 1 ? "Casa" : "Apartamento";
        document.getElementById("residenciaPropriedade").value = f.residenciaPropriedade == 1 ? "Própria" : "Alugada";
        document.getElementById("residenciaTemTelas").value = f.residenciaTemTelas ? "Sim" : "Não";
        document.getElementById("acessoARua").value = f.acessoARua ? "Sim" : "Não";
        document.getElementById("concordanciaResidencia").value = f.concordanciaResidencia ? "Sim" : "Não";
        document.getElementById("temOutrosAnimais").value = f.temOutrosAnimais ? "Sim" : "Não";
        document.getElementById("quaisOutrosAnimais").value = f.quaisOutrosAnimais ?? "";
        document.getElementById("outrosAnimaisCastradosVacinados").value = f.outrosAnimaisCastradosVacinados ? "Sim" : "Não";
        document.getElementById("renda").value = f.renda ?? "";
        document.getElementById("condicoesManterAnimal").value = f.condicoesManterAnimal ? "Sim" : "Não";
        document.getElementById("concordaTaxaColaborativa").value = f.concordaTaxaColaborativa ? "Sim" : "Não";
        document.getElementById("concordaCastracaoVacinacao").value = f.concordaCastracaoVacinacao ? "Sim" : "Não";
        document.getElementById("formResposta").value = f.resposta ?? "";
        document.getElementById("formStatus").value = f.status ?? 1;

        fotosContainer.innerHTML = "";
        if (f.fotos && f.fotos.length > 0) {
            f.fotos.forEach(base64 => {
                const img = document.createElement("img");
                img.src = "data:image/jpeg;base64," + base64;
                fotosContainer.appendChild(img);
            });
        }

        modal.style.display = "flex";

    } catch (err) {
        console.error(err);
        alert("Erro ao carregar formulário.");
    }
}

function closeFormModal() {
    document.getElementById("formModal").style.display = "none";
}

window.onclick = function (event) {
    const modal = document.getElementById("formModal");
    if (event.target == modal) closeFormModal();
}

window.addEventListener("DOMContentLoaded", loadFormularios);
