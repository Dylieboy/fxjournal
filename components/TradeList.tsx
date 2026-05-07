import { deleteTradeAction } from "@/app/actions";
import { formatMoney, getRMultiple } from "@/lib/analytics";
import type { Trade } from "@/lib/db";

type TradeListProps = {
  trades: Trade[];
};

export function TradeList({ trades }: TradeListProps) {
  if (!trades.length) {
    return <div className="empty">No trades yet. Add your first XAUUSD or forex setup.</div>;
  }

  return (
    <div className="trade-list">
      {trades.map((trade) => {
        const risk = Number.parseFloat(trade.risk_amount);
        const target = Number.parseFloat(trade.reward_target);
        const rr = risk ? target / risk : 0;
        const profitLoss = Number.parseFloat(trade.profit_loss);

        return (
          <article className="trade-card glass-panel animated-card" key={trade.id}>
            <div className="trade-head">
              <div className="trade-title">
                <h3>{trade.symbol}</h3>
                <p>
                  {trade.opened_at} {trade.setup ? `- ${trade.setup}` : ""}
                </p>
              </div>
              <span className={`pill ${trade.outcome}`}>{trade.outcome}</span>
            </div>

            <div className="trade-stats">
              <div className="trade-stat">
                <span>Lots</span>
                <strong>{Number.parseFloat(trade.lot_size).toFixed(2)}</strong>
              </div>
              <div className="trade-stat">
                <span>Risk</span>
                <strong>{formatMoney(risk, trade.account_currency)}</strong>
              </div>
              <div className="trade-stat">
                <span>Plan</span>
                <strong>1:{rr.toFixed(2)}</strong>
              </div>
              <div className="trade-stat">
                <span>Result</span>
                <strong>
                  {formatMoney(profitLoss, trade.account_currency)} ({getRMultiple(trade).toFixed(2)}R)
                </strong>
              </div>
            </div>

            {trade.notes ? <p className="trade-notes">{trade.notes}</p> : null}
            {trade.lesson ? (
              <p className="trade-notes">
                <strong>📚 Lesson:</strong> {trade.lesson}
              </p>
            ) : null}

            <form action={deleteTradeAction}>
              <input name="tradeId" type="hidden" value={trade.id} />
              <button className="button danger" type="submit">
                Delete
              </button>
            </form>
          </article>
        );
      })}
    </div>
  );
}
