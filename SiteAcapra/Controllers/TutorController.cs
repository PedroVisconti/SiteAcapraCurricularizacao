using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SiteAcapra.Data;

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
    }
}
