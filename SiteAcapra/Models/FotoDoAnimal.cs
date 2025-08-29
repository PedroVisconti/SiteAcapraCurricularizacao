namespace SiteAcapra.Models
{
    public class FotoDoAnimal
    {
        public Guid FotoId { get; set; }
        public string FotoHash {  get; set; }
        public bool Excluido { get; set; }
        public int AnimalId { get; set; }
        public Animal Animal { get; set; }
    }
}
