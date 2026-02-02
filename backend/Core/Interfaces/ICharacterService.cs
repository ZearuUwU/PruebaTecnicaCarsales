using Backend.Application.DTOs;
using Backend.Core.Models;

namespace Backend.Core.Interfaces;

public interface ICharacterService
{
    Task<RickAndMortyResponse<CharacterDto>> GetCharactersAsync(int page, string? name = null, string? status = null, string? species = null, string? gender = null);
}