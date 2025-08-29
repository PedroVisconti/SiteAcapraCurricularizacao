using System.ComponentModel.DataAnnotations;

namespace SiteAcapra.Models
{
    public class FormularioAdocao
    {
        public int FormularioAdocaoId { get; set; }
        public string Resposta { get; set; }
        public int Status { get; set; } // 1 - Pendente | 2 - Aprovado | 3 - Rejeitado
        public DateOnly DataPreenchimento { get; set; }
        public bool Excluido { get; set; }
        public Guid UsuarioId { get; set; }
        public Usuario Usuario { get; set; }
        public int AnimalId { get; set; }
        public Animal Animal { get; set; }
        public ICollection<FotoDocumentos> FotosDocumentos { get; set; }

        // Dados Pessoais
        public string NomeCompleto { get; set; }
        public DateOnly DataNascimento { get; set; }
        public string Endereco { get; set; }


        // Dados da Residência e Outros Animais
        public int ResidenciaTipo { get; set; } // 1 - Casa | 2 - Apartamento
        public int ResidenciaPropriedade { get; set; } // 1 - Próprio | 2 - Alugado
        public bool ResidenciaTemTelas { get; set; }
        public bool AcessoARua { get; set; }
        public bool ConcordanciaResidencia { get; set; }
        public bool TemOutrosAnimais { get; set; }
        public string? QuaisOutrosAnimais { get; set; }
        public bool? OutrosAnimaisCastradosVacinados { get; set; }


        // Dados Financeiros e de Cuidado
        public decimal Renda { get; set; }
        public bool CondicoesManterAnimal { get; set; }
        public bool ConcordaTaxaColaborativa { get; set; }
        public bool ConcordaCastracaoVacinacao { get; set; }
    }
}
