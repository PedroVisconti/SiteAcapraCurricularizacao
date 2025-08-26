namespace SiteAcapra.Models
{
    public class Animal
    {
        public int AnimalId { get; set; }
        public string Nome { get; set; }
        public DateOnly DataNascimento { get; set; }
        public string Porte { get; set; }
        public string? DescricaoSaude { get; set; }
        public string? NecessidadesEspeciais { get; set; }
        public bool Adotado { get; set; }
        public DateTime? DataAdocao { get; set; }
        public bool Excluido { get; set; }
        public string? Descricao { get; set; }
        public DateTime DataCadastro { get; set; }
        public double? Peso { get; set; }
        public bool Castrado { get; set; }
        public int RacaId { get; set; }
        public Raca Raca { get; set; }
        public int EspecieId { get; set; }
        public Especie Especie { get; set; }
        public Guid TutorId { get; set; }
        public Tutor Tutor { get; set; }
        public ICollection<Foto> Fotos { get; set; } = new List<Foto>();
        public ICollection<AnimalVacina> AnimalVacinas { get; set; } = new List<AnimalVacina>();
        public ICollection<FormularioAdocao> FormulariosAdocao { get; set; } = new List<FormularioAdocao>();

    }
}
