using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SiteAcapra.Data;
using SiteAcapra.DTOs;
using SiteAcapra.DTOs.Responses;
using SiteAcapra.Models;
using System.Linq;

namespace SiteAcapra.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpeciesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        public SpeciesController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllEspecies()
        {
            try 
            {
                var listaEspecies = await _context.Especies.Where(e => e.Excluido == false).ToListAsync();

                var especiesDto = _mapper.Map<List<SpeciesResponse>>(listaEspecies);

                return Ok(especiesDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno do servidor: {ex.Message}");
            }
        }


        [HttpPost("Register")]
        public async Task<IActionResult> RegisterSpecie([FromBody] SpeciesRequest dadosRegistro)
        {
            try
            {
                var especieExistente = await _context.Especies.FirstOrDefaultAsync(e => e.Nome.ToLower() == dadosRegistro.Nome.ToLower());

                if (especieExistente != null)
                {

                    if (especieExistente.Excluido == true)
                    {
                        especieExistente.Excluido = false;
                        await _context.SaveChangesAsync();
                        return Ok("Espécie restaurada com sucesso.");
                    }

                    return Conflict("Já existe essa Especie cadastrada.");
                }
               
                    var novaEspecie = _mapper.Map<Especie>(dadosRegistro);

                    _context.Especies.Add(novaEspecie);
                    await _context.SaveChangesAsync();

                    return Ok("Espécie cadastrada com sucesso");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno do servidor: {ex.Message}");
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSpecie(int id) 
        {
            try
            {

                var especieExistente = await _context.Especies.FirstOrDefaultAsync(e => e.EspecieId == id);

                if (especieExistente == null)
                {
                    return NotFound("Especie não encontrada.");
                }

                var temAnimais = await _context.Animais.AnyAsync(a => a.EspecieId == id);

                if (temAnimais)
                {
                    return BadRequest("Não é possível excluir esta espécie, pois existem animais associados a ela.");
                }

                especieExistente.Excluido = true;

                await _context.SaveChangesAsync();

                return Ok("Especie excluida com sucesso");
            }
            catch (Exception ex) 
            {
                return StatusCode(500, $"Erro interno do servidor: {ex.Message}");

            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ChangeSpecie(int id, [FromBody] SpeciesRequest dadosAlterados) 
        {
            try
            {
                var especieExistente = await _context.Especies.FirstOrDefaultAsync(e => e.EspecieId == id);

                if (especieExistente == null)
                {
                    return NotFound("Espécie não encontrada.");
                }

                var nomeDuplicado = await _context.Especies.FirstOrDefaultAsync(e => e.Nome == dadosAlterados.Nome && e.EspecieId != id);

                if (nomeDuplicado != null)
                {
                    if (nomeDuplicado.Excluido == true)
                    {
                        nomeDuplicado.Excluido = false;
                        await _context.SaveChangesAsync();
                        return Ok("Não foi possível alterar o registro. Uma espécie com este nome já existia e foi reativada.");
                    }

                    return Conflict("Já existe uma espécie ativa com este nome.");
                }

                especieExistente.Nome = dadosAlterados.Nome;
                especieExistente.Excluido = false;

                await _context.SaveChangesAsync();

                return Ok("Nome da espécie alterado com sucesso.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno do servidor: {ex.Message}");
            }

        }

    }
}
