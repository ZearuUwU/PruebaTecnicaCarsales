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
    public async Task<IActionResult> GetAll([FromQuery] int page = 1)
    {
        var episodes = await _episodeService.GetAllEpisodesAsync(); 
        
        return Ok(episodes);
    }
}