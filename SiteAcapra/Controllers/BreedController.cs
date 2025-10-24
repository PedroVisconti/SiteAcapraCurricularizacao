using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SiteAcapra.Data;
using SiteAcapra.DTOs.Requests;
using SiteAcapra.DTOs.Responses;

namespace SiteAcapra.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BreedController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public BreedController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBreeds()
        {
            try
            {
                var listaRacas = await _context.Racas.Where(r => r.Excluido == false).ToListAsync();
                var racasDto = _mapper.Map<List<BreedResponse>>(listaRacas);
                return Ok(racasDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno do servidor: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BreedResponse>> ObterRacaPorId(int id)
        {
            var raca = await _context.Racas.FirstOrDefaultAsync(v => v.RacaId == id & v.Excluido == false);
            if (raca == null)
            {
                return NotFound("Raca não encontrada");
            }

            var vacinaResponse = _mapper.Map<BreedResponse>(raca);
            return Ok(vacinaResponse);
        }

        [HttpPost("Register")]
        public async Task<IActionResult> RegisterBreeds([FromBody] BreedRequest dadosRegistro)
        {
            try {
                var racaExistente = await _context.Racas.FirstOrDefaultAsync(r => r.Nome.ToLower() == dadosRegistro.Nome.ToLower());
                if (racaExistente != null)
                {
                    if (racaExistente.Excluido == true)
                    {
                        racaExistente.Excluido = false;
                        await _context.SaveChangesAsync();
                        return Ok("Raça restaurada com sucesso.");
                    }
                    return BadRequest("Já existe uma raça com esse nome.");
                }
                var novaRaca = _mapper.Map<Models.Raca>(dadosRegistro);
                _context.Racas.Add(novaRaca);
                await _context.SaveChangesAsync();
                return Ok("Raça cadastrada com sucesso.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno do servidor: {ex.Message}");
            }

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ChangeBreed(int id, [FromBody] BreedResponse dadosAlterados)
        {
            try
            {
                var racaExistente = await _context.Racas.FirstOrDefaultAsync(r => r.RacaId == id && r.Excluido == false);
                if (racaExistente == null)
                {
                    return NotFound("Raça não encontrada.");
                }

                var nomeDuplicado = await _context.Racas.FirstOrDefaultAsync(r => r.Nome == dadosAlterados.Nome && r.RacaId != id);
                if (nomeDuplicado != null)
                {
                    if (nomeDuplicado.Excluido == true)
                    {
                        nomeDuplicado.Excluido = false;
                        await _context.SaveChangesAsync();
                        return Ok("Raça restaurada com sucesso.");
                    }

                    return Conflict("Já existe uma espécie ativa com este nome.");
                }

                racaExistente.Nome = dadosAlterados.Nome;
                racaExistente.Excluido = false;
                await _context.SaveChangesAsync();
                return Ok("Raça alterada com sucesso.");

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno do servidor: {ex.Message}");

            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBreed(int id)
        {
            try
            {
                var racaExistente = await _context.Racas.FirstOrDefaultAsync(r => r.RacaId == id && r.Excluido == false);

                if (racaExistente == null)
                {
                    return NotFound("Raça não encontrada.");
                }

                var temAnimaisAtivos = await _context.Animais.AnyAsync(a => a.RacaId == id && a.Excluido == false);

                if (temAnimaisAtivos)
                {
                    return BadRequest("Não é possível excluir esta raça, pois existem animais associados a ela.");
                }
                racaExistente.Excluido = true;
                await _context.SaveChangesAsync();
                return Ok("Raça excluída com sucesso.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno do servidor: {ex.Message}");
            }
        }

    }
}
