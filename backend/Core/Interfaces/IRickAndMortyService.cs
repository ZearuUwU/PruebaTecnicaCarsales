using Backend.Core.Models;

namespace Backend.Core.Interfaces;

public interface IRickAndMortyService
{
    Task<List<EpisodeExternal>> GetAllEpisodesAsync();
    Task<RickAndMortyResponse<EpisodeExternal>> GetEpisodesAsync(int page, string? name = null, string? episode = null);
    Task<RickAndMortyResponse<CharacterExternal>> GetCharactersAsync(int page, string? name = null, string? status = null, string? species = null, string? gender = null);
    Task<RickAndMortyResponse<LocationExternal>> GetLocationsAsync(int page, string? name = null, string? type = null, string? dimension = null);
}