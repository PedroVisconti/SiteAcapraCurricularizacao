using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SiteAcapra.Data;
using SiteAcapra.DTOs.Requests;
using SiteAcapra.DTOs.Responses;
using SiteAcapra.Models;

namespace SiteAcapra.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AutheticatorController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public AutheticatorController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest dadosLogin)
        {
            try
            {   
                if (Request == null || string.IsNullOrEmpty(dadosLogin.Email) || string.IsNullOrEmpty(dadosLogin.Senha))
                {
                    return BadRequest("Email e senha s�o obrigat�rios.");
                }

                var usuario = _context.Usuarios.FirstOrDefault(u => u.Email == dadosLogin.Email);

                if (usuario == null)
                {
                    return Unauthorized("Credenciais inv�lidas - Usuario n�o encontrado");
                }

                var usuarioResponse = _mapper.Map<UsuarioResponse>(usuario);

                return Ok(usuarioResponse);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno do servidor: {ex.Message}");
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest dadosRegistro)
        {
            var usuarioExistenteEmail = _context.Usuarios.FirstOrDefault(u => u.Email == dadosRegistro.Email);
            if (usuarioExistenteEmail != null)
            {
                return Conflict("J� existe um usu�rio cadastrado com esse E-mail.");
            }

            var usuarioExistenteCpf = _context.Usuarios.FirstOrDefault(u => u.Cpf == dadosRegistro.Cpf);
            if (usuarioExistenteCpf != null)
            {
                return Conflict("J� existe um usu�rio cadastrado com esse CPF.");
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
            return Ok("Usu�rio cadastrado com sucesso");
        }

    }
}
