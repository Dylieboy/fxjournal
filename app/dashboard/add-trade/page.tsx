import { redirect } from "next/navigation";
import { createTradeAction } from "@/app/actions";
import { getSessionUser } from "@/lib/auth";

type AddTradePageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default async function AddTradePage({ searchParams }: AddTradePageProps) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/signin");
  }

  const params = await searchParams;

  return (
    <section className="panel glass-panel form-page">
      <span className="eyebrow">Position log</span>
      <h1>Add Trade</h1>
      <p className="panel-copy">
        Record the market, lot size, planned risk, reward target, result, and notes.
      </p>
      {params.error === "trade" ? (
        <div className="error">Please check the trade values and try again.</div>
      ) : null}

      <form action={createTradeAction} className="form-grid">
        <div className="two-col">
          <div className="field">
            <label htmlFor="symbol">Market</label>
            <input id="symbol" name="symbol" placeholder="XAUUSD" required />
          </div>
          <div className="field">
            <label htmlFor="accountCurrency">Currency</label>
            <input defaultValue="USD" id="accountCurrency" name="accountCurrency" maxLength={5} required />
          </div>
        </div>

        <div className="two-col">
          <div className="field">
            <label htmlFor="lotSize">Lot size</label>
            <input id="lotSize" name="lotSize" step="0.01" min="0.01" type="number" placeholder="2.00" required />
          </div>
          <div className="field">
            <label htmlFor="openedAt">Trade date</label>
            <input id="openedAt" name="openedAt" type="date" defaultValue={today()} required />
          </div>
        </div>

        <div className="two-col">
          <div className="field">
            <label htmlFor="riskAmount">Prepared to lose</label>
            <input id="riskAmount" name="riskAmount" step="0.01" min="0.01" type="number" placeholder="100" required />
          </div>
          <div className="field">
            <label htmlFor="rewardTarget">Target profit</label>
            <input id="rewardTarget" name="rewardTarget" step="0.01" min="0.01" type="number" placeholder="200" required />
          </div>
        </div>

        <div className="two-col">
          <div className="field">
            <label htmlFor="profitLoss">Actual P/L</label>
            <input id="profitLoss" name="profitLoss" step="0.01" type="number" placeholder="180" required />
          </div>
          <div className="field">
            <label htmlFor="outcome">Outcome</label>
            <select id="outcome" name="outcome" defaultValue="win" required>
              <option value="win">Win</option>
              <option value="loss">Loss</option>
              <option value="breakeven">Breakeven</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="setup">Setup</label>
          <input id="setup" name="setup" placeholder="London breakout, NY reversal, support retest" />
        </div>

        <div className="field">
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" placeholder="Why did you take the trade?" />
        </div>

        <div className="field">
          <label htmlFor="lesson">What did you learn?</label>
          <textarea id="lesson" name="lesson" placeholder="What worked, what failed, what to repeat?" />
        </div>

        <button className="button" type="submit">
          Save trade
        </button>
      </form>
    </section>
  );
}
