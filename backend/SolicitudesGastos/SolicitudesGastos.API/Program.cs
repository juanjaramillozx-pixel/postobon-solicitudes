using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using SolicitudesGastos.API.Middlewares;
using SolicitudesGastos.Application.Interfaces;
using SolicitudesGastos.Application.Services;
using SolicitudesGastos.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Observabilidad
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Services
builder.Services.AddScoped<ISolicitudGastoService, SolicitudGastoService>();
builder.Services.AddScoped<ISolicitudGastoRepository, SolicitudGastoRepository>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

// Controllers
builder.Services.AddControllers();

// SWAGGER CON API KEY
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SolicitudesGastos API",
        Version = "v1"
    });

    options.AddSecurityDefinition("ApiKey", new OpenApiSecurityScheme
    {
        Description = "API Key requerida. Ingresa: 123456",
        In = ParameterLocation.Header,
        Name = "x-api-key",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "ApiKeyScheme"
    });


    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "ApiKey"
                },
                In = ParameterLocation.Header,
                Name = "x-api-key",
                Type = SecuritySchemeType.ApiKey
            },
            new List<string>()
        }
    });
});

var app = builder.Build();

// Middleware pipeline
app.UseHttpsRedirection();

app.UseCors("AllowAngular");

// Swagger
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1");
});

// Middlewares
app.UseMiddleware<ApiKeyMiddleware>();
app.UseMiddleware<ExceptionMiddleware>();

// Controllers
app.MapControllers();

// Test
app.MapGet("/ping", () => "API funcionando");

app.Run();