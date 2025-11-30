using System;
using System.Text.Json;
using System.Threading.Tasks;
using HiveMQtt.Client;
using HiveMQtt.Client.Options;

class Program
{
    static async Task Main(string[] args)
    {
        
        string vehicleId = "VEHICLE_005";
        Console.WriteLine($"Starting {vehicleId} Simulator...");

        var options = new HiveMQClientOptions
        {
            Host = "broker.hivemq.com",
            Port = 1883,
            UseTLS = false,
            ClientId = $"{vehicleId}_sim" 
        };

        var client = new HiveMQClient(options);
        var random = new Random();
        bool carRunning = false;

        Console.WriteLine($"{vehicleId} SIMULATOR - Press ENTER to START/STOP");

        var connectResult = await client.ConnectAsync();
        if (connectResult.ReasonCode == HiveMQtt.MQTT5.ReasonCodes.ConnAckReasonCode.Success)
            Console.WriteLine("Connected to HiveMQ Broker");
        else
        {
            Console.WriteLine("Failed to connect");
            return;
        }

        while (true)
        {
            Console.WriteLine($"\n[{vehicleId}] Waiting for ENTER...");
            Console.ReadLine();

            if (!carRunning)
            {
                carRunning = true;
                await SendCarStatus(client, vehicleId, "ON"); 
                Console.WriteLine($"🚗 [{vehicleId}] TURNED ON - GPS streaming...");
            }
            else
            {
                carRunning = false;
                await SendCarStatus(client, vehicleId, "OFF");
                Console.WriteLine($"🚗 [{vehicleId}] TURNED OFF");
                break;
            }

            while (carRunning)
            {
                try
                {
                    double latitude = 35.6 + random.NextDouble() / 10;
                    double longitude = 10.5 + random.NextDouble() / 10;

                    var payload = JsonSerializer.Serialize(new
                    {
                        vehicleId, 
                        latitude,
                        longitude,
                        timestamp = DateTime.UtcNow
                        
                    });

                    
                    await client.PublishAsync($"vehicles/{vehicleId}/gps", payload);
                    Console.WriteLine($"[{vehicleId}] GPS: {latitude:F4}, {longitude:F4}");

                    await Task.Delay(2000);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"GPS Error: {ex.Message}");
                    await Task.Delay(5000);
                }
            }
        }

        await client.DisconnectAsync();
    }

    
    static async Task SendCarStatus(HiveMQClient client, string vehicleId, string status)
    {
        var alertPayload = JsonSerializer.Serialize(new
        {
            vehicleId, 
            status,
            timestamp = DateTime.UtcNow,
            type = "CAR_STATUS"
        });

        
        await client.PublishAsync($"vehicles/{vehicleId}/status", alertPayload);
        Console.WriteLine($"[{vehicleId}] ALERT: {status}");
    }
}