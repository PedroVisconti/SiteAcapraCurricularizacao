using Microsoft.AspNetCore.Mvc;
using SiteAcapra.Data;
using SiteAcapra.DTOs;
using SiteAcapra.Models;

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
        public async Task<IActionResult> Register([FromBody] RegisterRequest dadosRegistro)
        {
            var usuarioExistenteEmail = _context.Usuarios.FirstOrDefault(u => u.Email == dadosRegistro.Email);
            if (usuarioExistenteEmail != null)
            {
                return Conflict("Já existe um usuário cadastrado com esse E-mail.");
            }

            var usuarioExistenteCpf = _context.Usuarios.FirstOrDefault(u => u.Cpf == dadosRegistro.Cpf);
            if (usuarioExistenteCpf != null)
            {
                return Conflict("Já existe um usuário cadastrado com esse CPF.");
            }

            /* 
             * string senhaCriptografada = BCrypt.Net.BCrypt.HashPassword(dadosRegistro.Senha); 
             * Verificar com o pedro qual o tipo de criptografica que ele quer
             */

            var usuario = new Usuario
            {
                UsuarioId = Guid.NewGuid(),
                Nome = dadosRegistro.Nome,
                Email = dadosRegistro.Email,
                Senha = dadosRegistro.Senha,
                Cpf = dadosRegistro.Cpf,
                Telefone = dadosRegistro.Telefone,
                Endereco = dadosRegistro.Endereco,
                DataNascimento = dadosRegistro.DataNascimento,
                Sexo = dadosRegistro.Sexo,
                Excluido = false,
                TipoUsuarioId = 2
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();
            return Ok("Usuário cadastrado com sucesso");
        }

    }
}
