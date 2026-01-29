using Backend.Core.Models;

namespace Backend.Core.Interfaces;

public interface IRickAndMortyService
{
    Task<List<EpisodeExternal>> GetAllEpisodesAsync();
    Task<List<CharacterExternal>> GetAllCharactersAsync();
    Task<List<LocationExternal>> GetAllLocationsAsync();
}