using System.ComponentModel.DataAnnotations;

namespace SiteAcapra.DTOs.Requests
{
    public class BreedRequest
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        public string Nome { get; set; }
    }
}
