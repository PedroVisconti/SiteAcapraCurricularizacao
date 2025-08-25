namespace SiteAcapra.Models
{
    public class TipoUsuario
    {
        public int TipoUsuarioId { get; set; }
        public string Nome { get; set; }
        public bool Excluido { get; set; }
        public ICollection<Usuario> Usuario { get; set; } = new List<Usuario>();
    }
}
