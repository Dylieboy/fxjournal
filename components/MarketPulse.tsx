"use client";

import { useEffect, useState } from "react";

interface Quote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
}

export function MarketPulse() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fallback data for when API key is not configured
    const fallbackQuotes: Quote[] = [
      { symbol: "XAUUSD", price: 2425.50, change: 12.50, changePercent: 0.52, high: 2430, low: 2410, open: 2413, prevClose: 2413 },
      { symbol: "EURUSD", price: 1.0875, change: 0.0015, changePercent: 0.14, high: 1.0885, low: 1.0850, open: 1.0860, prevClose: 1.0860 },
      { symbol: "GBPUSD", price: 1.2740, change: -0.0020, changePercent: -0.16, high: 1.2760, low: 1.2720, open: 1.2760, prevClose: 1.2760 },
      { symbol: "USDJPY", price: 149.85, change: 0.35, changePercent: 0.23, high: 150.10, low: 149.50, open: 149.50, prevClose: 149.50 },
    ];

    const fetchMarketData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/market-pulse");
        if (!response.ok) {
          console.warn("Market data API returned error, using fallback data");
          setQuotes(fallbackQuotes);
          return;
        }
        const data = await response.json();
        setQuotes(data.quotes);
      } catch (err) {
        console.warn("Failed to fetch market data, using fallback data:", err);
        setQuotes(fallbackQuotes);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && quotes.length === 0) {
    return (
      <section className="panel glass-panel">
        <h2>Market Pulse</h2>
        <div className="ticker-strip">
          <div className="ticker">
            <span>Loading...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="panel glass-panel">
      <h2>Market Pulse</h2>
      <div className="ticker-strip">
        {quotes.map((quote) => (
          <div className="ticker" key={quote.symbol}>
            <span>{quote.symbol}</span>
            <strong
              style={{
                color: quote.changePercent >= 0 ? "#10b981" : "#ef4444",
              }}
            >
              {quote.changePercent >= 0 ? "+" : ""}
              {quote.changePercent.toFixed(2)}%
            </strong>
          </div>
        ))}
      </div>
    </section>
  );
}
