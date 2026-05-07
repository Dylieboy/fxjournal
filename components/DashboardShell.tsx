import Link from "next/link";
import { signOutAction } from "@/app/actions";
import { formatMoney } from "@/lib/analytics";

type DashboardShellProps = {
  children: React.ReactNode;
  currency: string;
  totalProfit: number;
  userName: string;
  winRate: number;
};

const navItems = [
  { href: "/dashboard/overview", label: "Overview" },
  { href: "/dashboard/add-trade", label: "Add trade" },
  { href: "/dashboard/journal", label: "Journal" },
];

export function DashboardShell({
  children,
  currency,
  totalProfit,
  userName,
  winRate,
}: DashboardShellProps) {
  return (
    <main className="terminal-shell">
      <div className="market-bg" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <aside className="desktop-rail glass-panel">
        <Link className="brand" href="/dashboard/overview">
          <span className="brand-mark">FX</span>
          <span>
            <strong>FX Journal</strong>
            <small>Trading desk</small>
          </span>
        </Link>

        <nav className="rail-nav">
          {navItems.map((item) => (
            <Link href={item.href} key={item.href}>
              <span className="nav-dot"></span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="rail-card">
          <span>Session P/L</span>
          <strong>{formatMoney(totalProfit, currency)}</strong>
          <small>{winRate.toFixed(0)}% win rate</small>
        </div>

        <form action={signOutAction}>
          <button className="button secondary full" type="submit">
            Sign out
          </button>
        </form>
      </aside>

      <div className="terminal-main">
        <header className="mobile-topbar glass-panel">
          <Link className="brand compact" href="/dashboard/overview">
            <span className="brand-mark">FX</span>
            <span>
              <strong>FX Journal</strong>
              <small>{userName}</small>
            </span>
          </Link>

          <details className="mobile-menu">
            <summary aria-label="Open trading menu">
              <span className="trade-burger">
                <i></i>
                <i></i>
                <i></i>
              </span>
            </summary>
            <div className="mobile-menu-panel">
              <nav className="rail-nav">
                {navItems.map((item) => (
                  <Link href={item.href} key={item.href}>
                    <span className="nav-dot"></span>
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="rail-card">
                <span>Session P/L</span>
                <strong>{formatMoney(totalProfit, currency)}</strong>
                <small>{winRate.toFixed(0)}% win rate</small>
              </div>
              <form action={signOutAction}>
                <button className="button secondary full" type="submit">
                  Sign out
                </button>
              </form>
            </div>
          </details>
        </header>

        <div className="page-stage">{children}</div>
      </div>
    </main>
  );
}
