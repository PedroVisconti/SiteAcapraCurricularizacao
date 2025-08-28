using AutoMapper;
using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using SiteAcapra.Data;
using SiteAcapra.DTOs.Requests;
using SiteAcapra.DTOs.Responses;
using SiteAcapra.Models;
using SiteAcapra.Services;

namespace SiteAcapra.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AutheticatorController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly JwtService _jwtService;

        public AutheticatorController(AppDbContext context, IMapper mapper, JwtService jwtService )
        {
            _context = context;
            _mapper = mapper;
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest dadosLogin)
        {
            try
            {
                if (Request == null || string.IsNullOrEmpty(dadosLogin.Email) || string.IsNullOrEmpty(dadosLogin.Senha))
                {
                    return BadRequest("Email e senha são obrigatórios.");
                }

                var usuario = _context.Usuarios.FirstOrDefault(u => u.Email == dadosLogin.Email);

                if (usuario == null)
                {
                    return Unauthorized("Credenciais inválidas - Usuario não encontrado");
                }

                if (BCrypt.Net.BCrypt.Verify(dadosLogin.Senha, usuario.Senha))
                {
                    return Unauthorized("Credenciais inválidas - Senha incorreta");
                }

                var usuarioResponse = _mapper.Map<UsuarioResponse>(usuario);

                var loginResponse = new LoginResponse
                {
                    Token = _jwtService.GerarToken(usuario.UsuarioId, usuario.Email, usuario.Senha),
                    Usuario = usuarioResponse
                };

                return Ok(loginResponse);
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
                return Conflict("Já existe um usuário cadastrado com esse E-mail.");
            }

            var usuarioExistenteCpf = _context.Usuarios.FirstOrDefault(u => u.Cpf == dadosRegistro.Cpf);
            if (usuarioExistenteCpf != null)
            {
                return Conflict("Já existe um usuário cadastrado com esse CPF.");
            }

            var usuario = _mapper.Map<Usuario>(dadosRegistro);

            usuario.TipoUsuarioId = 2;
            usuario.Senha = BCrypt.Net.BCrypt.HashPassword(dadosRegistro.Senha);

            _context.Usuarios.Add(usuario);

            await _context.SaveChangesAsync();

            return Ok("Usuário cadastrado com sucesso");
        }

    }
}
