using System.ComponentModel.DataAnnotations;

namespace SiteAcapra.DTOs.Requests
{
    public class ResponseFormsRequest
    {

        [Required(ErrorMessage = "A resposta do administrador é obrigatória.")]
        [MinLength(5, ErrorMessage = "A resposta deve ter no mínimo 5 caracteres.")]
        public string Resposta { get; set; }

        [Required(ErrorMessage = "O Status é obrigatório.")]
        [Range(2, 3, ErrorMessage = "O Status deve ser 2 (Aprovado) ou 3 (Rejeitado).")]
        public int Status { get; set; }
    }
}

