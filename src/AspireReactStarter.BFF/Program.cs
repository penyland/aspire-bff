using AspireReactStarter.BFF;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;

var builder = WebApplication.CreateBuilder(args);

// Add service defaults & Aspire client integrations
builder.AddServiceDefaults();

// Add YARP reverse proxy
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"))
    .AddServiceDiscoveryDestinationResolver();

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
})
.AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
{
    options.Cookie.Name = "__Host-AuthCookie";
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.LoginPath = "/bff/signin";
})
.AddKeycloakOpenIdConnect("keycloak", realm: "bff", options =>
{
    options.ClientId = "bff";
    options.ClientSecret = builder.Configuration.GetValue<string>("OpenIDConnectSettings:ClientSecret");
    options.ResponseType = OpenIdConnectResponseType.Code;
    options.SaveTokens = true;
    options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.CallbackPath = "/signin-oidc";
    options.RequireHttpsMetadata = false;
    options.GetClaimsFromUserInfoEndpoint = true;
    options.MapInboundClaims = false;
});
//.AddOpenIdConnect(OpenIdConnectDefaults.AuthenticationScheme, options =>
//{
//    options.ClientId = "bff";
//    options.ClientSecret = "";
//    //options.Authority = "http://localhost:8080/realms/bff";
//    options.ResponseType = OpenIdConnectResponseType.Code;
//    options.SaveTokens = true;
//    options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
//    options.CallbackPath = "/signin-oidc";
//    options.RequireHttpsMetadata = false;
//    options.GetClaimsFromUserInfoEndpoint = true;
//    //options.SignOutScheme = "Keycloak";
//    options.SignOutScheme = OpenIdConnectDefaults.AuthenticationScheme;
//    options.MapInboundClaims = false;
//});

builder.Services.AddAuthorization();

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
