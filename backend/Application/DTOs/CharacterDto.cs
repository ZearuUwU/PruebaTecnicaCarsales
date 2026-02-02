namespace Backend.Application.DTOs;

public class CharacterDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Species { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public List<string> Episode { get; set; } = new();
}