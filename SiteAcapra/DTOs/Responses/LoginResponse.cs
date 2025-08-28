namespace SiteAcapra.DTOs.Responses
{
    public class LoginResponse
    {
        public UsuarioResponse Usuario { get; set; }
        public string Token { get; set; }
    }
}
