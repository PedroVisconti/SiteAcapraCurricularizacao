namespace SiteAcapra.Models
{
    public class AnimalVacina
    {
        public int AnimalVacinaId { get; set; }
        public Vacina Vacina { get; set; }
        public int VacinaId {get; set;}
        public Animal Animal { get; set; }
        public int AnimalId { get; set;}

    }
}
