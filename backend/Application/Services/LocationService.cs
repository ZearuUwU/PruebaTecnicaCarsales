using Backend.Application.DTOs;
using Backend.Core.Interfaces;
using Backend.Core.Models;

namespace Backend.Application.Services;

public class LocationService : ILocationService
{
    private readonly IRickAndMortyService _rickAndMortyService;

    public LocationService(IRickAndMortyService rickAndMortyService)
    {
        _rickAndMortyService = rickAndMortyService;
    }

    public async Task<RickAndMortyResponse<LocationDto>> GetLocationsAsync(int page)
    {
        var response = await _rickAndMortyService.GetLocationsAsync(page);

        var locations = response.Results?.Select(l => new LocationDto
        {
            Id = l.Id,
            Name = l.Name ?? "Desconocido",
            Type = l.Type ?? "Unknown",
            Dimension = l.Dimension ?? "Unknown"
        }).ToList() ?? new List<LocationDto>();

        return new RickAndMortyResponse<LocationDto>
        {
            Info = response.Info,
            Results = locations
        };
    }
}