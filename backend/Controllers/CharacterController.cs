using Backend.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CharactersController : ControllerBase
{
    private readonly ICharacterService _characterService;

    public CharactersController(ICharacterService characterService)
    {
        _characterService = characterService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] string? name = null,
        [FromQuery] string? status = null,
        [FromQuery] string? species = null,
        [FromQuery] string? gender = null)
    {
        var result = await _characterService.GetCharactersAsync(page, name, status, species, gender);
        return Ok(result);
    }
}