using SiteAcapra.Models;

namespace SiteAcapra.DTOs.Responses
{
    public class TutorResponse
    {
        public Guid TutorId { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public string Endereco { get; set; }
        public string Cpf { get; set; }
        public DateTime DataCadastro { get; set; }
        public DateOnly DataNascimento { get; set; }
        public char? Sexo { get; set; }
    }
}
