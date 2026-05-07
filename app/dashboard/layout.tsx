import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";
import { calculateTradeAnalytics } from "@/lib/analytics";
import { getSessionUser } from "@/lib/auth";
import { getTradesForUser } from "@/lib/db";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/signin");
  }

  const trades = await getTradesForUser(user.id);
  const analytics = calculateTradeAnalytics(trades);
  const currency = trades[0]?.account_currency ?? "USD";

  return (
    <DashboardShell
      currency={currency}
      totalProfit={analytics.totalProfit}
      userName={user.name}
      winRate={analytics.winRate}
    >
      {children}
    </DashboardShell>
  );
}
