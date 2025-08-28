using System.ComponentModel.DataAnnotations;

namespace SiteAcapra.DTOs.Requests
{
    public class LoginRequest
    {
        public string Email { get; set; }
        public string Senha { get; set; }
    }
}
