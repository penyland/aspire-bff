using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;

namespace AspireReactStarter.BFF;

public static class BffEndpoints
{
    public static RouteGroupBuilder MapBffEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/bff");

        group.MapGet("/health", async () =>
        {
            return Results.Ok("BFF is healthy");
        });

        group.MapGet("/login", async (HttpContext context) =>
        {
            await context.ChallengeAsync(CookieAuthenticationDefaults.AuthenticationScheme, new() { RedirectUri = "/" });
        });

        group.MapGet("/logout", async (HttpContext context) =>
        {
            await context.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Results.Redirect("/");
        });

        group.MapGet("/signin", async (HttpContext context) =>
        {
            // Generate claims for the user
            var claims = new List<Claim>
            {
                new("sub", "12345"),
                new(ClaimTypes.Name, "Peter"),
                new(ClaimTypes.Email, "peter@example.com"),
                new(ClaimTypes.Role, "User")
            };

            // Create claims identity with the name claim as the NameClaimType
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            // Create claims principal
            var principal = new ClaimsPrincipal(identity);

            // Sign in the user
            var authenticationProperties = new AuthenticationProperties
            {
                RedirectUri = "/",
                IsPersistent = true,
                ExpiresUtc = DateTimeOffset.UtcNow.AddHours(1),
            };

            await context.SignInAsync(scheme: CookieAuthenticationDefaults.AuthenticationScheme, principal, authenticationProperties);

            return Results.Redirect("/");
        });

        group.MapPost("/session", async (HttpContext context) =>
        {
            if (!context.User.Identity?.IsAuthenticated == true)
            {
                return Results.Unauthorized();
            }

            // Get authentication result
            var authResult = await context.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            // Extract user claims
            var claims = context.User.Claims.Select(c => new
            {
                c.Type,
                c.Value
            }).ToArray();

            // Extract identity information
            var identity = new
            {
                authenticationType = context.User.Identity?.AuthenticationType,
                isAuthenticated = context.User.Identity?.IsAuthenticated,
                name = context.User.Identity?.Name ?? "Unknown",
                email = context.User.Claims.FirstOrDefault(c => c.Type == "email")?.Value
            };

            // Extract authentication properties
            var authProperties = new Dictionary<string, object>();
            if (authResult.Properties != null)
            {
                // Add standard properties
                if (authResult.Properties.IssuedUtc.HasValue)
                    authProperties["issuedUtc"] = authResult.Properties.IssuedUtc.Value;

                if (authResult.Properties.ExpiresUtc.HasValue)
                    authProperties["expiresUtc"] = authResult.Properties.ExpiresUtc.Value;

                if (!string.IsNullOrEmpty(authResult.Properties.RedirectUri))
                    authProperties["redirectUri"] = authResult.Properties.RedirectUri;

                // Add custom items
                foreach (var item in authResult.Properties.Items)
                {
                    if (item.Value is not null)
                    {
                        authProperties[item.Key] = item.Value;
                    }
                }
            }

            // Calculate cookie lifetime information
            TimeSpan? remainingTime = null;
            if (authResult.Properties?.ExpiresUtc.HasValue == true)
            {
                remainingTime = authResult.Properties.ExpiresUtc.Value - DateTimeOffset.UtcNow;
            }

            var cookieLifetime = new
            {
                issuedUtc = authResult.Properties?.IssuedUtc,
                expiresUtc = authResult.Properties?.ExpiresUtc,
                remainingTime,
            };

            // Create comprehensive response
            var sessionInfo = new
            {
                timestamp = DateTimeOffset.UtcNow,
                claims,
                identity,
                authenticationProperties = authProperties,
                cookieLifetime
            };

            return Results.Json(sessionInfo, new System.Text.Json.JsonSerializerOptions() { WriteIndented = true });
        });

        return group;
    }
}
