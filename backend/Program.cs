using Backend.Application.Middleware;
using Backend.Application.Services;
using Backend.Core.Interfaces;
using Backend.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var corsOrigin = builder.Configuration["Cors:Origin"] ?? "http://localhost:4200";

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy => policy.WithOrigins(corsOrigin)
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var rickAndMortyUrl = builder.Configuration["RickAndMortyApi:BaseUrl"];
builder.Services.AddHttpClient<IRickAndMortyService, RickAndMortyService>(client =>
{
    client.BaseAddress = new Uri(rickAndMortyUrl!); 
});

builder.Services.AddScoped<IEpisodeService, EpisodeService>();
builder.Services.AddScoped<ICharacterService, CharacterService>();
builder.Services.AddScoped<ILocationService, LocationService>();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAngularApp");
app.UseAuthorization();
app.MapControllers();

app.Run();