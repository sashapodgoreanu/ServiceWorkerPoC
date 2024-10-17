namespace PNServer_WS.Models;

public class Keys {
    public string? P256dh { get; set; }
    public string? Auth {  get; set; }
}

public class Subscription {
    public string? Endpoint { get; set; }
    public string? ExpirationTime { get; set; }
    public Keys? Keys { get; set; }
}
