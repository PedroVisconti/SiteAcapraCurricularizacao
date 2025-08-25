namespace SiteAcapra.Models
{
    public class Raca
    {
        public int RacaId { get; set; }
        public string Nome { get; set; }
        public bool Excluido { get; set; }
        public ICollection<Animal> Animais { get; set; } = new List<Animal>();
    }
}
