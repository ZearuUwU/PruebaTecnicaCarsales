using Backend.Application.DTOs;

namespace Backend.Core.Interfaces;

public interface ICharacterService
{
    Task<List<CharacterDto>> GetAllCharactersAsync();
}