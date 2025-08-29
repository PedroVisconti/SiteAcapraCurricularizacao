namespace SiteAcapra.Models
{
    public class FotoDocumentos
    {
        public Guid FotoId { get; set; }
        public string FotoHash { get; set; }
        public bool Excluido { get; set; }
        public int FormularioId { get; set; }
        public FormularioAdocao Formulario { get; set; }
    }
}
