using System.Globalization;
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

    public async Task<RickAndMortyResponse<EpisodeDto>> GetEpisodesAsync(int page, string? name = null, string? episode = null, string? season = null, string? startDate = null, string? endDate = null)
    {
        if (!string.IsNullOrEmpty(season) || !string.IsNullOrEmpty(startDate) || !string.IsNullOrEmpty(endDate))
        {
            var allEpisodes = await _rickAndMortyService.GetAllEpisodesAsync();
            var dtos = allEpisodes.Select(e => MapToDto(e)).ToList();

            if (!string.IsNullOrEmpty(name)) 
                dtos = dtos.Where(e => (e.Name != null && e.Name.Contains(name, StringComparison.OrdinalIgnoreCase)) || (e.EpisodeCode != null && e.EpisodeCode.Contains(name, StringComparison.OrdinalIgnoreCase))).ToList();

            if (!string.IsNullOrEmpty(episode))
                dtos = dtos.Where(e => e.EpisodeCode != null && e.EpisodeCode.Contains(episode, StringComparison.OrdinalIgnoreCase)).ToList();

            if (!string.IsNullOrEmpty(season) && season != "All")
            {
                 dtos = dtos.Where(e => e.Season.ToString() == season).ToList();
            }

            if (!string.IsNullOrEmpty(startDate) || !string.IsNullOrEmpty(endDate))
            {
                dtos = dtos.Where(e => {
                    if (DateTime.TryParse(e.AirDate, CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime airDate))
                    {
                         bool matches = true;
                         
                         if (!string.IsNullOrEmpty(startDate) && DateTime.TryParse(startDate, out DateTime start))
                         {
                             if (startDate.Length == 7) 
                             {
                                 if (airDate.Year != start.Year || airDate.Month != start.Month) matches = false;
                             }
                             else 
                             {
                                 if (airDate < start) matches = false;
                             }
                         }

                         if (!string.IsNullOrEmpty(endDate) && DateTime.TryParse(endDate, out DateTime end))
                         {
                             if (airDate > end) matches = false;
                         }

                         return matches;
                    }
                    return false;
                }).ToList();
            }

            int total = dtos.Count;
            int pageSize = 20;
            int totalPages = (int)Math.Ceiling(total / (double)pageSize);
            
            var paginated = dtos.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            return new RickAndMortyResponse<EpisodeDto> 
            {
                Info = new Info { Count = total, Pages = totalPages, Next = page < totalPages ? "yes" : null },
                Results = paginated
            };
        }
        else 
        {
            var response = await _rickAndMortyService.GetEpisodesAsync(page, name, episode);
            
            var episodes = response.Results?.Select(e => MapToDto(e)).ToList() ?? new List<EpisodeDto>();

             return new RickAndMortyResponse<EpisodeDto>
            {
                Info = response.Info,
                Results = episodes
            };
        }
    }

    private EpisodeDto MapToDto(EpisodeExternal e)
    {
        return new EpisodeDto
        {
            Id = e.Id,
            Name = e.Name ?? "Sin Nombre", 
            AirDate = e.Air_date ?? "Desconocida",
            EpisodeCode = e.Episode ?? "", 
            Season = ParseSeason(e.Episode ?? ""),
            EpisodeNumber = ParseEpisodeNumber(e.Episode ?? "")
        };
    }

    private int ParseSeason(string episodeCode)
    {
        if (string.IsNullOrEmpty(episodeCode)) return 0;

        if (episodeCode.Length > 3 && (episodeCode.StartsWith("S") || episodeCode.StartsWith("s")))
        {
            var indexE = episodeCode.IndexOf('E', StringComparison.OrdinalIgnoreCase);
            if (indexE > 1) 
            {
                var seasonPart = episodeCode.Substring(1, indexE - 1);
                if (int.TryParse(seasonPart, out int season))
                    return season;
            }
        }
        return 0;
    }
    
    private int ParseEpisodeNumber(string episodeCode)
    {
        if (string.IsNullOrEmpty(episodeCode)) return 0;

        var indexE = episodeCode.IndexOf('E', StringComparison.OrdinalIgnoreCase);
        if (indexE > 0 && indexE + 1 < episodeCode.Length)
        {
            var episodePart = episodeCode.Substring(indexE + 1);
            if (int.TryParse(episodePart, out int number))
                return number;
        }
        return 0;
    }
}
