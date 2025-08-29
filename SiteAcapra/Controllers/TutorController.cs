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
    public class TutorController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public TutorController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<TutorResponse>>> GetTutors()
        {
            var tutores = _context.Tutores
                .Where(t => t.Excluido == false)
                .ToList();

            var listaTutores = _mapper.Map<List<TutorResponse>>(tutores);

            return Ok(listaTutores);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TutorResponse>> GetTutorById(Guid id)
        {
            var tutor = await _context.Tutores.FindAsync(id);
            if (tutor == null || tutor.Excluido)
            {
                return NotFound("Tutor não encontrado.");
            }
            var tutorResponse = _mapper.Map<TutorResponse>(tutor);

            return Ok(tutorResponse);
        }

        [HttpPost]
        public async Task<ActionResult> CreateTutor([FromBody] TutorRequest tutorRequest)
        {
            if (tutorRequest == null)
            {
                return BadRequest("Dados do tutor são obrigatórios.");
            }

            var tutor = _mapper.Map<Tutor>(tutorRequest);

            _context.Tutores.Add(tutor);

            await _context.SaveChangesAsync();

            return Ok("Tutor cadastrado com sucesso");
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateTutor([FromBody] TutorRequest tutor, Guid id)
        {
            if (tutor == null)
            {
                return BadRequest("Dados do tutor são obrigatórios.");
            }
            var tutorExistente = await _context.Tutores.FindAsync(id);

            if (tutorExistente == null || tutorExistente.Excluido)
            {
                return NotFound("Tutor não encontrado.");
            }

            _mapper.Map(tutor, tutorExistente);

            await _context.SaveChangesAsync();
            return Ok("Tutor Atualizado");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTutor(Guid id)
        {
            var tutor = await _context.Tutores.FindAsync(id);
            if (tutor == null || tutor.Excluido)
            {
                return NotFound("Tutor não encontrado.");
            }

            tutor.Excluido = true;

            await _context.SaveChangesAsync();
            return Ok("Tutor excluído");
        }



    }
}
