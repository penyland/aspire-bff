using Microsoft.AspNetCore.Authentication;
using System.Net.Http.Headers;
using Yarp.ReverseProxy.Transforms;

namespace AspireReactStarter.BFF;

internal sealed class AddBearerTokenToHeadersTransform(ILogger<AddBearerTokenToHeadersTransform> logger) : RequestTransform
{
    public override async ValueTask ApplyAsync(RequestTransformContext context)
    {
        if (context.HttpContext.User.Identity is not { IsAuthenticated: true })
        {
            logger.LogWarning("User is not authenticated. Cannot add bearer token to headers.");
            return;
        }

        var token = await context.HttpContext.GetTokenAsync("access_token");
        if (token == null)
        {
            logger.LogWarning("Access token not found in the current context.");
            return;
        }

        context.ProxyRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }
}
