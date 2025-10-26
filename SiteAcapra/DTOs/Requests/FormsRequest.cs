using System;
using System.ComponentModel.DataAnnotations;

namespace SiteAcapra.DTOs.Requests
{
    public class FormsRequest
    {
        public string? Resposta { get; set; }
        public int Status { get; set; }
        public DateOnly DataPreenchimento { get; }
        public bool Excluido { get; } = false;
        public int AnimalId { get; set; }
        public Guid UsuarioId { get; set; }

        [Required(ErrorMessage = "Nome é obrigatório")]
        public string NomeCompleto { get; set; }
        [Required(ErrorMessage = "Data de Nascimento é obrigatório")]
        public DateOnly DataNascimento { get; set; }
        [Required(ErrorMessage = "Endereço é obrigatório")]
        public string Endereco { get; set; }

        [Required(ErrorMessage = "Tipo de Residência é obrigatório")]
        public int ResidenciaTipo { get; set; }
        [Required(ErrorMessage = "Propriedade da Residência é obrigatório")]
        public int ResidenciaPropriedade { get; set; }
        [Required(ErrorMessage = "Informar se a residência tem telas é obrigatório")]
        public bool ResidenciaTemTelas { get; set; }
        [Required(ErrorMessage = "Informar se há acesso à rua é obrigatório")]
        public bool AcessoARua { get; set; }
        [Required(ErrorMessage = "Concordância com a residência é obrigatório")]
        public bool ConcordanciaResidencia { get; set; }
        [Required(ErrorMessage = "Informar se tem outros animais é obrigatório")]
        public bool TemOutrosAnimais { get; set; }
        public string? QuaisOutrosAnimais { get; set; }
        public bool? OutrosAnimaisCastradosVacinados { get; set; }
        public string Email { get;set; }
        public string Telefone { get; set; }

        [Required(ErrorMessage = "Renda é obrigatório")]
        public decimal Renda { get; set; }
        [Required(ErrorMessage = "Condições para manter o animal é obrigatório")]
        public bool CondicoesManterAnimal { get; set; }
        [Required(ErrorMessage = "Concordância com a taxa colaborativa é obrigatório")]
        public bool ConcordaTaxaColaborativa { get; set; }
        [Required(ErrorMessage = "Concordância com castração e vacinação é obrigatório")]
        public bool ConcordaCastracaoVacinacao { get; set; }
        public List<String> Fotos { get; set; }

    }
}
