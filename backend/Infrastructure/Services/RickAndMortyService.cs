using System.Text.Json;
using Backend.Core.Interfaces;
using Backend.Core.Models;
using Microsoft.Extensions.Configuration;

namespace Backend.Infrastructure.Service;

public class RickAndMortyService : IRickAndMortyService
{
    private readonly HttpClient _httpClient;
    private readonly string _baseUrl;
    public RickAndMortyService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        var url = configuration["RickAndMortyApi:BaseUrl"];
        
        if (string.IsNullOrEmpty(url))
        {
            throw new ArgumentNullException("La URL de RickAndMortyApi no está configurada en appsettings.json");
        }

        _baseUrl = url;
    }
    public async Task<RickAndMortyResponse> GetEpisodesAsync(int page)
    {
        
        var allEpisodes = new List<EpisodeExternal>();
        string? nextUrl = "episode?page=1"; // Arrancamos en la 1

        while (!string.IsNullOrEmpty(nextUrl))
        {
            var requestUrl = nextUrl.StartsWith("http") ? nextUrl : nextUrl;

            var response = await _httpClient.GetAsync(requestUrl);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var result = JsonSerializer.Deserialize<RickAndMortyResponse>(content, options);

            if (result != null && result.Results != null)
            {
                allEpisodes.AddRange(result.Results);
                nextUrl = result.Info?.Next; 
            }
            else
            {
                nextUrl = null; 
            }
        }

        return new RickAndMortyResponse
        {
            Info = new Info { Count = allEpisodes.Count, Pages = 1 },
            Results = allEpisodes
        };
    }
}