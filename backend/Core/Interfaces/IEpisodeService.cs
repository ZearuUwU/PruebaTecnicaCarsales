using Backend.Application.DTOs;

namespace Backend.Core.Interfaces;

public interface IEpisodeService
{
    Task<List<EpisodeDto>> GetAllEpisodesAsync();
}