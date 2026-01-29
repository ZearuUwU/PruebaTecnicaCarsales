namespace Backend.Application.DTOs;

public class EpisodeDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? AirDate { get; set; }
    public string? EpisodeCode { get; set; } 
    public int Season { get; set; } 
    public int EpisodeNumber { get; set; } 
}