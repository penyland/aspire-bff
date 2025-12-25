var builder = DistributedApplication.CreateBuilder(args);

var openIDConnectSettingsClientSecret = builder.AddParameter("OpenIDConnectSettingsClientSecret", secret: true);
var keycloakdUsername = builder.AddParameter("username");
var keycloakPassword = builder.AddParameter("password", secret: true);

var keycloak = builder.AddKeycloak("keycloak", port: 8080, adminUsername: keycloakdUsername, adminPassword: keycloakPassword)
    .WithDataVolume()
    .WithOtlpExporter()
    .WithLifetime(ContainerLifetime.Persistent);

openIDConnectSettingsClientSecret.WithParentRelationship(keycloak);
keycloakdUsername.WithParentRelationship(keycloak);
keycloakPassword.WithParentRelationship(keycloak);

var server = builder.AddProject<Projects.AspireReactStarter_Server>("server")
    .WithHttpHealthCheck("/health");

var webfrontend = builder.AddViteApp("webfrontend", "../frontend");

var bff = builder.AddProject<Projects.AspireReactStarter_BFF>("bff")
    .WithReference(server)
    .WithReference(webfrontend)
    .WithReference(keycloak)
    .WaitFor(server)
    .WaitFor(webfrontend)
    .WaitFor(keycloak)
    .WithEnvironment("OpenIDConnectSettings__ClientSecret", openIDConnectSettingsClientSecret)
    .WithUrls(context =>
    {
        context.Urls.Add(new() { Url = "/bff", DisplayText = "BFF", Endpoint = context.GetEndpoint("https")});
    })
    .PublishWithContainerFiles(webfrontend, "wwwroot");

builder.Build().Run();
