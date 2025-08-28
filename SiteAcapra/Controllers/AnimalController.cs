using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SiteAcapra.Data;
using SiteAcapra.DTOs.Responses;
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
                .Where(e => e.Excluido == false && e.Adotado == false)
                .ToListAsync();

            var animalReponse = _mapper.Map<List<AnimalResponse>>(animais);

            return Ok(animalReponse);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> ObterAnimalPorId(int id)
        {
            return Ok();
        }

        [HttpPost]
        public async Task<ActionResult> CadastrarAnimal()
        {
            return Ok();
        }

        [HttpPut]
        public async Task<ActionResult> AtualizarAnimal()
        {
            return Ok();
        }

        [HttpDelete]
        public async Task<ActionResult> DeletarAnimal()
        {
            return Ok();
        }
    }
}
