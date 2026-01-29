using Backend.Core.Models;

namespace Backend.Core.Interfaces;

public interface IRickAndMortyService
{
    Task<RickAndMortyResponse> GetEpisodesAsync(int page);
}