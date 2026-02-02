using System.Text.Json;
using System.Web;
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

    public async Task<RickAndMortyResponse<EpisodeExternal>> GetEpisodesAsync(int page, string? name = null, string? episode = null)
    {
        var query = HttpUtility.ParseQueryString(string.Empty);
        query["page"] = page.ToString();
        if (!string.IsNullOrEmpty(name)) query["name"] = name;
        if (!string.IsNullOrEmpty(episode)) query["episode"] = episode;

        return await FetchData<EpisodeExternal>($"episode?{query}");
    }

    public async Task<RickAndMortyResponse<CharacterExternal>> GetCharactersAsync(int page, string? name = null, string? status = null, string? species = null, string? gender = null)
    {
        var query = HttpUtility.ParseQueryString(string.Empty);
        query["page"] = page.ToString();
        if (!string.IsNullOrEmpty(name)) query["name"] = name;
        if (!string.IsNullOrEmpty(status) && status != "All") query["status"] = status;
        if (!string.IsNullOrEmpty(species)) query["species"] = species;
        if (!string.IsNullOrEmpty(gender) && gender != "All") query["gender"] = gender;

        return await FetchData<CharacterExternal>($"character?{query}");
    }

    public async Task<RickAndMortyResponse<LocationExternal>> GetLocationsAsync(int page, string? name = null, string? type = null, string? dimension = null)
    {
        var query = HttpUtility.ParseQueryString(string.Empty);
        query["page"] = page.ToString();
        if (!string.IsNullOrEmpty(name)) query["name"] = name;
        if (!string.IsNullOrEmpty(type)) query["type"] = type;
        if (!string.IsNullOrEmpty(dimension)) query["dimension"] = dimension;

        return await FetchData<LocationExternal>($"location?{query}");
    }

    private async Task<List<T>> FetchAll<T>(string endpoint)
    {
        var allItems = new List<T>();
        string? nextUrl = $"{endpoint}?page=1"; 

        while (!string.IsNullOrEmpty(nextUrl))
        {
            var requestUrl = nextUrl.StartsWith("http") ? nextUrl : nextUrl;
            
            // Basic delay to be safe, though not strictly needed for 3 pages
            // But user mentioned backend issues 429
            await Task.Delay(100); 

            try 
            {
               var response = await _httpClient.GetAsync(requestUrl);
               if ((int)response.StatusCode == 429) { await Task.Delay(2000); continue; }
               
               response.EnsureSuccessStatusCode();
               var content = await response.Content.ReadAsStringAsync();
               var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
               var result = JsonSerializer.Deserialize<RickAndMortyResponse<T>>(content, options);
               
               if (result?.Results != null) {
                   allItems.AddRange(result.Results);
                   nextUrl = result.Info?.Next;
               } else {
                   nextUrl = null;
               }
            }
            catch { nextUrl = null; }
        }
        return allItems;
    }

    private async Task<RickAndMortyResponse<T>> FetchData<T>(string endpoint)
    {
        try 
        {
            var response = await _httpClient.GetAsync(endpoint);
            
            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return new RickAndMortyResponse<T> 
                { 
                    Info = new Info { Count = 0, Pages = 0 }, 
                    Results = new List<T>() 
                };
            }

            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            
            return JsonSerializer.Deserialize<RickAndMortyResponse<T>>(content, options) ?? new RickAndMortyResponse<T>();
        }
        catch (HttpRequestException)
        {
            return new RickAndMortyResponse<T> { Results = new List<T>() }; 
        }
    }
}