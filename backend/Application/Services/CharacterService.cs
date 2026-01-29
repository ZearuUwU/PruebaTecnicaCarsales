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

    public async Task<List<CharacterDto>> GetAllCharactersAsync()
    {
        var externalCharacters = await _rickAndMortyService.GetAllCharactersAsync();

        var characters = externalCharacters.Select(c => new CharacterDto
        {
            Id = c.Id,
            Name = c.Name ?? "Desconocido",
            Status = c.Status ?? "Unknown",
            Species = c.Species ?? "Unknown",
            Gender = c.Gender ?? "Unknown",
            ImageUrl = c.Image ?? "" 
        }).ToList();

        return characters;
    }
}