"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";
import { checkUserId } from "@/lib/checkUser"; // import helper

const serializeTransaction = (obj) => {
  const serialized = { ...obj };

  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }
  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }

  return serialized;
};

// Create new account
export async function createAccount(data) {
  try {
    const user = await checkUserId();
    if (!user) throw new Error("Unauthorised");

    // Convert balance to float before saving
    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) {
      throw new Error("Invalid Balance Amount");
    }

    // Check if this is the user's first account
    const existingAccounts = await db.account.findMany({
      where: { userId: user.id },
    });

    const shouldBeDefault =
      existingAccounts.length === 0 ? true : data.isDefault;

    // If this account should be default, unset other default accounts
    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const account = await db.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        userId: user.id,
        isDefault: shouldBeDefault,
      },
    });

    const serializeAccount = serializeTransaction(account);

    revalidatePath("/dashboard");

    return { success: true, data: serializeAccount };
  } catch (error) {
    throw new Error(error.message);
  }
}

// Get user accounts
export async function getUserAccounts() {
  const user = await checkUserId();
  if (!user) throw new Error("Unauthorised");

  const accounts = await db.account.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { transactions: true },
      },
    },
  });

  return accounts.map(serializeTransaction);
}

// Get dashboard transactions
export async function getDashboardData() {
  const user = await checkUserId();
  if (!user) throw new Error("Unauthorised");

  const transactions = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  return transactions.map(serializeTransaction);
}
