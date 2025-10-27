const usuario = JSON.parse(localStorage.getItem("usuario"));
const token = localStorage.getItem("token");

if (!usuario) {
    // Não está logado, redireciona para login
    window.location.href = "/login.html";
}
// Simulação de dados (localStorage como "banco de dados")
class DataManager {
    constructor() {
        this.initializeData();
    }

    initializeData() {
        // Inicializar dados se não existirem
        if (!localStorage.getItem('especies')) {
            localStorage.setItem('especies', JSON.stringify([
                { id: 1, nome: 'Cão', descricao: 'Canis lupus familiaris' },
                { id: 2, nome: 'Gato', descricao: 'Felis catus' },
                { id: 3, nome: 'Coelho', descricao: 'Oryctolagus cuniculus' }
            ]));
        }

        if (!localStorage.getItem('racas')) {
            localStorage.setItem('racas', JSON.stringify([
                { id: 1, nome: 'Labrador', especieId: 1 },
                { id: 2, nome: 'Golden Retriever', especieId: 1 },
                { id: 3, nome: 'Poodle', especieId: 1 },
                { id: 4, nome: 'Siamês', especieId: 2 },
                { id: 5, nome: 'Persa', especieId: 2 },
                { id: 6, nome: 'Maine Coon', especieId: 2 },
                { id: 7, nome: 'Angorá', especieId: 3 },
                { id: 8, nome: 'Mini Lop', especieId: 3 }
            ]));
        }

        if (!localStorage.getItem('tutores')) {
            localStorage.setItem('tutores', JSON.stringify([
                {
                    id: '1',
                    nome: 'João Silva',
                    email: 'joao@email.com',
                    telefone: '(11) 99999-9999',
                    endereco: 'Rua das Flores, 123, São Paulo, SP',
                    cpf: '123.456.789-00',
                    dataNascimento: '1985-05-15',
                    sexo: 'M',
                    dataCadastro: new Date().toISOString()
                },
                {
                    id: '2',
                    nome: 'Maria Santos',
                    email: 'maria@email.com',
                    telefone: '(11) 88888-8888',
                    endereco: 'Av. Paulista, 456, São Paulo, SP',
                    cpf: '987.654.321-00',
                    dataNascimento: '1990-08-22',
                    sexo: 'F',
                    dataCadastro: new Date().toISOString()
                }
            ]));
        }

        if (!localStorage.getItem('vacinas')) {
            localStorage.setItem('vacinas', JSON.stringify([
                { id: 1, nome: 'V8', descricao: 'Vacina óctupla para cães' },
                { id: 2, nome: 'V10', descricao: 'Vacina déctupla para cães' },
                { id: 3, nome: 'Antirrábica', descricao: 'Vacina contra raiva' },
                { id: 4, nome: 'Tríplice Felina', descricao: 'Vacina tríplice para gatos' },
                { id: 5, nome: 'Quíntupla Felina', descricao: 'Vacina quíntupla para gatos' }
            ]));
        }

        if (!localStorage.getItem('animais')) {
            localStorage.setItem('animais', JSON.stringify([
                {
                    id: 1,
                    nome: 'Rex',
                    dataNascimento: '2020-03-15',
                    porte: 'Grande',
                    descricaoSaude: 'Animal saudável, sem problemas conhecidos',
                    necessidadesEspeciais: '',
                    adotado: false,
                    dataAdocao: null,
                    excluido: false,
                    descricao: 'Cão muito dócil e brincalhão',
                    dataCadastro: new Date().toISOString(),
                    peso: 25.5,
                    castrado: true,
                    racaId: 1,
                    especieId: 1,
                    tutorId: '1'
                },
                {
                    id: 2,
                    nome: 'Mimi',
                    dataNascimento: '2021-07-10',
                    porte: 'Pequeno',
                    descricaoSaude: 'Animal saudável',
                    necessidadesEspeciais: '',
                    adotado: true,
                    dataAdocao: '2023-01-15',
                    excluido: false,
                    descricao: 'Gata carinhosa e independente',
                    dataCadastro: new Date().toISOString(),
                    peso: 3.2,
                    castrado: true,
                    racaId: 4,
                    especieId: 2,
                    tutorId: '2'
                }
            ]));
        }
    }

    // Métodos genéricos para CRUD
    getAll(entity) {
        return JSON.parse(localStorage.getItem(entity) || '[]');
    }

    getById(entity, id) {
        const items = this.getAll(entity);
        return items.find(item => item.id == id);
    }

    create(entity, data) {
        const items = this.getAll(entity);
        const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
        const newItem = { ...data, id: newId, dataCadastro: new Date().toISOString() };
        items.push(newItem);
        localStorage.setItem(entity, JSON.stringify(items));
        return newItem;
    }

    update(entity, id, data) {
        const items = this.getAll(entity);
        const index = items.findIndex(item => item.id == id);
        if (index !== -1) {
            items[index] = { ...items[index], ...data };
            localStorage.setItem(entity, JSON.stringify(items));
            return items[index];
        }
        return null;
    }

    delete(entity, id) {
        const items = this.getAll(entity);
        const filteredItems = items.filter(item => item.id != id);
        localStorage.setItem(entity, JSON.stringify(filteredItems));
        return true;
    }

    // Métodos específicos
    getRacasByEspecie(especieId) {
        const racas = this.getAll('racas');
        return racas.filter(raca => raca.especieId == especieId);
    }

    getAnimalWithRelations(id) {
        const animal = this.getById('animais', id);
        if (!animal) return null;

        const raca = this.getById('racas', animal.racaId);
        const especie = this.getById('especies', animal.especieId);
        const tutor = this.getById('tutores', animal.tutorId);

        return {
            ...animal,
            raca: raca?.nome || 'N/A',
            especie: especie?.nome || 'N/A',
            tutor: tutor?.nome || 'N/A'
        };
    }

    getAllAnimalsWithRelations() {
        const animais = this.getAll('animais');
        return animais.map(animal => this.getAnimalWithRelations(animal.id));
    }
}

// Instância global do gerenciador de dados
const dataManager = new DataManager();

// Utilitários
class Utils {
    static formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    static formatCPF(cpf) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    static formatPhone(phone) {
        return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    }

    static calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }

    static showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        const container = document.querySelector('.container');
        container.insertBefore(alertDiv, container.firstChild);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    static showLoading(show = true) {
        let overlay = document.querySelector('.loading-overlay');
        
        if (show) {
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'loading-overlay';
                overlay.innerHTML = '<div class="loading loading-large"></div>';
                document.body.appendChild(overlay);
            }
        } else {
            if (overlay) {
                overlay.remove();
            }
        }
    }

    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static validateCPF(cpf) {
        const cleanCPF = cpf.replace(/\D/g, '');
        if (cleanCPF.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
        return true;
    }

    static validatePhone(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 10 && cleanPhone.length <= 11;
    }
}

// Modal Manager
class ModalManager {
    static show(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    static hide(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }

    static hideAll() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('show');
        });
        document.body.style.overflow = 'auto';
    }
}

// Form Manager
class FormManager {
    static getFormData(formElement) {
        const formData = new FormData(formElement);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            if (formElement.querySelector(`[name="${key}"]`).type === 'checkbox') {
                data[key] = formElement.querySelector(`[name="${key}"]`).checked;
            } else {
                data[key] = value;
            }
        }
        
        return data;
    }

    static populateForm(formElement, data) {
        Object.keys(data).forEach(key => {
            const field = formElement.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = data[key];
                } else {
                    field.value = data[key] || '';
                }
            }
        });
    }

    static clearForm(formElement) {
        formElement.reset();
    }

    static validateForm(formElement) {
        const requiredFields = formElement.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#dc3545';
                isValid = false;
            } else {
                field.style.borderColor = '#e1e1e1';
            }
        });
        
        return isValid;
    }
}

// Table Manager
class TableManager {
    static renderTable(containerId, data, columns, actions = []) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let html = `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            ${columns.map(col => `<th>${col.label}</th>`).join('')}
                            ${actions.length > 0 ? '<th>Ações</th>' : ''}
                        </tr>
                    </thead>
                    <tbody>
        `;

        data.forEach(item => {
            html += '<tr>';
            columns.forEach(col => {
                let value = item[col.field];
                if (col.format) {
                    value = col.format(value, item);
                }
                html += `<td>${value || 'N/A'}</td>`;
            });

            if (actions.length > 0) {
                html += '<td><div class="btn-group">';
                actions.forEach(action => {
                    html += `<button class="btn btn-${action.type}" onclick="${action.onclick}(${item.id})">${action.label}</button>`;
                });
                html += '</div></td>';
            }
            html += '</tr>';
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;
    }
}

// Navegação
function navigateTo(page) {
    window.location.href = page;
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Fechar modais ao clicar fora
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            ModalManager.hideAll();
        }
    });

    // Fechar modais com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            ModalManager.hideAll();
        }
    });

    // Marcar link ativo na navegação
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

