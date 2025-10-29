document.addEventListener("DOMContentLoaded", function () {
    const temOutrosAnimaisSelect = document.getElementById('TemOutrosAnimais');
    const quaisOutrosAnimaisGroup = document.getElementById('quais-outros-animais-group');
    const animaisCastradosVacinadosGroup = document.getElementById('animais-castrados-vacinados-group');

    temOutrosAnimaisSelect.addEventListener('change', function () {
        if (this.value === 'true') {
            quaisOutrosAnimaisGroup.style.display = 'block';
            animaisCastradosVacinadosGroup.style.display = 'block';
            document.getElementById('QuaisOutrosAnimais').setAttribute('required', 'true');
            document.getElementById('AnimaisCastradosVacinados').setAttribute('required', 'true');
        } else {
            quaisOutrosAnimaisGroup.style.display = 'none';
            animaisCastradosVacinadosGroup.style.display = 'none';
            document.getElementById('QuaisOutrosAnimais').removeAttribute('required');
            document.getElementById('AnimaisCastradosVacinados').removeAttribute('required');
        }
    });

    temOutrosAnimaisSelect.dispatchEvent(new Event('change'));


    function fileToBase64WithQuality(file, maxWidth = 800, quality = 0.7) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const img = new Image();
                img.src = reader.result;

                img.onload = () => {
                    const scale = Math.min(maxWidth / img.width, 1);
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width * scale;
                    canvas.height = img.height * scale;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    const base64 = canvas.toDataURL('image/jpeg', quality).split(',')[1];
                    resolve(base64);
                };
                img.onerror = err => reject(err);
            };
            reader.onerror = err => reject(err);
        });
    }

    const form = document.querySelector('.form-cadastro');
    
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const usuarioDataString = localStorage.getItem('usuario');
        const animalDataString = localStorage.getItem('animalParaAdocao');

        let animalData;
    try {
        animalData = JSON.parse(animalDataString);
    } catch (e) {
        console.error("Erro ao fazer parse dos dados do animal:", e);
        alert("Ocorreu um erro ao carregar os dados do animal.");
        return; // Sai se o JSON for inválido
    }

    let usuarioData;
    try {
        usuarioData = JSON.parse(usuarioDataString);
    } catch (e) {
        console.error("Erro ao fazer parse dos dados do usuario:", e);
        alert("Ocorreu um erro ao carregar os dados do usuario.");
        return; 
    }

        const botaoEnviar = document.getElementById('btnSalvar');
        try {
            const fotoDocumento = document.getElementById('Fotodocumentos').files[0];
            const comprovanteRenda = document.getElementById('ComprovanteRenda').files[0];
            const fotoLocal = document.getElementById('FotoLocal').files[0];

            botaoEnviar.disabled = true;
            botaoEnviar.textContent = "Enviando...";

            if (!fotoDocumento || !comprovanteRenda || !fotoLocal) {
                alert('Envie todas as 3 fotos.');
                return;
            }
            const fotosBase64 = await Promise.all([
                fileToBase64WithQuality(fotoDocumento, 800, 0.7),
                fileToBase64WithQuality(comprovanteRenda, 800, 0.7),
                fileToBase64WithQuality(fotoLocal, 800, 0.7)
            ]);

            const idDoAnimal = animalData.animalId;
            const idDoUsuario = usuarioData.usuarioId;

            if (!idDoAnimal || !idDoUsuario) {
                alert("Erro: AnimalId ou UsuarioId não encontrados. Não é possível enviar o formulário.");
                return;
            }

            const Vacinados = document.getElementById('AnimaisCastradosVacinados');
            let animaisVacinados = null;
            if (Vacinados.value === 'true') {
                animaisVacinados = true;
            } else if (Vacinados.value === 'false') {
                animaisVacinados = false;
            }

            const data = {
                animalId: parseInt(idDoAnimal),
                usuarioId: idDoUsuario,
                nomeCompleto: document.getElementById('nomeCompleto').value,
                dataNascimento: document.getElementById('dataNascimento').value,
                endereco: document.getElementById('endereco').value,
                residenciaTipo: parseInt(document.getElementById('ResidenciaTipo').value),
                residenciaPropriedade: parseInt(document.getElementById('ResidenciaPropriedade').value),
                residenciaTemTelas: document.getElementById('ResidenciaTemTelas').value === 'true',
                acessoARua: document.getElementById('AcessoRua').value === 'true',
                concordanciaResidencia: document.getElementById('ConcordanciaResidencia').value === 'true',
                temOutrosAnimais: document.getElementById('TemOutrosAnimais').value === 'true',
                condicoesManterAnimal: document.getElementById('CondicoesManterAnimal').value === 'true',
                concordaTaxaColaborativa: document.getElementById('ConcordaTaxaColaborativa').value === 'true',
                concordaCastracaoVacinacao: document.getElementById('ConcordaCastracaoVacinacao').value === 'true',
                renda: parseFloat(document.getElementById('Renda').value),
                quaisOutrosAnimais: document.getElementById('QuaisOutrosAnimais').value || null,
                outrosAnimaisCastradosVacinados: animaisVacinados,
                telefone: document.getElementById('telefone').value,
                email: document.getElementById('email').value,
                fotos: fotosBase64,
                resposta: null
            };


            const API_URL = "https://localhost:7162/api";
            const response = await fetch(`${API_URL}/Forms/Register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Formulário enviado com sucesso!');
                form.reset();
            } else {
                const error = await response.json();
                console.error("Erro da API:", error);
                if (error.errors) {
                    let errorMsg = "Erros de validação:\n";
                    for (const key in error.errors) {
                        errorMsg += `- ${error.errors[key][0]}\n`;
                    }
                    alert(errorMsg);
                } else {
                    alert('Erro ao enviar formulário: ' + (error.title || error.message || JSON.stringify(error)));
                }
            }

        } catch (err) {
            console.error(err);
            alert(`Erro ao cadastrar formulário. Erro: ${err}`);
        }
        finally {
            botaoEnviar.disabled = false;
            botaoEnviar.textContent = "Enviar"; 
        }

    });
});