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

        group.MapGet("/login", async () =>
        {
            return Results.Ok("Login endpoint");
        });

        group.MapGet("/logout", async () =>
        {
            await Task.Delay(3000);
            return Results.Ok("Logout endpoint");
        });

        group.MapPost("/session", () => Results.Ok("Session created"));

        return group;
    }
}
