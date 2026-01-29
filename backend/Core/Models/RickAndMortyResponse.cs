using Microsoft.AspNetCore.Identity.Data;

namespace Backend.Core.Models;

public class RickAndMortyResponse
{
    public Info? Info {get; set;}
    public List<EpisodeExternal>? Results { get; set; }
}
public class Info
{
    public int Count { get; set; }
    public int Pages { get; set; }
    public string? Next { get; set; }
    public string? Prev { get; set; }
}
public class EpisodeExternal
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Air_date { get; set; } 
    public string? Episode { get; set; }  
    public List<string>? Characters { get; set; }
    public string? Url { get; set; }
    public string? Created { get; set; }
}