var builder = WebApplication.CreateBuilder(args);
//builder.WebHost.UseUrls("http://localhost:15001");

// Add services to the container.

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.

//app.UseHttpsRedirection();

//app.UseAuthorization();

app.MapControllers();

app.Run();
