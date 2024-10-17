using Microsoft.AspNetCore.Mvc;
using PNServer_WS.Helpers;
using PNServer_WS.Models;
using System.Text.Json;

namespace PNServer_WS.Controllers;

[ApiController]
[Route("[controller]")]
[Produces("application/json")]
public class PNController : ControllerBase {

    private readonly ILogger<PNController> _Logger;
    private readonly string _ConnectionString = "Server=nb266;Database=dbsm3p;Trusted_Connection=True;";

    public PNController(ILogger<PNController> logger) {
        _Logger = logger;
    }

    [HttpGet]
    [Route("test")]
    public IActionResult Test() {
        return Ok(new { message = $"Test passed -> {DateTime.Now:dd/MM/yyyy hh:mm:ss}" });
    }

    [HttpGet]
    [Route("numberofsubscriptions")]
    public async Task<ActionResult<int>> GetNumberOfSubscriptions() {
        var dbHelper = new DBHelper(_ConnectionString);
        int number_of_subscriptions = await dbHelper.GetNumberOfSubscriptions();

        return Ok(number_of_subscriptions);
    }

    [HttpPost]
    [Route("savesubscription")]
    public async Task<IActionResult> SaveSubscription([FromBody] Subscription subscription) {
        var dbHelper = new DBHelper(_ConnectionString);

        //  Actually convert subscription json to string for test purposes
        string serialized_subscription = JsonSerializer.Serialize(subscription);

        await dbHelper.SaveSubscription(serialized_subscription);
        _Logger.LogInformation("Subscription inserted");

        return Ok(new { message = "Subscription inserted" });
    }

}
