using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SiteAcapra.Data;
using SiteAcapra.DTOs.Requests;
using SiteAcapra.DTOs.Responses;
using SiteAcapra.Models;
using SiteAcapra.Services;

namespace SiteAcapra.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnimalController : Controller
    {

        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public AnimalController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<AnimalResponse>>> ListarAnimais()
        {
            var animais = await _context.Animais
                .Include(a => a.Raca)
                .Include(a => a.Especie)
                .Include(a => a.Tutor)
                .Include(a => a.Fotos)
                .Include(a => a.AnimalVacinas)
                    .ThenInclude(av => av.Vacina)
                .Where(e => e.Excluido == false)
                .ToListAsync();

            var animalReponse = _mapper.Map<List<AnimalResponse>>(animais);

            return Ok(animalReponse);
        }

        [HttpGet("adocao")]
        public async Task<ActionResult<List<AnimalResponse>>> ListarAnimaisAdocao()
        {
            var animais = await _context.Animais
                .Include(a => a.Raca)
                .Include(a => a.Especie)
                .Include(a => a.Tutor)
                .Include(a => a.Fotos)
                .Include(a => a.AnimalVacinas)
                    .ThenInclude(av => av.Vacina)
                .Where(e => e.Excluido == false && e.Adotado == false)
                .ToListAsync();

            var animalReponse = _mapper.Map<List<AnimalResponse>>(animais);

            return Ok(animalReponse);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AnimalResponse>> ObterAnimalPorId(int id)
        {
            var animal = await _context.Animais
                .Include(a => a.Raca)
                .Include(a => a.Especie)
                .Include(a => a.Tutor)
                .Include(a => a.Fotos)
                .Include(a => a.AnimalVacinas)
                    .ThenInclude(av => av.Vacina)
                .FirstOrDefaultAsync(a => a.AnimalId == id && a.Excluido == false);

            if (animal == null)
            {
                return NotFound("Animal não encontrado");
            }

            var animalResponse = _mapper.Map<AnimalResponse>(animal);

            return Ok(animalResponse);
        }


        [HttpGet("paginaInicial")]
        public async Task<ActionResult<List<AnimalResponse>>> ListarTresAnimaisPaginaInicial()
        {
            var animais = await _context.Animais
                .Include(a => a.Raca)
                .Include(a => a.Especie)
                .Include(a => a.Fotos)
                .Include(a => a.Descricao)
                .Include(a => a.DataNascimento)
                .Where(e => e.Excluido == false && e.Adotado == false)
                .OrderByDescending(a => a.DataCadastro)
                .Take(3)
                .ToListAsync();
            var animalReponse = _mapper.Map<List<AnimalResponse>>(animais);
            return Ok(animalReponse);
        }

        [HttpPost]
        public async Task<ActionResult> CadastrarAnimal([FromBody]AnimalRequest animalRequest)
        {
            if (animalRequest == null)
                return BadRequest("Dados inválidos");

            var animal = _mapper.Map<Animal>(animalRequest);

            _context.Animais.Add(animal);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Animal cadastrado com sucesso!", animal.AnimalId });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> AtualizarAnimal(int id, [FromBody] AnimalRequest animalRequest)
        {
            var animal = await _context.Animais
                .Include(a => a.Fotos)
                .Include(a => a.AnimalVacinas)
                .FirstOrDefaultAsync(a => a.AnimalId == id);

            if (animal == null)
                return NotFound("Animal não encontrado");

            _mapper.Map(animalRequest, animal);

            animal.Fotos.Clear();
            animal.AnimalVacinas.Clear();

            _mapper.Map(animalRequest.Fotos, animal.Fotos);
            _mapper.Map(animalRequest.AnimalVacinas, animal.AnimalVacinas);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Animal atualizado com sucesso!" });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletarAnimal(int id)
        {
            var animal = await _context.Animais.FirstOrDefaultAsync(a => a.AnimalId == id);

            if (animal == null)
                return NotFound("Animal não encontrado");

            if (animal.Excluido)
                return BadRequest("Este animal já foi excluído");

            animal.Excluido = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Animal excluído com sucesso!" });
        }

        [HttpPut("adocao/{id}")]
        public async Task<ActionResult> AtualizarAdocao(int id)
        {
            var animal = await _context.Animais.FirstOrDefaultAsync(a => a.AnimalId == id);

            if (animal == null)
                return NotFound("Animal não encontrado");

            animal.Adotado = true;
            animal.DataAdocao = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Status de adoção atualizado com sucesso!" });
        }
    }
}
