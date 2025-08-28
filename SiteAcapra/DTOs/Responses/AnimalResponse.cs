using SiteAcapra.DTOs.AnimalDTO;

namespace SiteAcapra.DTOs.Responses
{
    public class AnimalResponse
    {
        public int AnimalId { get; set; }
        public string Nome { get; set; }
        public DateOnly DataNascimento { get; set; }
        public string Porte { get; set; }
        public string? DescricaoSaude { get; set; }
        public string? NecessidadesEspeciais { get; set; }
        public string? Descricao { get; set; }
        public DateTime DataCadastro { get; set; }
        public double? Peso { get; set; }
        public bool Castrado { get; set; }
        public RacaDTO Raca { get; set; }
        public EspecieDTO Especie { get; set; }
        public TutorDTO? Tutor { get; set; } // nullable caso não tenha tutor
        public List<FotoDTO> Fotos { get; set; } = new List<FotoDTO>();
        public List<AnimalVacinaDTO> AnimalVacinas { get; set; } = new List<AnimalVacinaDTO>();


    }
}
