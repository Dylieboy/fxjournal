import type { Trade } from "./db";

function toNumber(value: string) {
  return Number.parseFloat(value) || 0;
}

export function formatMoney(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function calculateTradeAnalytics(trades: Trade[]) {
  const closedTrades = trades.filter((trade) => trade.outcome !== "breakeven");
  const wins = trades.filter((trade) => trade.outcome === "win").length;
  const losses = trades.filter((trade) => trade.outcome === "loss").length;
  const totalProfit = trades.reduce((sum, trade) => sum + toNumber(trade.profit_loss), 0);
  const totalRisk = trades.reduce((sum, trade) => sum + toNumber(trade.risk_amount), 0);
  const plannedReward = trades.reduce((sum, trade) => sum + toNumber(trade.reward_target), 0);
  const winRate = closedTrades.length ? (wins / closedTrades.length) * 100 : 0;
  const averageR = trades.length
    ? trades.reduce((sum, trade) => {
        const risk = toNumber(trade.risk_amount);
        return sum + (risk ? toNumber(trade.profit_loss) / risk : 0);
      }, 0) / trades.length
    : 0;

  let currentWinStreak = 0;
  for (const trade of trades) {
    if (trade.outcome === "win") {
      currentWinStreak += 1;
    } else if (trade.outcome === "loss") {
      break;
    }
  }

  let bestWinStreak = 0;
  let runningWinStreak = 0;
  for (const trade of [...trades].reverse()) {
    if (trade.outcome === "win") {
      runningWinStreak += 1;
      bestWinStreak = Math.max(bestWinStreak, runningWinStreak);
    } else if (trade.outcome === "loss") {
      runningWinStreak = 0;
    }
  }

  return {
    averageR,
    bestWinStreak,
    currentWinStreak,
    losses,
    plannedReward,
    totalProfit,
    totalRisk,
    trades: trades.length,
    winRate,
    wins,
  };
}

export function getRMultiple(trade: Trade) {
  const risk = toNumber(trade.risk_amount);
  return risk ? toNumber(trade.profit_loss) / risk : 0;
}
