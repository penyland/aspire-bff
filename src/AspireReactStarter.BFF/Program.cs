using AspireReactStarter.BFF;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

// Add service defaults & Aspire client integrations
builder.AddServiceDefaults();

builder.Services.AddAuthentication()
    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
    {
        options.Cookie.Name = "__Host-AuthCookie";
        options.Cookie.SameSite = SameSiteMode.Strict;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.LoginPath = "/bff/signin";
    });

builder.Services.AddAuthorization();

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

app.UseAuthentication();
app.UseAuthorization();

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
