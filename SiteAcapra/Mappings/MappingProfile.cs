using AutoMapper;
using SiteAcapra.DTOs;
using SiteAcapra.DTOs.AnimalDTO;
using SiteAcapra.DTOs.Requests;
using SiteAcapra.DTOs.Responses;
using SiteAcapra.Models;

namespace SiteAcapra.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<BreedRequest, Raca>();
            CreateMap<Raca, BreedResponse>();
            CreateMap<Especie, SpeciesResponse>();
            CreateMap<SpeciesRequest, Especie>();
            CreateMap<Usuario, UsuarioResponse>(); 
            CreateMap<RegisterRequest, Usuario>();
            CreateMap<Vacina, AnimalVacinaDTO>()
                .ForMember(dest => dest.VacinaNome, opt => opt.MapFrom(src => src.Nome));
            CreateMap<Animal, AnimalResponse>()
                .ForMember(dest => dest.AnimalVacinas, opt => opt.MapFrom(src => src.AnimalVacinas))
                .ForMember(dest => dest.Raca, opt => opt.MapFrom(src => src.Raca))
                .ForMember(dest => dest.Especie, opt => opt.MapFrom(src => src.Especie))
                .ForMember(dest => dest.Tutor, opt => opt.MapFrom(src => src.Tutor))
                .ForMember(dest => dest.Fotos, opt => opt.MapFrom(src => src.Fotos));

            CreateMap<AnimalRequest, Animal>()
                .ForMember(dest => dest.Excluido, opt => opt.MapFrom(src => false))
                .ForMember(dest => dest.DataCadastro, opt => opt.MapFrom(src => DateTime.UtcNow));
            CreateMap<FotoDTO, Foto>();
            CreateMap<AnimalVacinaDTO, AnimalVacina>()
                .ForMember(dest => dest.DataVacina, opt => opt.MapFrom(src => src.DataVacina));
            CreateMap<AnimalUpdateRequest, Animal>()
                .ForMember(dest => dest.Excluido, opt => opt.Ignore())
                .ForMember(dest => dest.DataCadastro, opt => opt.Ignore());
            CreateMap<VacinaUpdateRequest, Vacina>()
                .ForMember(dest => dest.Excluido, opt => opt.Ignore());
            CreateMap<VacinaRequest, Vacina>()
                .ForMember(dest => dest.Excluido, opt => opt.MapFrom(src => false));

        }
    }
}
