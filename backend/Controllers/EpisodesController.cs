using Backend.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EpisodesController : ControllerBase
{
    private readonly IEpisodeService _episodeService;

    public EpisodesController(IEpisodeService episodeService)
    {
        _episodeService = episodeService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1, 
        [FromQuery] string? name = null,
        [FromQuery] string? episode = null,
        [FromQuery] string? season = null,
        [FromQuery] string? startDate = null,
        [FromQuery] string? endDate = null)
    {
        var result = await _episodeService.GetEpisodesAsync(page, name, episode, season, startDate, endDate);
        return Ok(result);
    }
}