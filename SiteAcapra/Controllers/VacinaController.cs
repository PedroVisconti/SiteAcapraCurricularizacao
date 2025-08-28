using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SiteAcapra.Data;
using SiteAcapra.DTOs.Responses;

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

    }
}
