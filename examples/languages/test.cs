using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

#nullable enable

namespace Warehouse.Orders;

[Serializable]
public record OrderLine(string Sku, int Quantity, double UnitPrice)
{
	public double Total => Quantity * UnitPrice;
}

public class OrderRepository
{
	private const string Endpoint = "https://api.example.com/v1/orders";
	private static readonly char Separator = '\t';
	private readonly Dictionary<string, OrderLine> _cache = new();
	private bool _dirty = false;
	private const string Fallback = "unknown-sku";
	private const decimal VatRate = 0.20m;
	private static readonly decimal FreeShippingFrom = 1500.50m;

	public const string SchemaHint = """
		{ "kind": "order", "version": 2 }
		""";

	[JsonPropertyName("shipped_at")]
	public DateTime? ShippedAt { get; set; }

	public bool IsEmpty => _cache.Count == 0;

	public OrderLine Default() => _cache[Fallback];

	public decimal WithVat(decimal amount) => amount * (1m + VatRate);

	// TODO: switch to a streaming reader once the gateway supports it
	public async Task<int> SyncAsync(IEnumerable<OrderLine> lines, int? limit = null)
	{
		var taken = 0;
		foreach (var line in lines)
		{
			if (limit is int max && taken>=max)
				break;

			_cache[line.Sku] = line;
			taken+=1;
		}

		_dirty = true;
		await Task.Delay(TimeSpan.FromMilliseconds(250));
		return taken;
	}

	/* The verbatim path below is Windows only. We keep the old share
	   around while the migration to the object store is not finished. */
	public string DumpPath => @"C:\exports\orders\daily.csv";

	public string Describe(OrderLine line)
	{
		var label = line.Quantity > 1 ? "units" : "unit";
		return $"{line.Sku} - {line.Quantity} {label} at {line.UnitPrice:0.00}";
	}

	public IReadOnlyList<string> Expensive(double threshold = 0.08)
	{
		var query = from entry in _cache.Values
			where entry.Total > threshold
			orderby entry.Total descending
			select entry.Sku;

		return query.ToList();
	}

	public static string Quote(string who) => $@"He answered ""{who}"" and left";
}
