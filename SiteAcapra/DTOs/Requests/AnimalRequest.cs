using SiteAcapra.DTOs.AnimalDTO;

namespace SiteAcapra.DTOs.Requests
{
    public class AnimalRequest
    {
        public string Nome { get; set; }
        public DateOnly DataNascimento { get; set; }
        public string Porte { get; set; }
        public string? DescricaoSaude { get; set; }
        public string? NecessidadesEspeciais { get; set; }
        public bool Adotado { get; set; }
        public DateTime? DataAdocao { get; set; }
        public string? Descricao { get; set; }
        public double? Peso { get; set; }
        public bool Castrado { get; set; }
        public int RacaId { get; set; }
        public int EspecieId { get; set; }
        public Guid? TutorId { get; set; }
        public List<FotoDTO> Fotos { get; set; } = new List<FotoDTO>();
        public List<AnimalVacinaDTO> AnimalVacinas { get; set; } = new List<AnimalVacinaDTO>();

    }
}
