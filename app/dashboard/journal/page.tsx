import Link from "next/link";
import { redirect } from "next/navigation";
import { TradeList } from "@/components/TradeList";
import { calculateTradeAnalytics } from "@/lib/analytics";
import { getSessionUser } from "@/lib/auth";
import { getTradesForUser } from "@/lib/db";

export default async function JournalPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/signin");
  }

  const trades = await getTradesForUser(user.id);
  const analytics = calculateTradeAnalytics(trades);

  return (
    <section className="panel glass-panel">
      <div className="section-head">
        <div>
          <span className="eyebrow">Trade history</span>
          <h1>Journal</h1>
          <p className="panel-copy">
            {analytics.trades} trades, {analytics.wins} wins, {analytics.losses} losses,
            best win streak {analytics.bestWinStreak}.
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
