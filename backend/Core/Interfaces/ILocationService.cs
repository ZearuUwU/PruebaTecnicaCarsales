using Backend.Application.DTOs;
using Backend.Core.Models;

namespace Backend.Core.Interfaces;

public interface ILocationService
{
    Task<RickAndMortyResponse<LocationDto>> GetLocationsAsync(int page);
}