using Backend.Application.Middleware;
using Backend.Application.Services;
using Backend.Core.Interfaces;
using Backend.Infrastructure.Service;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy => policy.WithOrigins("http://localhost:4200")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var rickAndMortyUrl = builder.Configuration["RickAndMortyApi:BaseUrl"];
builder.Services.AddHttpClient<IRickAndMortyService, RickAndMortyService>(client =>
{
    // El ! fuerza a que no sea nulo, confiamos en appsettings
    client.BaseAddress = new Uri(rickAndMortyUrl!); 
});

builder.Services.AddScoped<IEpisodeService, EpisodeService>();

var app = builder.Build();

// 2. Pipeline
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