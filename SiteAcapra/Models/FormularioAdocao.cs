namespace SiteAcapra.Models
{
    public class FormularioAdocao
    {
        public int FormularioAdocaoId { get; set; }
        public string Resposta { get; set; }
        public DateOnly DataPreenchimento { get; set; }
        public bool Excluido { get; set; }

        public Guid UsuarioId { get; set; }
        public Usuario Usuario { get; set; }

        public int AnimalId { get; set; }
        public Animal Animal { get; set; }

    }
}
