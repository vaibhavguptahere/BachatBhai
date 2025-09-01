import { db } from "@/lib/prisma";  // adjust if using Supabase client instead

export async function getSpending() {
  // Example query from Supabase/Prisma
  const result = await db.transaction.aggregate({
    _sum: { amount: true },
  });
  return `Total spending: ₹${result._sum.amount}`;
}

export async function getSpendingByCategory() {
  const result = await db.transaction.groupBy({
    by: ["category"],
    _sum: { amount: true },
  });
  return result.map(r => `${r.category}: ₹${r._sum.amount}`).join("\n");
}
