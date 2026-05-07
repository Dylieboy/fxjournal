"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { clearSession, createSession, getSessionUser } from "@/lib/auth";
import {
  createTradeForUser,
  createUser,
  deleteTradeForUser,
  getUserByEmail,
} from "@/lib/db";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const signupSchema = authSchema.extend({
  name: z.string().min(2).max(80),
});

const tradeSchema = z.object({
  symbol: z.string().min(2).max(20),
  accountCurrency: z.string().min(3).max(5),
  lotSize: z.coerce.number().positive(),
  riskAmount: z.coerce.number().positive(),
  rewardTarget: z.coerce.number().positive(),
  profitLoss: z.coerce.number(),
  outcome: z.enum(["win", "loss", "breakeven"]),
  setup: z.string().max(160).optional().default(""),
  notes: z.string().max(2000).optional().default(""),
  lesson: z.string().max(2000).optional().default(""),
  openedAt: z.string().min(10).max(10),
});

function readString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function signUpAction(_: unknown, formData: FormData) {
  const parsed = signupSchema.safeParse({
    name: readString(formData, "name"),
    email: readString(formData, "email"),
    password: readString(formData, "password"),
  });

  if (!parsed.success) {
    return { error: "Please enter a name, valid email, and password of at least 8 characters." };
  }

  const existingUser = await getUserByEmail(parsed.data.email);
  if (existingUser) {
    return { error: "An account already exists for that email." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await createUser(parsed.data.name, parsed.data.email, passwordHash);
  await createSession(user.id);
  redirect("/dashboard");
}

export async function signInAction(_: unknown, formData: FormData) {
  const parsed = authSchema.safeParse({
    email: readString(formData, "email"),
    password: readString(formData, "password"),
  });

  if (!parsed.success) {
    return { error: "Please enter a valid email and password." };
  }

  const user = await getUserByEmail(parsed.data.email);
  if (!user) {
    return { error: "Incorrect email or password." };
  }

  const passwordMatches = await bcrypt.compare(parsed.data.password, user.password_hash);
  if (!passwordMatches) {
    return { error: "Incorrect email or password." };
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function signOutAction() {
  await clearSession();
  redirect("/signin");
}

export async function createTradeAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/signin");
  }

  const parsed = tradeSchema.safeParse({
    symbol: readString(formData, "symbol"),
    accountCurrency: readString(formData, "accountCurrency"),
    lotSize: formData.get("lotSize"),
    riskAmount: formData.get("riskAmount"),
    rewardTarget: formData.get("rewardTarget"),
    profitLoss: formData.get("profitLoss"),
    outcome: readString(formData, "outcome"),
    setup: readString(formData, "setup"),
    notes: readString(formData, "notes"),
    lesson: readString(formData, "lesson"),
    openedAt: readString(formData, "openedAt"),
  });

  if (!parsed.success) {
    redirect("/dashboard/add-trade?error=trade");
  }

  await createTradeForUser(user.id, parsed.data);
  revalidatePath("/dashboard");
  redirect("/dashboard/journal");
}

export async function deleteTradeAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/signin");
  }

  const tradeId = readString(formData, "tradeId");
  if (tradeId) {
    await deleteTradeForUser(user.id, tradeId);
  }

  revalidatePath("/dashboard");
}
