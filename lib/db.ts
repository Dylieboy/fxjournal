import { neon } from "@neondatabase/serverless";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const databaseUrl = process.env.DATABASE_URL;

export const sql = databaseUrl
  ? neon(databaseUrl)
  : ((() => {
      throw new Error("DATABASE_URL is required");
    }) as unknown as ReturnType<typeof neon>);

export type User = {
  id: string;
  name: string;
  email: string;
};

type StoredUser = User & {
  password_hash: string;
  created_at: string;
};

export type Trade = {
  id: string;
  symbol: string;
  account_currency: string;
  lot_size: string;
  risk_amount: string;
  reward_target: string;
  profit_loss: string;
  outcome: "win" | "loss" | "breakeven";
  setup: string | null;
  notes: string | null;
  lesson: string | null;
  opened_at: string;
  created_at: string;
};

type LocalData = {
  users: StoredUser[];
  trades: (Trade & { user_id: string })[];
};

const localDbPath = path.join(process.cwd(), ".data", "fxjournal.json");

async function readLocalData(): Promise<LocalData> {
  try {
    const file = await readFile(localDbPath, "utf8");
    return JSON.parse(file) as LocalData;
  } catch {
    return { users: [], trades: [] };
  }
}

async function writeLocalData(data: LocalData) {
  await mkdir(path.dirname(localDbPath), { recursive: true });
  await writeFile(localDbPath, JSON.stringify(data, null, 2));
}

function usingLocalDb() {
  return !databaseUrl;
}

export async function getUserByEmail(email: string) {
  if (usingLocalDb()) {
    const data = await readLocalData();
    return data.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  }

  const rows = (await sql`
    select id, name, email, password_hash
    from users
    where lower(email) = lower(${email})
    limit 1
  `) as unknown as (User & { password_hash: string })[];

  return rows[0];
}

export async function getUserById(id: string) {
  if (usingLocalDb()) {
    const data = await readLocalData();
    const user = data.users.find((item) => item.id === id);
    return user ? { id: user.id, name: user.name, email: user.email } : undefined;
  }

  const rows = (await sql`
    select id, name, email
    from users
    where id = ${id}
    limit 1
  `) as unknown as User[];

  return rows[0];
}

export async function createUser(name: string, email: string, passwordHash: string) {
  if (usingLocalDb()) {
    const data = await readLocalData();
    const user: StoredUser = {
      id: randomUUID(),
      name,
      email: email.toLowerCase(),
      password_hash: passwordHash,
      created_at: new Date().toISOString(),
    };

    data.users.push(user);
    await writeLocalData(data);

    return { id: user.id, name: user.name, email: user.email };
  }

  const rows = (await sql`
    insert into users (name, email, password_hash)
    values (${name}, lower(${email}), ${passwordHash})
    returning id, name, email
  `) as unknown as User[];

  return rows[0];
}

export async function getTradesForUser(userId: string) {
  if (usingLocalDb()) {
    const data = await readLocalData();
    return data.trades
      .filter((trade) => trade.user_id === userId)
      .sort((first, second) => {
        const firstTime = `${first.opened_at} ${first.created_at}`;
        const secondTime = `${second.opened_at} ${second.created_at}`;
        return secondTime.localeCompare(firstTime);
      })
      .map(({ user_id: _userId, ...trade }) => trade);
  }

  const rows = (await sql`
    select
      id,
      symbol,
      account_currency,
      lot_size::text,
      risk_amount::text,
      reward_target::text,
      profit_loss::text,
      outcome,
      setup,
      notes,
      lesson,
      opened_at::text,
      created_at::text
    from trades
    where user_id = ${userId}
    order by opened_at desc, created_at desc
  `) as unknown as Trade[];

  return rows;
}

export async function createTradeForUser(
  userId: string,
  trade: {
    symbol: string;
    accountCurrency: string;
    lotSize: number;
    riskAmount: number;
    rewardTarget: number;
    profitLoss: number;
    outcome: Trade["outcome"];
    setup: string;
    notes: string;
    lesson: string;
    openedAt: string;
  },
) {
  if (usingLocalDb()) {
    const data = await readLocalData();
    data.trades.push({
      id: randomUUID(),
      user_id: userId,
      symbol: trade.symbol.toUpperCase(),
      account_currency: trade.accountCurrency.toUpperCase(),
      lot_size: trade.lotSize.toFixed(2),
      risk_amount: trade.riskAmount.toFixed(2),
      reward_target: trade.rewardTarget.toFixed(2),
      profit_loss: trade.profitLoss.toFixed(2),
      outcome: trade.outcome,
      setup: trade.setup || null,
      notes: trade.notes || null,
      lesson: trade.lesson || null,
      opened_at: trade.openedAt,
      created_at: new Date().toISOString(),
    });
    await writeLocalData(data);
    return;
  }

  await sql`
    insert into trades (
      user_id,
      symbol,
      account_currency,
      lot_size,
      risk_amount,
      reward_target,
      profit_loss,
      outcome,
      setup,
      notes,
      lesson,
      opened_at
    )
    values (
      ${userId},
      upper(${trade.symbol}),
      upper(${trade.accountCurrency}),
      ${trade.lotSize},
      ${trade.riskAmount},
      ${trade.rewardTarget},
      ${trade.profitLoss},
      ${trade.outcome},
      ${trade.setup || null},
      ${trade.notes || null},
      ${trade.lesson || null},
      ${trade.openedAt}
    )
  `;
}

export async function deleteTradeForUser(userId: string, tradeId: string) {
  if (usingLocalDb()) {
    const data = await readLocalData();
    data.trades = data.trades.filter((trade) => trade.id !== tradeId || trade.user_id !== userId);
    await writeLocalData(data);
    return;
  }

  await sql`
    delete from trades
    where id = ${tradeId}
      and user_id = ${userId}
  `;
}
