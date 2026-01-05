using AspireReactStarter.BFF;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Yarp.ReverseProxy.Transforms;

var builder = WebApplication.CreateBuilder(args);

// Add service defaults & Aspire client integrations
builder.AddServiceDefaults();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddSingleton<AddBearerTokenToHeadersTransform>();

// Add YARP reverse proxy
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"))
    .AddTransforms(context =>
    {
        if (context.Route.AuthorizationPolicy != null)
        {
            context.RequestTransforms.Add(context.Services.GetRequiredService<AddBearerTokenToHeadersTransform>());
        }

        context.RequestTransforms.Add(new RequestHeaderRemoveTransform("Cookie"));
    })
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
    options.Events.OnRedirectToLogin = context =>
    {
        // For API requests, return 401 instead of redirecting to login
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        }
        context.Response.Redirect(context.RedirectUri);
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = context =>
    {
        // For API requests, return 403 instead of redirecting
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return Task.CompletedTask;
        }
        context.Response.Redirect(context.RedirectUri);
        return Task.CompletedTask;
    };
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

    options.Scope.Clear();
    options.Scope.Add("openid");
    options.Scope.Add("profile");
    options.Scope.Add("email");
    options.Scope.Add("offline_access");
    options.Scope.Add("api.all");

    options.Events.OnRedirectToIdentityProvider = context =>
    {
        // For API requests, return 401 instead of redirecting to identity provider
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            context.HandleResponse();
        }
        return Task.CompletedTask;
    };
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

app.UseCors();

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
