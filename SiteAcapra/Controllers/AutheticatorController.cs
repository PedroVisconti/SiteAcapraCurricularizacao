using Microsoft.AspNetCore.Mvc;
using SiteAcapra.Data;
using SiteAcapra.DTOs;

namespace SiteAcapra.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AutheticatorController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AutheticatorController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Login([FromBody] LoginRequest dadosLogin)
        {
            if(Request == null || string.IsNullOrEmpty(dadosLogin.email) || string.IsNullOrEmpty(dadosLogin.senha))
            {
                return BadRequest("Email e senha são obrigatórios.");
            }

            var usuario = _context.Usuarios.FirstOrDefault(u => u.Email == dadosLogin.email);

            if (usuario == null)
            {
                return Unauthorized("Credenciais inválidas - Usuario não encontrado");
            }


            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> Register()
        {


            return Ok();
        }

    }
}
