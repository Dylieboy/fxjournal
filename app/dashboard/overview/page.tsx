import Link from "next/link";
import { redirect } from "next/navigation";
import { calculateTradeAnalytics, formatMoney } from "@/lib/analytics";
import { getSessionUser } from "@/lib/auth";
import { getTradesForUser } from "@/lib/db";

export default async function OverviewPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/signin");
  }

  const trades = await getTradesForUser(user.id);
  const analytics = calculateTradeAnalytics(trades);
  const currency = trades[0]?.account_currency ?? "USD";
  const recentTrades = trades.slice(0, 3);

  return (
    <>
      <section className="hero-glass glass-panel">
        <div>
          <span className="eyebrow">Live trading journal</span>
          <h1>Overview</h1>
          <p>
            Track risk, reward, streaks, and the lessons behind every forex setup.
          </p>
        </div>
        <Link className="button" href="/dashboard/add-trade">
          Add trade
        </Link>
      </section>

      <section className="metrics" aria-label="Trading analytics">
        <div className="metric glass-panel animated-card">
          <span>Total P/L</span>
          <strong>{formatMoney(analytics.totalProfit, currency)}</strong>
        </div>
        <div className="metric glass-panel animated-card">
          <span>Win rate</span>
          <strong>{analytics.winRate.toFixed(0)}%</strong>
        </div>
        <div className="metric glass-panel animated-card">
          <span>Current streak</span>
          <strong>{analytics.currentWinStreak}W</strong>
        </div>
        <div className="metric glass-panel animated-card">
          <span>Average R</span>
          <strong>{analytics.averageR.toFixed(2)}R</strong>
        </div>
      </section>

      <div className="overview-grid">
        <section className="panel glass-panel">
          <h2>Market Pulse</h2>
          <div className="ticker-strip">
            {["XAUUSD", "EURUSD", "GBPJPY", "US30"].map((symbol, index) => (
              <div className="ticker" key={symbol}>
                <span>{symbol}</span>
                <strong>{index % 2 === 0 ? "+0." : "-0."}{index + 24}%</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="panel glass-panel">
          <h2>Recent Trades</h2>
          <div className="mini-list">
            {recentTrades.length ? (
              recentTrades.map((trade) => (
                <Link href="/dashboard/journal" key={trade.id}>
                  <span>{trade.symbol}</span>
                  <strong>{formatMoney(Number.parseFloat(trade.profit_loss), trade.account_currency)}</strong>
                </Link>
              ))
            ) : (
              <p className="panel-copy">No trades yet. Add one to start seeing your journal history.</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
