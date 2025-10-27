const API_URL = "https://localhost:7162/api";

async function fetchJSON(url, options = {}) {
    const res = await fetch(url, options);
    if (res.status === 204) return null; 
    if (!res.ok) throw new Error(`Erro: ${res.status} ${res.statusText}`);
    return res.json();
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = err => reject(err);
    });
}

async function loadAnimals() {
    try {
        const animals = await fetchJSON(`${API_URL}/Animal`);
        const mapped = animals.map(a => ({
            id: a.animalId,
            nome: a.nome,
            especie: a.especie?.nome || "-",
            raca: a.raca?.nome || "-",
            porte: a.porte || "-",
            dataNascimento: a.dataNascimento,
            tutor: a.tutor?.nome || "-",
            castrado: a.castrado,
            adotado: a.adotado === 1 || a.adotado === true,
            fotos: a.fotos || []
        }));

        const columns = [
            { label: 'Nome', field: 'nome' },
            { label: 'Espécie', field: 'especie' },
            { label: 'Raça', field: 'raca' },
            { label: 'Porte', field: 'porte' },
            { label: 'Idade', field: 'dataNascimento', format: v => `${Utils.calculateAge(v)} anos` },
            { label: 'Tutor', field: 'tutor' },
            { label: 'Castrado', field: 'castrado', format: v => v ? 'Sim' : 'Não' },
            { label: 'Adotado', field: 'adotado', format: v => v ? 'Sim' : 'Não' }
        ];

        const actions = [
            { label: 'Editar', type: 'warning', onclick: 'editAnimal' },
            { label: 'Excluir', type: 'danger', onclick: 'deleteAnimal' },
            { label: 'Adotar', type: 'success', onclick: 'markAsAdopted' }
        ];

        TableManager.renderTable('animal-list-container', mapped, columns, actions);
    } catch (error) {
        Utils.showAlert("Erro ao carregar animais: " + error.message, "error");
    }
}

async function openAnimalModal(animalId = null) {
    const modalTitle = document.getElementById('animalModalTitle');
    const animalForm = document.getElementById('animalForm');
    animalForm.reset();
    document.getElementById('animalId').value = "";
    document.getElementById('fotosContainer').innerHTML = "";
    document.getElementById('racaAnimal').innerHTML = '<option value="">Selecione a Raça</option>';

    await loadEspeciesForAnimalForm();
    await loadTutoresForAnimalForm();

    if (animalId) {
        modalTitle.textContent = 'Editar Animal';
        try {
            const animal = await fetchJSON(`${API_URL}/Animal/${animalId}`);

            document.getElementById('animalId').value = animal.animalId;
            document.getElementById('nomeAnimal').value = animal.nome || "";
            document.getElementById('dataNascimentoAnimal').value = animal.dataNascimento?.split('T')[0] || "";
            document.getElementById('porteAnimal').value = animal.porte || "";
            document.getElementById('pesoAnimal').value = animal.peso || 0;
            document.getElementById('descricaoSaudeAnimal').value = animal.descricaoSaude || "";
            document.getElementById('necessidadesEspeciaisAnimal').value = animal.necessidadesEspeciais || "";
            document.getElementById('descricaoAnimal').value = animal.descricao || "";

            if (animal.especie?.especieId) {
                document.getElementById('especieAnimal').value = animal.especie.especieId;
                await loadRacasForAnimalForm(animal.especie.especieId);
                if (animal.raca?.racaId) {
                    document.getElementById('racaAnimal').value = animal.raca.racaId;
                }
            }

            if (animal.tutor?.tutorId) {
                document.getElementById('tutorAnimal').value = animal.tutor.tutorId;
            }

            await loadVacinasForAnimalForm(animal.animalVacinas || []);

            const fotosContainer = document.getElementById('fotosContainer');
            if (animal.fotos?.length > 0) {
                animal.fotos.forEach(f => {
                    const img = document.createElement('img');
                    img.src = f.fotoHash;
                    img.className = "animal-thumb";
                    img.style.width = "80px";
                    img.style.height = "80px";
                    img.style.marginRight = "5px";
                    fotosContainer.appendChild(img);
                });
            }

        } catch (error) {
            Utils.showAlert("Erro ao carregar dados do animal: " + error.message, "error");
        }
    } else {
        modalTitle.textContent = 'Adicionar Novo Animal';
        await loadVacinasForAnimalForm();
    }

    ModalManager.show('animalModal');
}

function closeAnimalModal() {
    ModalManager.hide('animalModal');
}

document.getElementById('animalForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = {
        id: document.getElementById('animalId').value,
        nome: document.getElementById('nomeAnimal').value,
        dataNascimento: document.getElementById('dataNascimentoAnimal').value,
        porte: document.getElementById('porteAnimal').value,
        peso: parseFloat(document.getElementById('pesoAnimal').value) || 0,
        descricaoSaude: document.getElementById('descricaoSaudeAnimal').value,
        necessidadesEspeciais: document.getElementById('necessidadesEspeciaisAnimal').value,
        descricao: document.getElementById('descricaoAnimal').value,
        especieId: parseInt(document.getElementById('especieAnimal').value),
        racaId: parseInt(document.getElementById('racaAnimal').value),
        tutorId: document.getElementById('tutorAnimal').value,
        fotos: [],
        animalVacinas: []
    };

    const arquivos = document.getElementById('fotosAnimal').files;
    for (let i = 0; i < arquivos.length; i++) {
        const base64 = await fileToBase64(arquivos[i]);
        formData.fotos.push({ fotoHash: base64 });
    }


    formData.animalVacinas = Array.from(document.querySelectorAll('#vacinasContainer input[type="checkbox"]:checked'))
        .map(cb => ({
            vacinaId: parseInt(cb.value),
            nome: cb.nextSibling.textContent,
            dataVacina: new Date().toISOString()
        }));

    const method = formData.id ? "PUT" : "POST";
    const url = formData.id ? `${API_URL}/Animal/${formData.id}` : `${API_URL}/Animal`;

    try {
        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        Utils.showAlert(formData.id ? "Animal atualizado com sucesso!" : "Animal adicionado com sucesso!", "success");
        closeAnimalModal();
        loadAnimals();
    } catch (error) {
        Utils.showAlert("Erro ao salvar animal: " + error.message, "error");
    }
});


function editAnimal(id) {
    openAnimalModal(id);
}

async function deleteAnimal(id) {
    if (!confirm("Tem certeza que deseja excluir este animal?")) return;

    try {
        await fetch(`${API_URL}/Animal/${id}`, { method: "DELETE" });
        Utils.showAlert("Animal excluído com sucesso!", "success");
        loadAnimals();
    } catch (error) {
        Utils.showAlert("Erro ao excluir animal: " + error.message, "error");
    }
}

async function loadEspeciesForAnimalForm() {
    const select = document.getElementById('especieAnimal');
    select.innerHTML = '<option value="">Selecione a Espécie</option>';
    try {
        const especies = await fetchJSON(`${API_URL}/Species`);
        especies.forEach(e => {
            const opt = document.createElement('option');
            opt.value = e.id || e.especieId;
            opt.textContent = e.nome;
            select.appendChild(opt);
        });
        return especies;
    } catch {
        Utils.showAlert("Erro ao carregar espécies.", "error");
        return [];
    }
}

async function loadRacasForAnimalForm(especieId = null) {
    const select = document.getElementById('racaAnimal');
    select.innerHTML = '<option value="">Selecione a Raça</option>';

    const currentEspecieId = especieId || document.getElementById('especieAnimal').value;
    if (!currentEspecieId) return;

    const url = `${API_URL}/Breed${currentEspecieId ? `?especieId=${currentEspecieId}` : ''}`;

    try {
        const racas = await fetchJSON(url);
        racas.forEach(r => {
            const opt = document.createElement('option');
            opt.value = r.id || r.racaId;
            opt.textContent = r.nome;
            select.appendChild(opt);
        });
        return racas;
    } catch {
        Utils.showAlert("Erro ao carregar raças (verifique se a API suporta filtro por espécie).", "warning");
        return [];
    }
}

async function loadTutoresForAnimalForm() {
    const select = document.getElementById('tutorAnimal');
    select.innerHTML = '<option value="">Selecione o Tutor</option>';
    try {
        const tutores = await fetchJSON(`${API_URL}/Tutor`);
        tutores.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.tutorId;
            opt.textContent = t.nome;
            select.appendChild(opt);
        });
        return tutores;
    } catch {
        Utils.showAlert("Erro ao carregar tutores.", "error");
        return [];
    }
}

async function markAsAdopted(id) {
    if (!confirm("Deseja marcar este animal como adotado?")) return;

    try {
        const res = await fetch(`${API_URL}/Animal/adocao/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" }
        });

        if (!res.ok) throw new Error(`Erro: ${res.status} ${res.statusText}`);
        const data = await res.json();
        Utils.showAlert(data.message || "Status de adoção atualizado com sucesso!", "success");
        loadAnimals();
    } catch (error) {
        Utils.showAlert("Erro ao atualizar status de adoção: " + error.message, "error");
    }
}

async function loadVacinasForAnimalForm(selectedVacinas = []) {
    const container = document.getElementById('vacinasContainer');
    container.innerHTML = '';
    try {
        const vacinas = await fetchJSON(`${API_URL}/Vacina`);
        vacinas.forEach(v => {
            const wrapper = document.createElement('div');
            wrapper.className = 'checkbox-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `vacina_${v.vacinaId}`;
            checkbox.value = v.vacinaId;
            checkbox.name = 'vacinas';
            if (selectedVacinas.some(sv => sv.vacinaId == v.vacinaId)) {
                checkbox.checked = true;
            }

            const label = document.createElement('label');
            label.htmlFor = `vacina_${v.vacinaId}`;
            label.textContent = v.nome;

            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);

            container.appendChild(wrapper);
        });
    } catch {
        Utils.showAlert("Erro ao carregar vacinas.", "error");
    }
}
