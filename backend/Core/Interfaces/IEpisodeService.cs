using Backend.Application.DTOs;
using Backend.Core.Models;

namespace Backend.Core.Interfaces;

public interface IEpisodeService
{
    Task<RickAndMortyResponse<EpisodeDto>> GetEpisodesAsync(int page, string? name = null, string? episode = null, string? season = null, string? startDate = null, string? endDate = null);
}