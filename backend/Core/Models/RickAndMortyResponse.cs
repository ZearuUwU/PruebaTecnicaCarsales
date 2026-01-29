using Microsoft.AspNetCore.Identity.Data;

namespace Backend.Core.Models;

public class RickAndMortyResponse<T>
{
    public Info? Info {get; set;}
    public List<T>? Results { get; set; }
}
public class Info
{
    public int Count { get; set; }
    public int Pages { get; set; }
    public string? Next { get; set; }
    public string? Prev { get; set; }
}
