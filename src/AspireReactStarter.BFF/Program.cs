using AspireReactStarter.BFF;

var builder = WebApplication.CreateBuilder(args);

// Add service defaults & Aspire client integrations
builder.AddServiceDefaults();

// Add YARP reverse proxy
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"))
    .AddServiceDiscoveryDestinationResolver();

var app = builder.Build();

// In development, proxy all requests through YARP (including frontend)
// In production, serve static files from wwwroot
if (!app.Environment.IsDevelopment())
{
    app.UseDefaultFiles();
    app.UseStaticFiles();
}

// Map YARP reverse proxy
app.MapReverseProxy();

// In production, SPA fallback for non-API routes
if (!app.Environment.IsDevelopment())
{
    app.MapFallbackToFile("index.html");
}

// Map default health check endpoints
app.MapDefaultEndpoints();

app.MapBffEndpoints();

app.Run();
