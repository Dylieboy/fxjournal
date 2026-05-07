import Link from "next/link";
import { redirect } from "next/navigation";
import { TradeList } from "@/components/TradeList";
import { calculateTradeAnalytics } from "@/lib/analytics";
import { getSessionUser } from "@/lib/auth";
import { getTradesForUser } from "@/lib/db";

function getMotivationalMessage(analytics: any, userName: string): string {
  const { trades, wins, losses, winRate } = analytics;

  // No trades yet
  if (trades === 0) {
    return `Hey ${userName}! 🚀 Ready to start your trading journey? Every legendary trader started with their first trade. Let's make it count!`;
  }

  // Only losses
  if (wins === 0 && losses > 0) {
    return `${userName}, the fact that you're tracking these losses shows real discipline. 💪 The best traders learn more from losses than wins. Your comeback is coming!`;
  }

  // Struggling (low win rate)
  if (winRate < 40) {
    return `${userName}, you're building experience! 📈 Great traders have been exactly where you are. Focus on your process, and results will follow. Keep the faith!`;
  }

  // Breaking even (40-50% win rate)
  if (winRate <= 50) {
    return `${userName}, you're at the crossroads! 🎯 This is where commitment separates the pros from the rest. Your next wins are coming!`;
  }

  // Winning (50-70% win rate)
  if (winRate <= 70) {
    return `${userName}, now we're talking! 🔥 You've built solid habits. Stay consistent and your account will reflect your discipline.`;
  }

  // Elite (70%+ win rate)
  return `${userName}, you're in elite territory! 🌟 Your consistency is your superpower. Keep this momentum going and dominate the market!`;
}

export default async function JournalPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/signin");
  }

  const trades = await getTradesForUser(user.id);
  const analytics = calculateTradeAnalytics(trades);
  const motivationalMessage = getMotivationalMessage(analytics, user.name);

  return (
    <section className="panel glass-panel">
      <div className="section-head">
        <div>
          <span className="eyebrow">Trade history</span>
          <h1>Journal</h1>
          <p className="panel-copy motivational">
            {motivationalMessage}
          </p>
          <p className="panel-copy stats">
            {analytics.trades} trades • {analytics.wins}W {analytics.losses}L • Best streak: {analytics.bestWinStreak}
          </p>
        </div>
        <Link className="button" href="/dashboard/add-trade">
          Add trade
        </Link>
      </div>
      <TradeList trades={trades} />
    </section>
  );
}
