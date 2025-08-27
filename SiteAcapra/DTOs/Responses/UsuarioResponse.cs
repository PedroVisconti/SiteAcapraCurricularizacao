using SiteAcapra.Models;

namespace SiteAcapra.DTOs.Responses
{
    public class UsuarioResponse
    {
        public Guid UsuarioId { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Cpf { get; set; }
        public string Telefone { get; set; }
        public string Endereco { get; set; }
        public DateOnly DataNascimento { get; set; }
        public char Sexo { get; set; }
        public bool Excluido { get; set; }
        public int TipoUsuarioId { get; set; }
    }
}
