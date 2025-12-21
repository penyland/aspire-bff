var builder = DistributedApplication.CreateBuilder(args);

var server = builder.AddProject<Projects.AspireReactStarter_Server>("server")
    .WithHttpHealthCheck("/health");

var webfrontend = builder.AddViteApp("webfrontend", "../frontend");

var bff = builder.AddProject<Projects.AspireReactStarter_BFF>("bff")
    .WithReference(server)
    .WithReference(webfrontend)
    .WithHttpHealthCheck("/health")
    .WithExternalHttpEndpoints()
    .WaitFor(server)
    .WaitFor(webfrontend);

bff.PublishWithContainerFiles(webfrontend, "wwwroot");

builder.Build().Run();
