using Backend.Application.DTOs;
using Backend.Core.Interfaces;
using Backend.Core.Models; 
namespace Backend.Application.Services;

public class EpisodeService : IEpisodeService
{
    private readonly IRickAndMortyService _rickAndMortyService;

    public EpisodeService(IRickAndMortyService rickAndMortyService)
    {
        _rickAndMortyService = rickAndMortyService;
    }

    public async Task<List<EpisodeDto>> GetAllEpisodesAsync()
    {
        var externalData = await _rickAndMortyService.GetEpisodesAsync(1);

        var results = externalData.Results ?? new List<EpisodeExternal>();

        var episodes = results.Select(e => new EpisodeDto
        {
            Id = e.Id,
            Name = e.Name ?? "Sin Nombre", 
            AirDate = e.Air_date ?? "Desconocida",
            EpisodeCode = e.Episode ?? "", 
            Season = ParseSeason(e.Episode ?? ""),
            EpisodeNumber = ParseEpisodeNumber(e.Episode ?? "")
        }).ToList();

        return episodes;
    }

    private int ParseSeason(string episodeCode)
    {
        if (string.IsNullOrEmpty(episodeCode)) return 0; 

        if (episodeCode.Length > 3 && episodeCode.StartsWith("S"))
        {
            var seasonPart = episodeCode.Substring(1, 2);
            if (int.TryParse(seasonPart, out int season))
                return season;
        }
        return 0;
    }

    private int ParseEpisodeNumber(string episodeCode)
    {
        if (string.IsNullOrEmpty(episodeCode)) return 0; 

        var indexE = episodeCode.IndexOf('E');
        if (indexE > 0 && indexE + 1 < episodeCode.Length)
        {
            var episodePart = episodeCode.Substring(indexE + 1);
            if (int.TryParse(episodePart, out int number))
                return number;
        }
        return 0;
    }
}