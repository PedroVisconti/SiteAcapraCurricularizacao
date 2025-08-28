using System.ComponentModel.DataAnnotations;

namespace SiteAcapra.DTOs
{
    public class SpeciesRequest
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        public string Nome { get; set; }
    }
}
