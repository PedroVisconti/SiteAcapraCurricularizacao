using SiteAcapra.Models;

namespace SiteAcapra.DTOs.Responses
{
    public class FormsResponse
    {
        public int Id { get; set; } // O ID principal do formulário no banco
        public string Resposta { get; set; }
        public int Status { get; set; }
        public DateOnly DataPreenchimento { get; set; }
        public int AnimalId { get; set; }
        public Guid UsuarioId { get; set; }

        public string NomeCompleto { get; set; }
        public DateOnly DataNascimento { get; set; }
        public string Endereco { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public int ResidenciaTipo { get; set; }
        public int ResidenciaPropriedade { get; set; }
        public bool ResidenciaTemTelas { get; set; }
        public bool AcessoARua { get; set; }
        public bool ConcordanciaResidencia { get; set; }
        public bool TemOutrosAnimais { get; set; }
        public string? QuaisOutrosAnimais { get; set; }
        public bool? OutrosAnimaisCastradosVacinados { get; set; }
        public decimal Renda { get; set; }
        public bool CondicoesManterAnimal { get; set; }
        public bool ConcordaTaxaColaborativa { get; set; }
        public bool ConcordaCastracaoVacinacao { get; set; }

        public List<String> Fotos { get; set; }


    }
}
