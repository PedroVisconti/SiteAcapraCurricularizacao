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
            // Primeiro informa qual sera a entrada e em segundo a saida

            CreateMap<TutorResponse, Tutor>();
            CreateMap<Tutor, TutorResponse>();
            CreateMap<TutorRequest, Tutor>()
                .ForMember(dest => dest.Excluido, opt => opt.MapFrom(src => false))
                .ForMember(dest => dest.DataCadastro, opt => opt.MapFrom(src => DateTime.UtcNow));
            CreateMap<BreedRequest, Raca>();
            CreateMap<Raca, BreedResponse>();
            CreateMap<Especie, SpeciesResponse>();
            CreateMap<SpeciesRequest, Especie>();
            CreateMap<Usuario, UsuarioResponse>(); 
            CreateMap<RegisterRequest, Usuario>();
            CreateMap<Vacina, AnimalVacinaDTO>();
            CreateMap<Animal, AnimalResponse>()
                .ForMember(dest => dest.AnimalVacinas, opt => opt.MapFrom(src => src.AnimalVacinas))
                .ForMember(dest => dest.Raca, opt => opt.MapFrom(src => src.Raca))
                .ForMember(dest => dest.Especie, opt => opt.MapFrom(src => src.Especie))
                .ForMember(dest => dest.Tutor, opt => opt.MapFrom(src => src.Tutor))
                .ForMember(dest => dest.Fotos, opt => opt.MapFrom(src => src.Fotos));
            CreateMap<AnimalRequest, Animal>()
                .ForMember(dest => dest.Excluido, opt => opt.MapFrom(src => false))
                .ForMember(dest => dest.DataCadastro, opt => opt.MapFrom(src => DateTime.UtcNow));
            CreateMap<FotoDoAnimalDTO, FotoDoAnimal>();
            CreateMap<AnimalVacinaDTO, AnimalVacina>()
                .ForMember(dest => dest.DataVacina, opt => opt.MapFrom(src => src.DataVacina));
            CreateMap<VacinaRequest, Vacina>()
                .ForMember(dest => dest.Excluido, opt => opt.MapFrom(src => false));
            CreateMap<Raca, RacaDTO>();
            CreateMap<Especie, EspecieDTO>();
            CreateMap<FotoDoAnimal, FotoDoAnimalDTO>();
            CreateMap<Tutor, TutorDTO>();
            CreateMap<AnimalVacina, AnimalVacinaDTO>()
                .ForMember(dest => dest.Nome, opt => opt.MapFrom(src => src.Vacina != null ? src.Vacina.Nome : null))
                .ForMember(dest => dest.VacinaId, opt => opt.MapFrom(src => src.VacinaId))
                .ForMember(dest => dest.DataVacina, opt => opt.MapFrom(src => src.DataVacina));
        }
    }
}
