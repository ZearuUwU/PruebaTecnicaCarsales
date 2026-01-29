using Backend.Application.DTOs;

namespace Backend.Core.Interfaces;

public interface ILocationService
{
    Task<List<LocationDto>> GetAllLocationsAsync();
}