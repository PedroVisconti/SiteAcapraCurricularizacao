using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SiteAcapra.Data;
using SiteAcapra.DTOs.Requests;
using SiteAcapra.DTOs.Responses;
using SiteAcapra.Models;

namespace SiteAcapra.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VacinaController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public VacinaController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<VacinaResponse>> ListarVacinas()
        {
            var vacinas = await _context.Vacinas.ToListAsync();

            var listaVacina = _mapper.Map<List<VacinaResponse>>(vacinas);

            return Ok(listaVacina);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VacinaResponse>> ObterVacinaPorId(int id)
        {
            var vacina = await _context.Vacinas.FirstOrDefaultAsync(v => v.VacinaId == id & v.Excluido == false);
            if(vacina == null)
            {
                return NotFound("Vacina não encontrada");
            }

            var vacinaResponse = _mapper.Map<VacinaResponse>(vacina);
            return Ok(vacinaResponse);
        }
        [HttpPost]
        public async Task<ActionResult> CadastrarVacina([FromBody] VacinaRequest vacinaRequest)
        {
            var vacina = _mapper.Map<Vacina>(vacinaRequest);

            _context.Vacinas.Add(vacina);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Vacina cadastrada com sucesso!", vacina.VacinaId});
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> AtualizarVacina(int id, [FromBody] VacinaRequest vacinaRequest)
        {
            var vacina = await _context.Vacinas.FirstOrDefaultAsync(v => v.VacinaId == id && v.Excluido == false);
            if(vacina == null)
            {
                return NotFound("Vacina não encontrada");
            }
            vacina.Nome = vacinaRequest.Nome;
            _context.Vacinas.Update(vacina);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Vacina atualizada com sucesso!"});
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletarVacina(int id)
        {
            var vacina = await _context.Vacinas.FirstOrDefaultAsync(v => v.VacinaId == id && v.Excluido == false);
            if(vacina == null)
            {
                return NotFound("Vacina não encontrada");
            }

            vacina.Excluido = true;

            _context.Vacinas.Update(vacina);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Vacina excluído com sucesso!" });
        }


    }
}
