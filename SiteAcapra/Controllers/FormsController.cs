using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SiteAcapra.Data;
using SiteAcapra.DTOs.Requests;
using SiteAcapra.DTOs.Responses;
using SiteAcapra.Models;

namespace SiteAcapra.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FormsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public FormsController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> CriarFormulario([FromBody] FormsRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try // <-- ADICIONE O 'try'
            {
                var formulario = _mapper.Map<FormularioAdocao>(request);

                _context.FormularioAdocoes.Add(formulario);
                await _context.SaveChangesAsync(); // <-- O ERRO PROVAVELMENTE ACONTECE AQUI

                return Ok(new { mensagem = "Formulário enviado com sucesso!" });
            }
            catch (Exception ex) // <-- ADICIONE O 'catch'
            {
                // Isso captura o erro do banco de dados (ex: "FOREIGN KEY constraint failed")
                // e o envia de volta como um JSON legível.
                return StatusCode(500, new
                {
                    message = "Erro interno do servidor. Verifique o InnerException.",
                    error = ex.Message,
                    innerError = ex.InnerException?.Message // <-- A MENSAGEM MAIS IMPORTANTE
                });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetTodosFormularios()
        {
            var formulariosDoBanco = await _context.FormularioAdocoes
                                         .Where(f => !f.Excluido)
                                         .ToListAsync();
            var formulariosResponse = _mapper.Map<List<FormsResponse>>(formulariosDoBanco);
            return Ok(formulariosResponse);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFormularioPorId(int id)
        {
            var formularioDoBanco = await _context.FormularioAdocoes
                                        .Include(f => f.FotosDocumentos)
                                        .FirstOrDefaultAsync(f => f.FormularioAdocaoId == id && !f.Excluido);

            if (formularioDoBanco == null)
            {
                return NotFound();
            }

            var formularioResponse = _mapper.Map<FormsResponse>(formularioDoBanco);

            return Ok(formularioResponse);
        }

        [HttpGet("usuario/{usuarioId}")]
        public async Task<IActionResult> GetFormularioPorUsuario(Guid usuarioId) 
        {
            var formulariosDoUsuario = await _context.FormularioAdocoes
                            .Include(f => f.FotosDocumentos)
                            .Where(f => f.UsuarioId == usuarioId && !f.Excluido)
                            .ToListAsync();
            var formulariosResponse = _mapper.Map<List<FormsResponse>>(formulariosDoUsuario);

            return Ok(formulariosResponse);
        }

        [HttpPut("responderFormulario/{id}")]
        public async Task<IActionResult> ResponderFormulario(int id, [FromBody] ResponseFormsRequest respostaRequest)
        {
            var formularioDoBanco = await _context.FormularioAdocoes
                                        .FirstOrDefaultAsync(f => f.FormularioAdocaoId == id);

            if (formularioDoBanco == null || formularioDoBanco.Excluido)
            {
                return NotFound(new { message = "Formulário não encontrado." });
            }

            if (formularioDoBanco.Status != 1)
            {
                return BadRequest(new { message = "Este formulário já foi respondido anteriormente." });
            }

            formularioDoBanco.Status = respostaRequest.Status;
            formularioDoBanco.Resposta = respostaRequest.Resposta;

            await _context.SaveChangesAsync();
            return Ok("Formulario respondido com sucesso");
        }
    }
}
