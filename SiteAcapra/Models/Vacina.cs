namespace SiteAcapra.Models
{
    public class Vacina
    {
        public int VacinaId { get; set; }
        public string Nome { get; set; }
        public bool Excluido { get; set; }
        public ICollection<AnimalVacina> AnimalVacinas { get; set; } = new List<AnimalVacina>();
    }
}
