document.addEventListener("DOMContentLoaded", function () {
    // Tenta pegar os dados do usuario do localStorage
    const usuarioDataString = localStorage.getItem('usuario'); 

    if (!usuarioDataString) {
        console.error("Dados do usuario não encontrados no localStorage.");
        return; 
    }

    let usuarioData;
    try {
        usuarioData = JSON.parse(usuarioDataString);
    } catch (e) {
        console.error("Erro ao fazer parse dos dados do usuario:", e);
        alert("Ocorreu um erro ao carregar os dados do usuario.");
        return; 
    }

    // Seleciona os elementos no HTML usando os IDs corretos
    const nomeCompleto = document.getElementById('nomeCompleto');
    const dataNascimento = document.getElementById('dataNascimento');
    const telefone = document.getElementById('telefone');
    const email = document.getElementById('email');

    if (nomeCompleto) {
        nomeCompleto.value = usuarioData.nome || ""; 
    }

    if (dataNascimento && usuarioData.dataNascimento) {
        try {
            const dataNasc = new Date(usuarioData.dataNascimento);
            
            dataNasc.setUTCDate(dataNasc.getUTCDate() + 1);

            // Formata a data para 'YYYY-MM-DD'
            const dataFormatada = dataNasc.toISOString().split('T')[0];
            
            dataNascimento.value = dataFormatada; 
        } catch (e) {
            console.error("Erro ao formatar a data de nascimento:", e);
        }
    }

    if (telefone) {
        telefone.value = usuarioData.telefone || ""; 
    }

    if (email) {
        email.value = usuarioData.email || ""; 
    }

    console.log("Dados do usuário carregados:", usuarioData.nome);
});