document.addEventListener("DOMContentLoaded", function() {
    // Lógica para controlar a exibição dos campos de outros animais
    const temOutrosAnimaisSelect = document.getElementById('TemOutrosAnimais');
    const quaisOutrosAnimaisGroup = document.getElementById('quais-outros-animais-group');
    const animaisCastradosVacinadosGroup = document.getElementById('animais-castrados-vacinados-group');

    temOutrosAnimaisSelect.addEventListener('change', function() {
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

    // Garante que o estado inicial do formulário está correto ao carregar a página
    temOutrosAnimaisSelect.dispatchEvent(new Event('change'));
});