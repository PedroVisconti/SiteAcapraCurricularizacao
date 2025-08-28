using AutoMapper;
using SiteAcapra.DTOs;
using SiteAcapra.DTOs.Responses;
using SiteAcapra.Models;

namespace SiteAcapra.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Usuario, UsuarioResponse>();

            CreateMap<Especie, SpeciesResponse>();
            CreateMap<SpeciesRequest, Especie>();

        }
    }
}
