using AutoMapper;
using SiteAcapra.DTOs.Responses;
using SiteAcapra.Models;

namespace SiteAcapra.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Usuario, UsuarioResponse>();
        }
    }
}
