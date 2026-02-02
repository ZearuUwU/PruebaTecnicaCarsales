using Backend.Application.DTOs;
using Backend.Core.Interfaces;
using Backend.Core.Models;

namespace Backend.Application.Services;

public class CharacterService : ICharacterService
{
    private readonly IRickAndMortyService _rickAndMortyService;

    public CharacterService(IRickAndMortyService rickAndMortyService)
    {
        _rickAndMortyService = rickAndMortyService;
    }

    public async Task<RickAndMortyResponse<CharacterDto>> GetCharactersAsync(int page, string? name = null, string? status = null, string? species = null, string? gender = null)
    {
        var response = await _rickAndMortyService.GetCharactersAsync(page, name, status, species, gender);

        var characters = response.Results?.Select(c => new CharacterDto
        {
            Id = c.Id,
            Name = c.Name ?? "Desconocido",
            Status = c.Status ?? "Unknown",
            Species = c.Species ?? "Unknown",
            Gender = c.Gender ?? "Unknown",
            ImageUrl = c.Image ?? "",
            Episode = c.Episode ?? new List<string>()
        }).ToList() ?? new List<CharacterDto>();

        return new RickAndMortyResponse<CharacterDto>
        {
            Info = response.Info,
            Results = characters
        };
    }
}