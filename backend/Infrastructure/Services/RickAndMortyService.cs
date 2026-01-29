using System.Text.Json;
using Backend.Core.Interfaces;
using Backend.Core.Models;

namespace Backend.Infrastructure.Services; 
public class RickAndMortyService : IRickAndMortyService
{
    private readonly HttpClient _httpClient;

    public RickAndMortyService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<List<EpisodeExternal>> GetAllEpisodesAsync() 
        => await FetchAll<EpisodeExternal>("episode");

    public async Task<List<CharacterExternal>> GetAllCharactersAsync() 
        => await FetchAll<CharacterExternal>("character");

    public async Task<List<LocationExternal>> GetAllLocationsAsync() 
        => await FetchAll<LocationExternal>("location");

  private async Task<List<T>> FetchAll<T>(string endpoint)
    {
        var allItems = new List<T>();
        string? nextUrl = $"{endpoint}?page=1"; 

        while (!string.IsNullOrEmpty(nextUrl))
        {
            var requestUrl = nextUrl.StartsWith("http") ? nextUrl : nextUrl;

            var response = await _httpClient.GetAsync(requestUrl);

            if ((int)response.StatusCode == 429)
            {
                await Task.Delay(3000);
                continue; 
            }

            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            
            var result = JsonSerializer.Deserialize<RickAndMortyResponse<T>>(content, options);

            if (result?.Results != null)
            {
                allItems.AddRange(result.Results);
                nextUrl = result.Info?.Next;
                
                await Task.Delay(100); 
            }
            else
            {
                nextUrl = null;
            }
        }
        return allItems;
    }
}