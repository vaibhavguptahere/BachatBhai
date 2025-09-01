import { db } from "@/lib/prisma";
import { checkUserId } from "@/lib/checkUser";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

// Parse natural date ranges
function parseDateRange(query) {
  const today = dayjs();
  let start = null, end = null;
  query = query?.toLowerCase() || "";

  if (query.includes("today")) {
    start = today.startOf("day").toDate();
    end = today.endOf("day").toDate();
  } else if (query.includes("yesterday")) {
    start = today.subtract(1, "day").startOf("day").toDate();
    end = today.subtract(1, "day").endOf("day").toDate();
  } else if (query.includes("this week")) {
    start = today.startOf("week").toDate();
    end = today.endOf("week").toDate();
  } else if (query.includes("last week")) {
    start = today.subtract(1, "week").startOf("week").toDate();
    end = today.subtract(1, "week").endOf("week").toDate();
  } else if (query.includes("this month")) {
    start = today.startOf("month").toDate();
    end = today.endOf("month").toDate();
  } else if (query.includes("last month")) {
    start = today.subtract(1, "month").startOf("month").toDate();
    end = today.subtract(1, "month").endOf("month").toDate();
  } else {
    const monthMatch = query.match(/(january|february|march|april|may|june|july|august|september|october|november|december)\s*(\d{4})?/i);
    if (monthMatch) {
      const month = monthMatch[1];
      const year = monthMatch[2] || today.year();
      start = dayjs(`${month} ${year}`, "MMMM YYYY").startOf("month").toDate();
      end = dayjs(`${month} ${year}`, "MMMM YYYY").endOf("month").toDate();
    }
  }
  return { start, end };
}

// Filter transactions
async function getFilteredTransactions({ type, accountName, startDate, endDate }) {
  const user = await checkUserId();
  if (!user) throw new Error("Unauthorised");

  let accountFilter = {};
  if (accountName) {
    const account = await db.account.findFirst({
      where: { userId: user.id, name: accountName },
    });
    if (!account) return { error: `Account "${accountName}" not found.` };
    accountFilter = { accountId: account.id };
  }

  const where = {
    userId: user.id,
    ...(type ? { type } : {}),
    ...accountFilter,
    ...(startDate && endDate ? { date: { gte: startDate, lte: endDate } } : {}),
  };

  const transactions = await db.transaction.findMany({ where });
  return transactions;
}

// Format table
function formatTable(rows, headers) {
  const colWidths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map(r => String(r[i]).length))
  );

  const line = colWidths.map(w => "-".repeat(w + 2)).join("+");
  const header = headers.map((h, i) => ` ${h.padEnd(colWidths[i])} `).join("|");
  const body = rows
    .map(row => row.map((c, i) => ` ${String(c).padEnd(colWidths[i])} `).join("|"))
    .join("\n");

  return `${line}\n${header}\n${line}\n${body}\n${line}`;
}

// ======================
// Exported Functions
// ======================

// 1. Income & Expense summary
export async function getIncomeAndExpense({ dateQuery, accountName } = {}) {
  const { start, end } = parseDateRange(dateQuery);
  const transactions = await getFilteredTransactions({ type: null, accountName, startDate: start, endDate: end });
  if (transactions.error) return transactions.error;

  const incomeTx = transactions.filter(t => t.type === "INCOME");
  const expenseTx = transactions.filter(t => t.type === "EXPENSE");

  const income = incomeTx.reduce((sum, t) => sum + Number(t.amount), 0);
  const expense = expenseTx.reduce((sum, t) => sum + Number(t.amount), 0);

  return `💰 Total Income: ₹${income} (${incomeTx.length} tx)\n💸 Total Expense: ₹${expense} (${expenseTx.length} tx)`;
}

// 2. Category-wise expense
export async function getSpendingByCategory({ dateQuery, accountName } = {}) {
  const { start, end } = parseDateRange(dateQuery);
  const transactions = await getFilteredTransactions({ type: "EXPENSE", accountName, startDate: start, endDate: end });
  if (transactions.error) return transactions.error;
  if (!transactions.length) return "No expenses found.";

  const grouped = {};
  for (const t of transactions) {
    if (!grouped[t.category]) grouped[t.category] = { total: 0, count: 0 };
    grouped[t.category].total += Number(t.amount);
    grouped[t.category].count += 1;
  }

  return Object.entries(grouped)
    .map(([cat, data]) => `${cat}: ₹${data.total} (${data.count} tx)`)
    .join("\n");
}